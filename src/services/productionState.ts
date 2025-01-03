import { client } from '@/config/database'

interface ProductionState {
  batchId: string
  stateId: string
  stateName: string
  previousState: string
  parameters: Record<string, any>
}

export const recordProductionState = async (stateData: ProductionState) => {
  const query = `
    INSERT INTO production_states (
      batch_id, state_id, timestamp, state_name, 
      previous_state, duration, parameters
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  const params = [
    stateData.batchId,
    stateData.stateId,
    new Date(),
    stateData.stateName,
    stateData.previousState,
    0,
    JSON.stringify(stateData.parameters)
  ]

  try {
    await client.execute(query, params, { prepare: true })
    console.log(
      `📝 Recorded state ${stateData.stateName} for batch ${stateData.batchId}`
    )
  } catch (error) {
    console.error('Error recording production state:', error)
    throw error
  }
}

export const getProductionStates = async (batchId: string) => {
  const query = `
    SELECT * FROM production_states 
    WHERE batch_id = ?
    ORDER BY timestamp DESC
  `

  const params = [batchId]

  try {
    const result = await client.execute(query, params, { prepare: true })
    return result.rows
  } catch (error) {
    console.error('Error getting production states:', error)
    throw error
  }
}
