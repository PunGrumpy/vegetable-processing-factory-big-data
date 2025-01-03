import { client } from '@/config/database'

export async function createKeyspace() {
  const query = `
    CREATE KEYSPACE IF NOT EXISTS vegetable_processing
    WITH replication = {
      'class': 'SimpleStrategy',
      'replication_factor': 3
    }
  `

  try {
    await client.execute(query)
    console.log('Keyspace created successfully')
  } catch (error) {
    console.error('Error creating keyspace:', error)
    throw error
  }
}
