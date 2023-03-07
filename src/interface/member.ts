import type { Group } from "./group"
import type { File } from "./file"

export type Member = {
  id: number
  name: string
  groupId: string
  userId: string
  role: "user" | "admin"
  joinTime: string
  icon: string
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

export type MemberWithFile = {
  id: number
  name: string
  groupId: string
  userId: string
  role: "user" | "admin"
  joinTime: string
  icon: string
  file: File
}