import type { Token } from "@/interface/token"
import { defineStore } from "pinia"

export const TokenStore = defineStore("TokenStore", {
  state: (): Token => ({
    accessToken: "",
    refreshToken: "",
  }),
  actions: {
    setTokens(token: Token) {
      this.accessToken = token.accessToken
      this.refreshToken = token.refreshToken
    },
  },
  persist: {
    storage: localStorage,
    paths: ["accessToken", "refreshToken"],
  },
})
