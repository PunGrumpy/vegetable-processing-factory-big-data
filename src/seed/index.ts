import { connectToDatabase, disconnectFromDatabase } from '../config/database'
import { ProductionState } from '../models/ProductionState.model'
import { SensorData } from '../models/SensorData.model'
import { StateParameter } from '../models/StateParameter.model'
import { seedProductionStates } from './production'
import { seedSensorData } from './sensors'
import { seedStateParameters } from './parameters'

// Helper function to insert documents in batches
async function insertInBatches(
  model: any,
  documents: any[],
  batchSize: number
) {
  try {
    const collectionName = model.collection.collectionName
    console.log(`Inserting data into ${collectionName} collection`)

    let successCount = 0
    let failureCount = 0

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)

      // Try inserting documents one at a time for better error isolation
      for (let j = 0; j < batch.length; j++) {
        try {
          await model.create(batch[j])
          successCount++
        } catch (docError) {
          failureCount++

          if (failureCount <= 5) {
            // Only show first 5 errors to avoid flooding console
            console.error(
              `Failed to insert into ${collectionName} at index ${i + j}:`,
              JSON.stringify(batch[j]).substring(0, 200) +
                (JSON.stringify(batch[j]).length > 200 ? '...' : '')
            )

            console.error(
              `Error: ${
                docError instanceof Error ? docError.message : String(docError)
              }`
            )

            // Show validation errors in detail
            if (
              docError &&
              typeof docError === 'object' &&
              'name' in docError &&
              docError.name === 'ValidationError' &&
              'errors' in docError &&
              docError.errors
            ) {
              const validationErrors = docError.errors as Record<
                string,
                { message: string }
              >
              Object.keys(validationErrors).forEach(key => {
                console.error(
                  `- Field "${key}": ${validationErrors[key].message}`
                )
              })
            }
          } else if (failureCount === 6) {
            console.error(`Additional errors omitted...`)
          }
        }
      }

      // Log progress
      console.log(
        `  Progress: ${Math.min(i + batchSize, documents.length)}/${
          documents.length
        } documents (${successCount} successful, ${failureCount} failed)`
      )
    }

    console.log(
      `Completed ${collectionName} insertion: ${successCount} successful, ${failureCount} failed`
    )

    if (failureCount > 0) {
      console.warn(
        `⚠️ ${failureCount} documents failed to insert into ${collectionName}`
      )
    }
  } catch (error) {
    console.error(`Error during batch insertion:`, error)
    throw error
  }
}

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...')
    await connectToDatabase()

    // Clear existing data
    await ProductionState.deleteMany({})
    await SensorData.deleteMany({})
    await StateParameter.deleteMany({})
    console.log('Cleared existing data from all collections')

    // Seed production states first and get the generated data
    const states = await seedProductionStates(insertInBatches)

    // Seed sensor data and state parameters sequentially to avoid overwhelming the database
    console.log('\n======= Seeding sensor data =======')
    await seedSensorData(states, insertInBatches)

    console.log('\n======= Seeding state parameters =======')
    await seedStateParameters(states, insertInBatches)

    console.log('\nDatabase seeding completed successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await disconnectFromDatabase()
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === Bun.main) {
  await seedDatabase()
}

export { insertInBatches }
