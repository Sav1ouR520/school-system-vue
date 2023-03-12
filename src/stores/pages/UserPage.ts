import type { UserPageInfo } from "@/interface/user"
import { defineStore } from "pinia"

export const UserPage = defineStore("UserPage", {
  state: (): UserPageInfo => ({
    id: "",
    account: "",
    username: "",
    activeStatue: true,
    icon: "",
    role: "user",
    registerTime: null,
  }),
})
