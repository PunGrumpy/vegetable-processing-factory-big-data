import { Schema, model, Document } from 'mongoose'

export interface IStateParameter extends Document {
  state_id: string
  parameter_name: string
  parameter_type: string
  numeric_value?: number
  text_value?: string
  boolean_value?: boolean
  timestamp: Date
}

const stateParameterSchema = new Schema<IStateParameter>(
  {
    state_id: { type: String, required: true },
    parameter_name: { type: String, required: true },
    parameter_type: { type: String, required: true },
    numeric_value: Number,
    text_value: String,
    boolean_value: Boolean,
    timestamp: { type: Date, required: true }
  },
  {
    collection: 'state_parameters'
  }
)

stateParameterSchema.index(
  { state_id: 1, parameter_name: 1, timestamp: -1 },
  { unique: true, name: 'unique_state_parameter_timestamp' }
)

export const StateParameter = model<IStateParameter>(
  'StateParameter',
  stateParameterSchema
)
