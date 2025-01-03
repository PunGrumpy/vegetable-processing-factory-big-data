import { Client } from 'cassandra-driver'

export const client = new Client({
  contactPoints: ['localhost'],
  localDataCenter: 'datacenter1'
})

export async function connect() {
  try {
    client.keyspace = 'vegetable_processing'
    await client.connect()
    console.log('👾 Connected to ScyllaDB')
  } catch (error) {
    console.error('Error connecting to ScyllaDB:', error)
    throw error
  }
}

export async function connectWithoutKeyspace() {
  try {
    await client.connect()
    console.log('👾 Connected to ScyllaDB')
  } catch (error) {
    console.error('Error connecting to ScyllaDB:', error)
    throw error
  }
}
