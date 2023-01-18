import type { loginUser, registerUser } from "@/interface/user"
import { TokenStore } from "@/stores/TokenStore"
import { Encrypt } from "@/utils/cryptoAES"
import api from "@/utils/request"
import { getCookie } from "@/api/cookie"

const tokenStore = TokenStore()
export const login = async (user: loginUser) => {
  await getCookie()
  const EncryptUser = { ...user, password: Encrypt(user.password) }
  const data = await api.post("/user/login", EncryptUser)
  data.data.validation ? tokenStore.setTokens(data.data.token) : null
  return data
}

export const register = async (user: registerUser) => {
  await getCookie()
  const EncryptUser = { account: user.account, password: Encrypt(user.password), captcha: user.captcha }
  return await api.post("/user", EncryptUser)
}

export const checkAccountAvailable = async (account: string) => {
  return await api.get(`/user/account/${account}`)
}
