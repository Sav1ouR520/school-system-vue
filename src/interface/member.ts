import type { Group } from "./group"
import type { File } from "./file"
import type { Task } from "./task"

export type Member = {
  id: number
  name: string
  groupId: string
  userId: string
  role: "user" | "admin"
  joinTime: string
  icon: string
  file: File[]
}

export type MemberWithGroup = {
  id: number
  name: string
  groupId: string
  userId: string
  role: "user" | "admin"
  joinTime: string
  icon: string
  group: Group
}

export type MemberWithTask = {
  member: Member[]
  task: Task
}
