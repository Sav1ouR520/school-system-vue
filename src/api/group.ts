import type { Group, TaskGroup, AsideGroup } from "@/interface/group"
import api from "@/utils/request"

export const addGroup =  (data: { name: string; icon?: File }) => {
  return  api({ url: "/group", data, method: "post", headers: { "Content-Type": "multipart/form-data" } })
}

export const findGroupByOwner =  () => {
  return  api<TaskGroup[]>({ url: "/group/owner", method: "get" })
}

export const findGroupByUserId =  () => {
  return  api<AsideGroup[]>({ url: "/group/user", method: "get" })
}

export const findGroupByGroupId =  (id: string) => {
  return  api<Group>({ url: `/group/id/${id}`, method: "get" })
}

export const modifyGroup =  (data: { name: string; owner: string | null; icon?: File }) => {
  return  api({ url: "/group", data, method: "patch", headers: { "Content-Type": "multipart/form-data" } })
}

export const deleteGroup =  (id: string) => {
  return  api({ url: `/group/${id}`, method: "delete" })
}

export const getGroupInviteCode =  (groupId: string) => {
  return  api<{ inviteCode: string }>({ url: `/group/getCode/${groupId}`, method: "get" })
}

export const updateInviteCode =  (groupId: string) => {
  return  api<{ inviteCode: string }>({ url: `/group/refreshCode/${groupId}`, method: "get" })
}

export const joinGroupByInviteCode =  (inviteCode: string) => {
  return  api({ url: `/group/join/${inviteCode}`, method: "post" })
}