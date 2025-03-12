import { Schema, model, Document } from 'mongoose'

export interface ISensorData extends Document {
  sensor_id: string
  state_id: string
  timestamp: Date
  sensor_type: string
  value: number
  unit?: string
  location?: string
}

const sensorDataSchema = new Schema<ISensorData>(
  {
    sensor_id: { type: String, required: true },
    state_id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    sensor_type: { type: String, required: true },
    value: { type: Number, required: true },
    unit: String,
    location: String
  },
  {
    collection: 'sensor_data'
  }
)

sensorDataSchema.index(
  { state_id: 1, timestamp: -1, sensor_id: 1 },
  { unique: true, name: 'unique_state_timestamp_sensor' }
)

export const SensorData = model<ISensorData>('SensorData', sensorDataSchema)
