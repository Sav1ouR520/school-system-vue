import { TokenStore } from "@/stores/TokenStore"
import type { AxiosResponse, AxiosRequestConfig } from "axios"
import axios from "axios"

const request = axios.create({
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

request.interceptors.request.use(
  config => {
    if (config?.headers) {
      const tokenStore = TokenStore()
      if (tokenStore.verification) {
        config.headers.Authorization = "Bearer " + tokenStore.accessToken
      }
      if (config.url === "/user/refresh") {
        config.headers.Authorization = "Bearer " + tokenStore.refreshToken
      }
    }
    return config
  },
  error => Promise.reject(error),
)

request.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response.status === 401) {
      const tokenStore = TokenStore()
      if (tokenStore.outOfDate) {
        tokenStore.refresh()
      } else {
        tokenStore.$reset()
      }
    }
    return Promise.reject(error.response)
  },
)

export type Response<T = any> = {
  data?: T
  action: boolean
  message: string
}

const api = <T>(config: AxiosRequestConfig) => {
  return new Promise<Response<T>>((res, rej) => {
    request
      .request<Response<T>>(config)
      .then(response => {
        res(response.data)
      })
      .catch((err: any) => {
        rej(err)
      })
  })
}
export default api
