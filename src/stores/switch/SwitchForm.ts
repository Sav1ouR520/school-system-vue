import { defineStore } from "pinia"
type FormInfo = {
  title: string
  info: string
  urlInfo: string
  url: string
}
type kinds = "login" | "register"

const login: FormInfo = { title: "登录", info: "还没有账号?", urlInfo: "点击注册", url: "login" }
const register: FormInfo = { title: "注册", info: "已有账号?", urlInfo: "点击登录", url: "register" }

export const SwitchForm = defineStore("SwitchFrom", {
  state: (): FormInfo => ({
    title: "",
    info: "",
    urlInfo: "",
    url: "",
  }),
  actions: {
    setForm(kind: kinds) {
      if (kind === "login") {
        this.$patch(login)
      } else if (kind === "register") {
        this.$patch(register)
      }
    },
  },
})
