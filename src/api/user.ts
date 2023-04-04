import type { UserPageInfo, LoginUser, RegisterUser, ModifyUserPassWord, FindAllUser, UpdataUser, UserList } from "@/interface/user"
import { Encrypt } from "@/utils/cryptoAES"
import api from "@/utils/request"
import { getCookie } from "@/api/cookie"
import { TokenStore } from "@/stores/TokenStore"
import type { ResponseTokens } from "@/interface/token"

export const login = async (user: LoginUser) => {
  await getCookie()
  const tokenStore = TokenStore()
  const EncryptUser = { ...user, password: Encrypt(user.password) }
  const data = await api<ResponseTokens>({ url: "/user/login", data: EncryptUser, method: "POST" })
  if (data.action) {
    tokenStore.$state.accessToken = data.data!.tokens.accessToken
    tokenStore.$state.refreshToken = data.data!.tokens.refreshToken
  }
  return data
}

export const refreshToken = async () => {
  const tokenStore = TokenStore()
  const data = await api<ResponseTokens>({ url: "/user/refresh", method: "POST" })
  tokenStore.$state.accessToken = data.data!.tokens.accessToken
  tokenStore.$state.refreshToken = data.data!.tokens.refreshToken
}

export const register = async (user: RegisterUser) => {
  await getCookie()
  const EncryptUser = { username: user.username, account: user.account, password: Encrypt(user.password), captcha: user.captcha }
  return api({ url: "/user", data: EncryptUser, method: "POST" })
}

export const checkAccountAvailable = (account: string) => {
  return api({ url: `/user/account/${account}`, method: "GET" })
}

export const getUserInfo = () => {
  return api<UserPageInfo>({ url: "/user", method: "GET" })
}

export const updateUserIcon = (icon: File) => {
  return api({ url: "/user/icon", data: { icon }, method: "PATCH", headers: { "Content-Type": "multipart/form-data" } })
}

export const updateUserPassword = async (data: ModifyUserPassWord) => {
  await getCookie()
  return api({
    url: "/user/password",
    data: {
      oldPassword: Encrypt(data.oldPassword),
      newPassword: Encrypt(data.newPassword),
      captcha: data.captcha,
    },
    method: "PATCH",
  })
}

export const updateUserUsername = (data: { username: string }) => {
  return api({ url: "/user/username", data, method: "PATCH" })
}

export const findAll = (params?: FindAllUser) => {
  return api<UserList>({ url: "/user/all", params, method: "GET" })
}

export const adminGetUserInfo = (id: string) => {
  return api<UserPageInfo>({ url: "/user/userId/" + id, method: "GET" })
}

export const adminUpdateUser = (user: UpdataUser, icon?: File) => {
  return api({
    url: "/user/" + user.id,
    data: { ...user, id: undefined, icon },
    method: "patch",
    headers: { "Content-Type": "multipart/form-data" },
  })
}
