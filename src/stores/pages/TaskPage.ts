import { defineStore } from "pinia"

type TaskPageInfo = {
  id: string
  type: "modify" | "upload" | null
  time: number
}

export const TaskPage = defineStore("TaskPage", {
  state: (): TaskPageInfo => ({
    id: "",
    type: null,
    time: 0,
  }),
  persist: {
    storage: localStorage,
    paths: ["id", "type"],
  },
})
