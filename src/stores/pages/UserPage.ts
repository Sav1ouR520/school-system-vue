import type { UserPageInfo } from "@/interface/user"
import { defineStore } from "pinia"

export const UserPage = defineStore("UserPage", {
  state: (): UserPageInfo => ({
    id: "",
    account: "",
    username: "",
    status: false,
    icon: "",
    role: "user",
    registerTime: null,
  }),
})
