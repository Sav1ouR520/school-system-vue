import { TokenStore } from "@/stores/TokenStore"
import type { AxiosRequestConfig } from "axios"
import axios from "axios"
import router from "@/router"

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
  async config => {
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
  async error => {
    const tokenStore = TokenStore()
    if (error.response.status === 401 && error.config.url === "/user/refresh") {
      tokenStore.$reset()
      router.push("/")
      ElNotification({ message: `无效TOKEN`, type: "error" })
    } else if (error.response.status === 401) {
      if (tokenStore.outOfrefreshDate) {
        tokenStore.$reset()
        router.push("/")
      }
      await tokenStore.refresh()
      return request.request<ResponseData>(error.config)
    } else if (error.response.status === 403) {
      tokenStore.$reset()
      router.push("/")
      ElNotification({ message: `账号被封禁`, type: "error" })
    }
    return Promise.reject(error.response)
  },
)

export type ResponseData<T = any> = {
  statusCode: number
  data: T
  action: boolean
  message: string
  timestamp: Date
}

const api = <T>(config: AxiosRequestConfig) => {
  return new Promise<ResponseData<T>>((res, rej) => {
    request
      .request<ResponseData<T>>(config)
      .then(response => {
        res(response.data)
      })
      .catch((err: any) => {
        rej(err)
      })
  })
}
export default api
