import type { Group } from "@/interface/group"
import { defineStore } from "pinia"

export const GroupInfo = defineStore("GroupInfo", {
  state: (): Group => ({
    id: "",
    name: "",
    icon: "",
    owner: "",
    createTime: "",
    activeStatue: false,
  }),
  actions: {
    setGroup(group: Group) {
      this.id = group.id
      this.name = group.name
      this.icon = group.icon
      this.owner = group.owner
      this.createTime = group.createTime
      this.activeStatue = group.activeStatue
    },
  },
  getters: {
    hasGroup: state => state.name !== "",
  },
})
