import axios from 'axios'
import { API_URL } from './env'

const axiosInstance = axios.create({
  baseURL: API_URL || 'http://localhost:3000',
})

axiosInstance.interceptors.request.use(
  async (config: any) => {
    // const state = store.getState()
    // const authToken: any = state.auth.token
    // if (authToken) {
    //   config.headers['Authorization'] = 'Bearer ' + authToken
    // }
    return config
  },
  (error: any) => {
    Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response: any) => {
    return response
  },
  (error: any) => {
    // if (axios.isCancel(error)) {
    //   console.log('Request canceled', error.message)
    // }
    if (error?.response?.data) {
      throw error?.response?.data
    }
    throw error
  }
)
export default axiosInstance
