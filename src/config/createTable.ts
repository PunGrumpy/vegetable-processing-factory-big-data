import { client } from '@/config/database'

export async function createTables() {
  const production_states_query = `
    CREATE TABLE IF NOT EXISTS production_states (
      batch_id uuid,
      state_id uuid,
      timestamp timestamp,
      state_name text,
      previous_state text,
      duration int,
      temperature double,
      humidity double,
      conveyor_speed double,
      product_count int,
      defect_percentage double,
      water_consumption double,
      energy_consumption double,
      PRIMARY KEY ((batch_id), timestamp, state_id)
    ) WITH CLUSTERING ORDER BY (timestamp DESC)`

  const sensor_data_query = `
    CREATE TABLE IF NOT EXISTS sensor_data (
      sensor_id uuid,
      state_id uuid,
      timestamp timestamp,
      sensor_type text,
      value double,
      unit text,
      location text,
      PRIMARY KEY ((state_id), timestamp, sensor_id)
    ) WITH CLUSTERING ORDER BY (timestamp DESC)`

  const state_param_query = `
  CREATE TABLE IF NOT EXISTS state_parameters (
      state_id uuid,
      parameter_name text,
      parameter_type text,
      numeric_value double,
      text_value text,
      boolean_value boolean,
      timestamp timestamp,
      PRIMARY KEY ((state_id), parameter_name, timestamp)
    ) WITH CLUSTERING ORDER BY (parameter_name ASC, timestamp DESC)`

  try {
    // Create the tables
    await client.execute(production_states_query)
    await client.execute(sensor_data_query)
    await client.execute(state_param_query)
    console.log('Tables created successfully')
  } catch (error) {
    console.error('Error creating tables:', error)
    throw error
  }
}
