import { createKeyspace } from '@/config/createKeyspace'
import { createTables } from '@/config/createTable'
import { connect, connectWithoutKeyspace } from '@/config/database'

const initializeDatabase = async () => {
  try {
    await connectWithoutKeyspace()
    await createKeyspace()
    // re-connect with the keyspace
    await connect()
    await createTables()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  }
}

initializeDatabase()
