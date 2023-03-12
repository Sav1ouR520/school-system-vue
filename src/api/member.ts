import type { Member, UploadMember, GroupMember } from "@/interface/member"
import api from "@/utils/request"

export const findMemberByGroupId =  (groupId: string) => {
  return  api<GroupMember[]>({ url: `/member/groupId/${groupId}`, method: "get" })
}

export const findMemberByMemberId =  (groupId: string, memberId: string) => {
  return  api<Member>({ url: "/member", params: { groupId, memberId }, method: "get" })
}

export const modifyMemberWithAdmin =  (data: UploadMember) => {
  return  api({ url: "/member", data, method: "patch" })
}

export const deleteMember =  (data: string[]) => {
  return  api({ url: "/member", data: { ids: data }, method: "delete" })
}

export const findMemberByUserId =  (groupId: string) => {
  return  api<Member>({ url: `/member/userId/${groupId}`, method: "get" })
}
