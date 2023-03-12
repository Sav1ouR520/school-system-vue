import type { TokenPayload, Tokens } from "@/interface/token"
import { defineStore } from "pinia"
import jwt_decode from "jwt-decode"
import { refreshToken } from "@/api/user"

export const TokenStore = defineStore("TokenStore", {
  state: (): Tokens => ({
    accessToken: "",
    refreshToken: "",
    needRequest: false,
  }),
  actions: {
    async refresh() {
      await refreshToken()
    },
  },
  getters: {
    userId: state => {
      if (state.accessToken) {
        const accessToken: TokenPayload = jwt_decode(state.accessToken)
        return accessToken.id
      }
    },
    verification: (state): boolean => {
      if (state.accessToken === "" || state.refreshToken === "") {
        return false
      }
      return true
    },
    outOfAccessDate: (state): boolean => {
      const nowTimeStamp = Math.floor(new Date().valueOf() / 1000)
      if (state.accessToken !== "" || state.refreshToken !== "") {
        const accessTokenTimeStamp: TokenPayload = jwt_decode(state.accessToken)
        return nowTimeStamp > accessTokenTimeStamp.exp
      }
      return false
    },
    outOfrefreshDate: (state): boolean => {
      const nowTimeStamp = Math.floor(new Date().valueOf() / 1000)
      if (state.accessToken !== "" || state.refreshToken !== "") {
        const refreshTokenTimeStamp: TokenPayload = jwt_decode(state.refreshToken)
        return refreshTokenTimeStamp.exp < nowTimeStamp
      }
      return false
    },
  },
  persist: {
    storage: localStorage,
    paths: ["accessToken", "refreshToken"],
  },
})
