import type { Group } from "@/interface/group"
import type { MemberWithGroup } from "@/interface/member"
import api from "@/utils/request"

export const addGroup = async (data: { name: string; icon?: File }) => {
  return await api({ url: "/group", data, method: "post", headers: { "Content-Type": "multipart/form-data" } })
}

export const findGroupByUserId = async () => {
  return await api<MemberWithGroup[]>({ url: "/group/user", method: "get" })
}

export const findGroupByGroupId = async (id: string) => {
  return await api<Group>({ url: `/group/id/${id}`, method: "get" })
}

export const modifyGroup = async (data: { name: string; owner: string | null; icon?: File }) => {
  return await api({ url: "/group", data, method: "patch", headers: { "Content-Type": "multipart/form-data" } })
}

export const deleteGroup = async (id: string) => {
  return await api({ url: `/group/${id}`, method: "delete" })
}
