import { defineStore } from "pinia"

export const SwitchAside = defineStore("SwitchAside", {
  state: ()=> ({
    item: "group",
    optionWidth: 70,
    isActive: true,
    hasDiglog: false,
  }),
  persist: {
    storage: localStorage,
    paths: ["item", "isActive"],
  },
})
