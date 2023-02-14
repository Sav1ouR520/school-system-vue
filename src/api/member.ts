import type { Member } from "@/interface/member"
import api from "@/utils/request"

export const findMember = async (groupId: string) => {
  return await api<Member[]>({ url: `/member/groupId/${groupId}`, method: "get" })
}
