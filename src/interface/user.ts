import type { FormItemRule } from "element-plus"

export type loginUser = {
  account: string
  password: string
  captcha: string
}

export type registerUser = loginUser & {
  username: string
  repassword: string
}

export type loginUserRule = {
  [k in keyof loginUser]?: Array<FormItemRule>
}

export type registerUserRule = {
  [k in keyof registerUser]?: Array<FormItemRule>
}
