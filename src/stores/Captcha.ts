import { defineStore } from "pinia"

export const Captcha = defineStore("Captcha", {
  state: () => ({
    url: "/api/v1/captcha",
    codeErrorMeg: "",
  }),
  actions: {
    reset() {
      this.url = this.url + "?" + Math.random()
    },
  },
})
