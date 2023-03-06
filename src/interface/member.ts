import type { Group } from "./group"

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
