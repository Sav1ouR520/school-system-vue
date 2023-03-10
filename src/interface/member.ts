import type { Group } from "./group"
import type { File } from "./file"
import type { Task } from "./task"

export type Member = {
  id: string
  name: string
  groupId: string
  userId: string
  role: "user" | "admin"
  joinTime: string
  icon: string
}

export type MemberWithFile = {
  id: string
  name: string
  groupId: string
  role: "user" | "admin"
  joinTime: string
  icon: string
  file: File[]
}

export type MemberWithGroup = {
  id: string
  name: string
  groupId: string
  role: "user" | "admin"
  joinTime: string
  icon: string
  group: Group
}

export type MemberWithTask = {
  member: MemberWithFile[]
  task: Task
}

export type UploadMember = {
  id: string
  groupId: string
  name?: string
  role?: "user" | "admin"
}