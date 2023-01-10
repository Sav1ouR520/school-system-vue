import type { loginUser, registerUser } from "@/interface/user"
import { TokenStore } from "@/stores/TokenStore"
import { Encrypt } from "@/utils/cryptoAES"
import api from "@/utils/request"

const tokenStore = TokenStore()
export const login = async (user: loginUser) => {
  const EncryptUser = { ...user, password: Encrypt(user.password) }
  const data = await api.post("/auth/login", EncryptUser)
  console.log(data.data.token)
  data.data.validation ? tokenStore.setTokens(data.data.token) : null
  return data
}

export const register = async (user: registerUser) => {
  const EncryptUser = { account: user.account, password: Encrypt(user.password), captcha: user.captcha }
  return await api.post("/user/register", EncryptUser)
}

export const checkAccountAvailable = async (account: string) => {
  return await api.get(`/user/register/${account}`)
}
