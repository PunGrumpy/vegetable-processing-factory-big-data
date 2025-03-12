import { faker } from '@faker-js/faker'
import { SensorData } from '../models/SensorData.model'

const SENSORS_PER_STATE = 8

export async function generateSensorData(states: any[]) {
  const sensorData = []
  const sensorTypes = [
    'temperature',
    'humidity',
    'pressure',
    'flow_rate',
    'weight',
    'vibration',
    'proximity',
    'color'
  ]

  const units = {
    temperature: '°C',
    humidity: '%',
    pressure: 'kPa',
    flow_rate: 'L/min',
    weight: 'kg',
    vibration: 'Hz',
    proximity: 'mm',
    color: 'RGB'
  }

  const locations = [
    'Inlet',
    'Main Chamber',
    'Exit Point',
    'Conveyor',
    'Water Tank',
    'Control Unit'
  ]

  for (const state of states) {
    for (let i = 0; i < SENSORS_PER_STATE; i++) {
      const sensorType = faker.helpers.arrayElement(sensorTypes)
      const sensorData2 = {
        sensor_id: `SENSOR-${faker.string.alphanumeric(8).toUpperCase()}`,
        state_id: state.state_id,
        timestamp: new Date(
          state.timestamp.getTime() + faker.number.int({ min: 0, max: 1000 })
        ),
        sensor_type: sensorType,
        value: faker.number.float({ min: 0, max: 1000 }),
        unit: units[sensorType as keyof typeof units],
        location: faker.helpers.arrayElement(locations)
      }

      sensorData.push(sensorData2)
    }
  }

  return sensorData
}

export async function seedSensorData(states: any[], insertInBatches: any) {
  console.log('Generating sensor data...')
  const sensorData = await generateSensorData(states)
  console.log(`Generated ${sensorData.length} sensor readings`)

  console.log('Inserting sensor data...')
  await insertInBatches(SensorData, sensorData, 100)
}
