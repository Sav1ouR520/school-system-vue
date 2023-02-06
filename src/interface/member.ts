import type { Group } from "./group"

export type MemberWithGroup = {
  id: number
  name: string
  groupId: string
  userId: string
  role: string
  joinTime: string
  group: Group
}
