import { connect } from '@/config/database'
import {
  getProductionStates,
  recordProductionState
} from '@/services/productionState'

const Seeding = async () => {
  try {
    // Connect to the database
    await connect()

    const productionState = {
      batchId: '123e4567-e89b-12d3-a456-426614174000',
      stateId: '123e4567-e89b-12d3-a456-426614174001',
      stateName: 'sorting',
      previousState: 'reception',
      parameters: {
        temperature: 25.4,
        humidity: 65.2,
        conveyorSpeed: 0.5,
        productCount: 1000
      }
    }

    await recordProductionState(productionState)
    const states = await getProductionStates(productionState.batchId)
    console.log('Production states:', states)
  } catch (error) {
    console.error('Error seeding production states:', error)
  }
}

Seeding()
