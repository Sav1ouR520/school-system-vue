import type { TokenPayload, Tokens } from "@/interface/token"
import { defineStore } from "pinia"
import jwt_decode from "jwt-decode"
import { refreshToken } from "@/api/user"

export const TokenStore = defineStore("TokenStore", {
  state: (): Tokens => ({
    accessToken: "",
    refreshToken: "",
  }),
  actions: {
    async refresh() {
      await refreshToken()
    },
  },
  getters: {
    userId(state) {
      if (state.accessToken) {
        try {
          const accessToken: TokenPayload = jwt_decode(state.accessToken)
          return accessToken.id
        } catch {
          const router = useRouter()
          state.accessToken = state.refreshToken = ""
          router.push("/")
        }
      }
    },
    verification() {
      return !this.outOfAccessDate || !this.outOfrefreshDate
    },
    outOfAccessDate: (state): boolean => {
      const nowTimeStamp = Math.floor(new Date().valueOf() / 1000)
      try {
        if (state.accessToken !== "" || state.refreshToken !== "") {
          const accessTokenTimeStamp: TokenPayload = jwt_decode(state.accessToken)
          return nowTimeStamp > accessTokenTimeStamp.exp
        }
        return true
      } catch {
        return true
      }
    },
    outOfrefreshDate: (state): boolean => {
      const nowTimeStamp = Math.floor(new Date().valueOf() / 1000)
      try {
        if (state.accessToken !== "" || state.refreshToken !== "") {
          const refreshTokenTimeStamp: TokenPayload = jwt_decode(state.refreshToken)
          return refreshTokenTimeStamp.exp < nowTimeStamp
        }
        return true
      } catch {
        return true
      }
    },
  },
  persist: {
    storage: localStorage,
    paths: ["accessToken", "refreshToken"],
  },
})
