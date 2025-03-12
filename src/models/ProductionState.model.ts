import { Schema, model, Document } from 'mongoose'

export interface IProductionState extends Document {
  batch_id: string
  state_id: string
  timestamp: Date
  state_name: string
  previous_state?: string
  duration?: number
  temperature?: number
  humidity?: number
  conveyor_speed?: number
  product_count?: number
  defect_percentage?: number
  water_consumption?: number
  energy_consumption?: number
}

const productionStateSchema = new Schema<IProductionState>(
  {
    batch_id: { type: String, required: true },
    state_id: { type: String, required: true },
    timestamp: { type: Date, required: true },
    state_name: { type: String, required: true },
    previous_state: String,
    duration: Number,
    temperature: Number,
    humidity: Number,
    conveyor_speed: Number,
    product_count: Number,
    defect_percentage: Number,
    water_consumption: Number,
    energy_consumption: Number
  },
  {
    collection: 'production_states'
  }
)

productionStateSchema.index(
  { batch_id: 1, timestamp: -1, state_id: 1 },
  { unique: true, name: 'unique_batch_timestamp_state' }
)

export const ProductionState = model<IProductionState>(
  'ProductionState',
  productionStateSchema
)
