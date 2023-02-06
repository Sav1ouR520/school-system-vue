import { defineStore } from "pinia"

export const SwitchAside = defineStore("SwitchAsideItem", {
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
