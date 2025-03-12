import { Command } from 'commander'
import { seedDatabase } from './seed'
import { connectToDatabase, disconnectFromDatabase } from './config/database'
import { ProductionState } from './models/ProductionState.model'
import { SensorData } from './models/SensorData.model'
import { StateParameter } from './models/StateParameter.model'

const program = new Command()

program
  .name('vegetable-processing-factory')
  .description(
    'CLI tool for managing the vegetable processing factory database'
  )
  .version('1.0.0')

program
  .command('seed')
  .description('Seed the database with sample data')
  .action(async () => {
    await seedDatabase()
    process.exit(0)
  })

program
  .command('query')
  .description('Query the database')
  .action(async () => {
    try {
      await connectToDatabase()

      const productionStateCount = await ProductionState.countDocuments()
      const sensorDataCount = await SensorData.countDocuments()
      const stateParameterCount = await StateParameter.countDocuments()

      console.log('Database statistics:')
      console.log(`- Production States: ${productionStateCount}`)
      console.log(`- Sensor Data Points: ${sensorDataCount}`)
      console.log(`- State Parameters: ${stateParameterCount}`)

      const productionStateSample = await ProductionState.findOne()
      const sensorDataSample = await SensorData.findOne()
      const stateParameterSample = await StateParameter.findOne()

      console.log('\nSample Production State:')
      console.log(JSON.stringify(productionStateSample, null, 2))

      console.log('\nSample Sensor Data:')
      console.log(JSON.stringify(sensorDataSample, null, 2))

      console.log('\nSample State Parameter:')
      console.log(JSON.stringify(stateParameterSample, null, 2))
    } catch (error) {
      console.error('Error querying database:', error)
    } finally {
      await disconnectFromDatabase()
      process.exit(0)
    }
  })

program
  .action(() => {
    console.log('Welcome to the Vegetable Processing Factory Big Data System!')
    console.log('Use --help to see available commands')
    program.help()
  })
  .parse(process.argv)
