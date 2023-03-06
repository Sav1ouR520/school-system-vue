import { defineStore } from "pinia"

type Page = {
  type: "user" | "group" | "task" | null
  id: string
}

export const PageInfo = defineStore("PageInfo", {
  state: (): Page => ({
    type: null,
    id: "",
  }),
  actions: {
    setPageInfo(page: Page) {
      this.$state = page
    },
  },
})
