import { useCookies } from "@vueuse/integrations/useCookies"
import moment from "moment"
import { defineStore } from "pinia"
export const Captcha = defineStore("Captcha", {
  state: () => ({
    url: "/api/v1/captcha",
    codeErrorMeg: "",
    emailErrorMeg: "",
    getCode: "获取验证码",
    leftTime: 0,
  }),
  actions: {
    reset() {
      this.url = this.url + "?" + Math.random()
    },
    countDown() {
      const { pause } = useIntervalFn(() => {
        const nextTime = useCookies().get("nextTime")
        const nowTime = new Date()
        this.leftTime = moment(nextTime).diff(nowTime, "seconds", false)
        this.getCode = this.leftTime.toString() + "s"
        if (this.leftTime <= 0) {
          pause()
          this.getCode = "获取验证码"
        }
      }, 1000)
    },
  },
})
