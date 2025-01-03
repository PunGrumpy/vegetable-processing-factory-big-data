import { client } from '@/config/database'
import { format } from 'date-fns'

export async function queryData() {
  // Connect to the database
  await client.connect()

  try {
    // 1. Query Production States
    const productionStates = await client.execute(
      'SELECT * FROM production_states'
    )
    console.log('\n=== Production States ===')
    console.table(
      productionStates.rows.map(row => ({
        batch_id: row.batch_id,
        state_name: row.state_name,
        timestamp: format(row.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        temperature: `${row.temperature}°C`,
        humidity: `${row.humidity}%`,
        product_count: row.product_count,
        defect_percentage: `${row.defect_percentage}%`
      }))
    )

    // 2. Query Sensor Data
    const sensorData = await client.execute('SELECT * FROM sensor_data')
    console.log('\n=== Sensor Data ===')
    console.table(
      sensorData.rows.map(row => ({
        sensor_type: row.sensor_type,
        location: row.location,
        value: `${row.value} ${row.unit}`,
        timestamp: format(row.timestamp, 'yyyy-MM-dd HH:mm:ss')
      }))
    )

    // 3. Query State Parameters
    const stateParams = await client.execute('SELECT * FROM state_parameters')
    console.log('\n=== State Parameters ===')
    console.table(
      stateParams.rows.map(row => ({
        parameter_name: row.parameter_name,
        parameter_type: row.parameter_type,
        value: row.numeric_value || row.text_value || row.boolean_value,
        timestamp: format(row.timestamp, 'yyyy-MM-dd HH:mm:ss')
      }))
    )

    // 4. Query Latest Values per Batch
    const latestValues = await client.execute(`
        SELECT batch_id, state_name, temperature, humidity, defect_percentage, timestamp 
        FROM production_states 
        PER PARTITION LIMIT 1
      `)
    console.log('\n=== Latest Values per Batch ===')
    console.table(
      latestValues.rows.map(row => ({
        batch_id: row.batch_id,
        state_name: row.state_name,
        temperature: `${row.temperature}°C`,
        humidity: `${row.humidity}%`,
        defect_percentage: `${row.defect_percentage}%`,
        timestamp: format(row.timestamp, 'yyyy-MM-dd HH:mm:ss')
      }))
    )

    // 5. Query Batch Summary
    const batchSummary = await client.execute(`
        SELECT 
          batch_id,
          COUNT(*) as state_count,
          MAX(temperature) as max_temp,
          MIN(temperature) as min_temp,
          MAX(defect_percentage) as max_defect
        FROM production_states
        GROUP BY batch_id
      `)
    console.log('\n=== Batch Summary ===')
    console.table(
      batchSummary.rows.map(row => ({
        batch_id: row.batch_id,
        state_count: row.state_count,
        temp_range: `${row.min_temp}°C - ${row.max_temp}°C`,
        max_defect: `${row.max_defect}%`
      }))
    )
  } catch (error) {
    console.error('Error querying data:', error)
  }
}

// Execute all queries
if (require.main === module) {
  queryData().then(() => process.exit(0))
}
