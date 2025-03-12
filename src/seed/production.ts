import { faker } from '@faker-js/faker'
import { ProductionState } from '../models/ProductionState.model'

const BATCH_COUNT = 10
const STATES_PER_BATCH = 5

export async function generateProductionStates() {
  const states = []
  const stateNames = [
    'Washing',
    'Sorting',
    'Peeling',
    'Cutting',
    'Blanching',
    'Cooling',
    'Packaging',
    'Quality Control'
  ]

  for (let batchIndex = 0; batchIndex < BATCH_COUNT; batchIndex++) {
    const batchId = `BATCH-${faker.string.alphanumeric(8).toUpperCase()}`
    let previousState = null

    for (let stateIndex = 0; stateIndex < STATES_PER_BATCH; stateIndex++) {
      const stateId = `STATE-${faker.string.alphanumeric(10).toUpperCase()}`
      const stateName = faker.helpers.arrayElement(stateNames)
      const timestamp = faker.date.recent({ days: 30 })

      states.push({
        batch_id: batchId,
        state_id: stateId,
        timestamp,
        state_name: stateName,
        previous_state: previousState,
        duration: faker.number.int({ min: 10, max: 120 }),
        temperature: faker.number.float({ min: 5, max: 95 }),
        humidity: faker.number.float({ min: 30, max: 90 }),
        conveyor_speed: faker.number.float({ min: 0.5, max: 5 }),
        product_count: faker.number.int({ min: 100, max: 5000 }),
        defect_percentage: faker.number.float({ min: 0, max: 10 }),
        water_consumption: faker.number.float({ min: 50, max: 500 }),
        energy_consumption: faker.number.float({ min: 10, max: 200 })
      })

      previousState = stateId
    }
  }

  return states
}

export async function seedProductionStates(insertInBatches: any) {
  console.log('Generating production states...')
  const states = await generateProductionStates()
  console.log(`Generated ${states.length} production states`)

  console.log('Inserting production states...')
  await insertInBatches(ProductionState, states, 100)
  return states
}
