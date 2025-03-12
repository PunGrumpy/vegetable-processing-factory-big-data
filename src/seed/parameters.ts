import { faker } from '@faker-js/faker'
import { StateParameter } from '../models/StateParameter.model'

const PARAMETERS_PER_STATE = 6

export async function generateStateParameters(states: any[]) {
  const stateParameters = []
  const parameterNames = [
    'target_temperature',
    'process_duration',
    'quality_threshold',
    'water_level',
    'energy_setting',
    'motor_rpm',
    'cleaning_cycle',
    'maintenance_status'
  ]

  // Keep track of all used state_id + parameter_name combinations to avoid duplicates
  const usedCombinations = new Set()

  for (const state of states) {
    // Get unique parameters to avoid duplicate key errors
    const selectedParameters = faker.helpers
      .shuffle([...parameterNames])
      .slice(0, PARAMETERS_PER_STATE)

    for (const paramName of selectedParameters) {
      let parameterType: string

      // Determine parameter type based on name
      if (paramName.includes('status') || paramName.includes('cycle')) {
        parameterType = 'boolean'
      } else if (
        paramName.includes('threshold') ||
        paramName.includes('setting')
      ) {
        parameterType = 'text'
      } else {
        parameterType = 'numeric'
      }

      // Create a unique timestamp for this parameter within this state
      // Make sure it's at least 1 second apart from any other parameter in this state
      const baseTimestamp = state.timestamp.getTime()
      const offsetMillis = faker.number.int({ min: 100, max: 86400000 }) // Between 100ms and 24 hours
      const paramTimestamp = new Date(baseTimestamp + offsetMillis)

      // Create a unique combination key
      const combinationKey = `${
        state.state_id
      }-${paramName}-${paramTimestamp.toISOString()}`

      // Skip if we've already used this combination
      if (usedCombinations.has(combinationKey)) {
        continue
      }

      usedCombinations.add(combinationKey)

      // Build parameter object with required fields first
      const parameter: any = {
        state_id: state.state_id,
        parameter_name: paramName,
        parameter_type: parameterType,
        timestamp: paramTimestamp
      }

      // Add the type-specific value based on parameter_type
      if (parameterType === 'boolean') {
        parameter.boolean_value = faker.datatype.boolean()
      } else if (parameterType === 'text') {
        parameter.text_value = faker.helpers.arrayElement([
          'low',
          'medium',
          'high',
          'critical'
        ])
      } else if (parameterType === 'numeric') {
        parameter.numeric_value = faker.number.float({ min: 0, max: 1000 })
      }

      stateParameters.push(parameter)
    }
  }

  return stateParameters
}

export async function seedStateParameters(states: any[], insertInBatches: any) {
  console.log('Generating state parameters...')
  const stateParameters = await generateStateParameters(states)
  console.log(`Generated ${stateParameters.length} state parameters`)

  // Use a smaller batch size for parameters to reduce the chance of errors
  console.log('Inserting state parameters...')

  // Use an even smaller batch size for safer insertion
  await insertInBatches(StateParameter, stateParameters, 10)

  return stateParameters
}

// If this file is executed directly, just run the parameter seeding
if (import.meta.url === Bun.main) {
  const { connectToDatabase, disconnectFromDatabase } = await import(
    '../config/database'
  )
  const { insertInBatches } = await import('./index')

  try {
    await connectToDatabase()
    await StateParameter.deleteMany({})

    // Generate some fake states to test with
    const testStates = Array(5)
      .fill(null)
      .map((_, i) => ({
        state_id: `TEST-STATE-${i}`,
        timestamp: new Date()
      }))

    await seedStateParameters(testStates, insertInBatches)
    console.log('Parameter seeding completed successfully')
  } catch (error) {
    console.error('Error seeding parameters:', error)
  } finally {
    await disconnectFromDatabase()
  }
}
