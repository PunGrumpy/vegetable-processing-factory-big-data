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
        parameters map<text, text>,
        PRIMARY KEY ((batch_id), timestamp, state_id)
    ) WITH CLUSTERING ORDER BY (timestamp DESC)
    `

  const sensor_data_query = `
    CREATE TABLE IF NOT EXISTS sensor_data (
        sensor_id uuid,
        state_id uuid,
        timestamp timestamp,
        sensor_type text,
        value double,
        unit text,
        location text,
        PRIMARY KEY ((sensor_id, state_id), timestamp)
    ) WITH CLUSTERING ORDER BY (timestamp DESC)
    `

  const alerts_query = `
    CREATE TABLE IF NOT EXISTS alerts (
        alert_id uuid,
        state_id uuid,
        sensor_id uuid,
        timestamp timestamp,
        alert_type text,
        severity text,
        description text,
        status text,
        PRIMARY KEY ((state_id), timestamp, alert_id)
    ) WITH CLUSTERING ORDER BY (timestamp DESC)
    `

  try {
    // Create the tables
    await client.execute(production_states_query)
    await client.execute(sensor_data_query)
    await client.execute(alerts_query)
    console.log('Tables created successfully')
  } catch (error) {
    console.error('Error creating tables:', error)
    throw error
  }
}
