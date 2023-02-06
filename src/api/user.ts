import type { loginUser, registerUser } from "@/interface/user"
import { Encrypt } from "@/utils/cryptoAES"
import api from "@/utils/request"
import { getCookie } from "@/api/cookie"
import { TokenStore } from "@/stores/TokenStore"
import type { ResponseTokens } from "@/interface/token"

export const login = async (user: loginUser) => {
  await getCookie()
  const tokenStore = TokenStore()
  const EncryptUser = { ...user, password: Encrypt(user.password) }
  const data = await api<ResponseTokens>({ url: "/user/login", data: EncryptUser, method: "POST" })
  data.action ? tokenStore.setTokens(data.data!.tokens) : null
  return data
}

export const refreshToken = async () => {
  const tokenStore = TokenStore()
  const data = await api<ResponseTokens>({ url: "/user/refresh", method: "POST" })
  tokenStore.setTokens(data.data!.tokens)
}

export const register = async (user: registerUser) => {
  await getCookie()
  const EncryptUser = { account: user.account, password: Encrypt(user.password), captcha: user.captcha }
  return await api({ url: "/user", data: EncryptUser, method: "POST" })
}

export const checkAccountAvailable = async (account: string) => {
  return await api({ url: `/user/account/${account}`, method: "GET" })
}
