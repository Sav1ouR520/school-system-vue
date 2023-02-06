import type { MemberWithGroup } from "@/interface/member"
import api from "@/utils/request"

export const addGroup = async (data: { name: string; icon?: File }) => {
  return await api({ url: "/group", data, method: "post", headers: { "Content-Type": "multipart/form-data" } })
}

export const findGroup = async () => {
  return await api<MemberWithGroup[]>({ url: "/group/user", method: "get" })
}
