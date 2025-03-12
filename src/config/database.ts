import mongoose from 'mongoose'

export async function connectToDatabase() {
  try {
    const uri = process.env.MONGODB_URI || ''
    const dbName = process.env.MONGODB_DB || ''

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables')
    }

    await mongoose.connect(uri, {
      dbName
    })

    console.log('Connected to MongoDB database')
    return mongoose.connection
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

export async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB database')
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error)
  }
}
