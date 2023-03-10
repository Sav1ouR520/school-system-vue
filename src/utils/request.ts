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
    console.log(router.currentRoute.value.path)
    return response
  },
  async error => {
    if (error.response.status === 401) {
      const path = router.currentRoute.value.path
      const tokenStore = TokenStore()
      if (tokenStore.outOfDate) {
        await tokenStore.refresh()
        router.push(path)
      } else {
        tokenStore.$reset()
      }
    }
    return Promise.reject(error.response)
  },
)

export type ResponseData<T = any> = {
  statusCode: number
  data?: T
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
