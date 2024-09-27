import axios from 'axios'

const _axios = axios.create()

const client = async (endpoint: string) => {
  try {
    const response = await _axios.get(endpoint)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export default client
