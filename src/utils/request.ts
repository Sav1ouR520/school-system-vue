import type { Token } from "@/interface/token"
import axios from "axios"
const api = axios.create({
  withCredentials: true,
  baseURL: "/api/v1",
  timeout: 3000,
})

declare module "axios" {
  interface AxiosResponse<T = any> {
    statusCode: number
    data: T
    message: string
    timestamp: Date
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance
}

api.interceptors.request.use(
  config => {
    if (config?.headers) {
      const tokenStore = localStorage.getItem("TokenStore")
      if (tokenStore) {
        const token: Token = JSON.parse(tokenStore)
        config.headers.Authorization = token.acceptToken
      }
    }
    return config
  },
  error => Promise.reject(error),
)

api.interceptors.response.use(
  response => {
    if (response.status === 200 || response.status === 201) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response.data)
    }
  },
  error => {
    return Promise.reject(error.response)
  },
)

export default api
