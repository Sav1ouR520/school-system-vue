export type UserPageInfo = {
  id: string
  username: string
  account: string
  activeStatue: boolean
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
