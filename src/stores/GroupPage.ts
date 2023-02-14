import { defineStore } from "pinia"
import type { Group } from "@/interface/group"
import type { Member } from "@/interface/member"
import type { FormTask, Task } from "@/interface/task"
import { findMember } from "@/api/member"
import { createTask, deleteTask, getTasks } from "@/api/task"
type GroupPageInfo = {
  group: Group
  member: Member[]
  task: Task[]
}
export const GroupPage = defineStore("GroupPage", {
  state: (): GroupPageInfo => ({
    group: {
      id: "",
      name: "",
      owner: "",
      icon: "",
      createTime: "",
      activeStatue: true,
    },
    member: [],
    task: [],
  }),
  actions: {
    getGroup(group: Group) {
      this.group = group
    },
    async getMember() {
      if (this.group.id !== "") {
        const data = await findMember(this.group.id)
        this.member = data.data ? data.data : []
      }
    },
    async getTask() {
      if (this.group.id !== "") {
        const data = await getTasks(this.group.id)
        this.task = data.data ? data.data : []
      }
    },
    async deleteTask(data: string[]) {
      await deleteTask(data)
      this.getTask()
    },
    async createTask(data: FormTask) {
      await createTask(data)
      this.getTask()
    },
  },
})
