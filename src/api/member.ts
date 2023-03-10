import type { Member, UploadMember } from "@/interface/member"
import api from "@/utils/request"

export const findMemberByGroupId = async (groupId: string) => {
  return await api<Member[]>({ url: `/member/groupId/${groupId}`, method: "get" })
}

export const findMemberByMemberId = async (groupId: string, memberId: string) => {
  return await api<Member>({ url: "/member", params: { groupId, memberId }, method: "get" })
}

export const modifyMemberWithAdmin = async (data: UploadMember) => {
  return await api({ url: "/member", data, method: "patch" })
}

export const deleteMember = async (data: string[]) => {
  return await api({ url: "/member", data: { ids: data }, method: "delete" })
}

export const findMemberByUserId = async (groupId: string)=>{
  return await api<Member>({ url: `/member/userId/${groupId}`, method: "get" })
}