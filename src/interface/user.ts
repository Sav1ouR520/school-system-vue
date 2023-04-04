export type UserPageInfo = {
  id: string
  username: string
  account: string
  status: boolean
  registerTime: Date | null
  icon: null | string
  role: "user" | "admin"
}

export type ModifyUserPassWord = {
  captcha: string
  oldPassword: string
  newPassword: string
  newRepassword: string
}

export type LoginUser = {
  account: string
  password: string
  captcha: string
}

export type RegisterUser = LoginUser & {
  username: string
  repassword: string
}

export type FindAllUser = {
  limit?: number | undefined
  offset?: number | undefined
  account: string | undefined
  username: string | undefined
  registerTime: Date | undefined
  status: boolean | undefined
  role: "user" | "admin" | undefined
}
export type UserInfo = {
  account: string
  status: boolean
  icon: string
  id: string
  registerTime: Date
  role: "admin" | "user"
  username: string
}
export type UserList = {
  list: UserInfo[]
  total: number
}
export type UpdataUser = {
  id: string
  username: string
  status: boolean
  role: "user" | "admin"
}