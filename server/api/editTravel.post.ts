import { editTravel } from '../services/travelService'

export default async function eventHandler(event): Promise<boolean> {
  const payload = await readBody(event)

  try {
    await editTravel(payload)
  } catch (error) {
    console.error('Error:', error)
    return false
  }

  return true
}