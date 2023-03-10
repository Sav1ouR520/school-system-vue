import { findGroupByGroupId } from "@/api/group"
import { findMemberByUserId } from "@/api/member"
import type { Group } from "@/interface/group"
import { defineStore } from "pinia"
type GroupPageInfo = {
  userRole: "user" | "admin"
  group: Group
  item: {
    members: number
    tasks: number
  }
  update: {
    type: "member" | "task" | "group" | null
    time: number
  }
  click: {
    id: string
    status: "modify" | "add" | "check" | null
    type: "member" | "task" | null
  }
}
export const GroupPage = defineStore("GroupPage", {
  state: (): GroupPageInfo => ({
    userRole: "user",
    group: {
      id: "",
      name: "",
      owner: "",
      icon: "",
      createTime: "",
      status: true,
    },
    update: {
      type: null,
      time: 0,
    },
    item: { members: 0, tasks: 0 },
    click: {
      id: "",
      status: null,
      type: null,
    },
  }),
  getters: {
    hasClick: state => {
      return state.click.id === "" && state.click.type === null
    },
    belongUser: state => {
      return state.group.owner === ""
    },
  },
  actions: {
    async getGroup() {
      const state = this.$state
      const data = await Promise.all([findGroupByGroupId(this.group.id), findMemberByUserId(this.group.id)])
      const group = data[0]!.data
      const member = data[1]!.data
      this.$state = group ? { ...state, group, userRole: member!.role } : state
    },
  },
  persist: {
    storage: localStorage,
    paths: ["userRole", "group.id", "click"],
  },
})
