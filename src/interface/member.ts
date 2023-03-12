import type { File } from "./file"
import type { TaskWithMember } from "./task"

export type Member = {
  id: string
  name: string
  groupId: string
  userId: string
  role: "user" | "admin"
  joinTime: Date
  icon: string
}

export type GroupMember = {
  id: string
  name: string
  role: "user" | "admin"
  icon: string
  userId: string
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

export type MemberWithTask = {
  member: MemberWithFile[]
  task: TaskWithMember
}

export type UploadMember = {
  id: string
  groupId: string
  name?: string
  role?: "user" | "admin"
}
