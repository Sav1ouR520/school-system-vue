import type { loginUser, registerUser } from "@/interface/user"
import { TokenStore } from "@/stores/TokenStore"
import api from "@/utils/request"
const tokenStore = TokenStore()
export const login = async (user: loginUser) => {
  const data = await api.post("/auth/login", user)
  tokenStore.setTokens(data["data"] || { acceptToken: "", refreshToken: "" })
  return data
}

export const register = async (user: registerUser) => {
  return await api.post("/user/register", user)
}

export const checkAccountAvailable = async (account: string) => {
  return await api.get(`/user/register/${account}`)
}
