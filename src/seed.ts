import { v4 as uuidv4 } from 'uuid'
import { client } from '@/config/database'

async function seedData() {
  // Connect to the database
  client.keyspace = 'vegetable_processing'
  await client.connect()

  // Generate UUIDs
  const batchId = uuidv4()
  const stateIds = {
    reception: uuidv4(),
    sorting: uuidv4(),
    washing: uuidv4()
  }
  const sensorIds = {
    temp1: uuidv4(),
    temp2: uuidv4(),
    ph1: uuidv4(),
    humidity1: uuidv4()
  }

  // Seed Production States
  const productionStates = [
    {
      batch_id: batchId,
      state_id: stateIds.reception,
      timestamp: new Date(),
      state_name: 'reception',
      previous_state: null,
      duration: 1800,
      temperature: 25.4,
      humidity: 65.2,
      conveyor_speed: 0.5,
      product_count: 1000,
      defect_percentage: 0.5,
      water_consumption: 0,
      energy_consumption: 10.5
    },
    {
      batch_id: batchId,
      state_id: stateIds.sorting,
      timestamp: new Date(Date.now() + 1800000),
      state_name: 'sorting',
      previous_state: 'reception',
      duration: 3600,
      temperature: 24.8,
      humidity: 66.5,
      conveyor_speed: 0.4,
      product_count: 950,
      defect_percentage: 2.1,
      water_consumption: 100,
      energy_consumption: 15.2
    }
  ]

  // Seed Sensor Data
  const sensorData = [
    {
      sensor_id: sensorIds.temp1,
      state_id: stateIds.reception,
      timestamp: new Date(),
      sensor_type: 'temperature',
      value: 25.4,
      unit: 'celsius',
      location: 'reception_area'
    },
    {
      sensor_id: sensorIds.humidity1,
      state_id: stateIds.reception,
      timestamp: new Date(),
      sensor_type: 'humidity',
      value: 65.2,
      unit: 'percent',
      location: 'reception_area'
    }
  ]

  // Seed State Parameters
  const stateParameters = [
    {
      state_id: stateIds.reception,
      parameter_name: 'color_quality',
      parameter_type: 'numeric',
      numeric_value: 98.5,
      text_value: null,
      boolean_value: null,
      timestamp: new Date()
    },
    {
      state_id: stateIds.sorting,
      parameter_name: 'foreign_matter_detected',
      parameter_type: 'boolean',
      numeric_value: null,
      text_value: null,
      boolean_value: false,
      timestamp: new Date()
    }
  ]

  try {
    // Insert Production States
    for (const state of productionStates) {
      await client.execute(
        `
        INSERT INTO production_states (
          batch_id, state_id, timestamp, state_name, previous_state,
          duration, temperature, humidity, conveyor_speed, product_count,
          defect_percentage, water_consumption, energy_consumption
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        Object.values(state),
        { prepare: true }
      )
    }

    // Insert Sensor Data
    for (const sensor of sensorData) {
      await client.execute(
        `
        INSERT INTO sensor_data (
          sensor_id, state_id, timestamp, sensor_type,
          value, unit, location
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        Object.values(sensor),
        { prepare: true }
      )
    }

    // Insert State Parameters
    for (const param of stateParameters) {
      await client.execute(
        `
        INSERT INTO state_parameters (
          state_id, parameter_name, parameter_type,
          numeric_value, text_value, boolean_value, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        Object.values(param),
        { prepare: true }
      )
    }

    console.log('Seed data inserted successfully')
  } catch (error) {
    console.error('Error seeding data:', error)
    throw error
  }
}

seedData()
