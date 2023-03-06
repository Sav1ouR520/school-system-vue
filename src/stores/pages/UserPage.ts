import { defineStore } from "pinia"

type User = {
  id: string
  account: string
  username: string
  icon: string
  role: string
  registerTime: Date | string
}

export const UserPage = defineStore("UserPage", {
  state: (): User => ({
    id: "",
    account: "",
    username: "",
    icon: "",
    role: "",
    registerTime: "",
  }),
  actions: {
    setUser(user: User) {
      this.$state = user
    },
  },
})
