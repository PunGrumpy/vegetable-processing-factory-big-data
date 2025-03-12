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

  const usedCombinations = new Set()

  for (const state of states) {
    const selectedParameters = faker.helpers
      .shuffle([...parameterNames])
      .slice(0, PARAMETERS_PER_STATE)

    for (const paramName of selectedParameters) {
      let parameterType: string

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

      const baseTimestamp = state.timestamp.getTime()
      const offsetMillis = faker.number.int({ min: 100, max: 86400000 })
      const paramTimestamp = new Date(baseTimestamp + offsetMillis)

      const combinationKey = `${
        state.state_id
      }-${paramName}-${paramTimestamp.toISOString()}`

      if (usedCombinations.has(combinationKey)) {
        continue
      }

      usedCombinations.add(combinationKey)

      const parameter: any = {
        state_id: state.state_id,
        parameter_name: paramName,
        parameter_type: parameterType,
        timestamp: paramTimestamp
      }

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

  console.log('Inserting state parameters...')
  await insertInBatches(StateParameter, stateParameters, 10)

  return stateParameters
}

if (import.meta.url === Bun.main) {
  const { connectToDatabase, disconnectFromDatabase } = await import(
    '../config/database'
  )
  const { insertInBatches } = await import('./index')

  try {
    await connectToDatabase()
    await StateParameter.deleteMany({})

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
