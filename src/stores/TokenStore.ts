import type { Token } from "@/interface/token"
import { defineStore } from "pinia"

export const TokenStore = defineStore("TokenStore", {
  state: (): Token => ({
    acceptToken: "",
    refreshToken: "",
  }),
  actions: {
    setTokens(token: Token) {
      this.acceptToken = token.acceptToken
      this.refreshToken = token.refreshToken
    },
  },
  persist: {
    storage: localStorage,
    paths: ["acceptToken", "refreshToken"],
  },
})
