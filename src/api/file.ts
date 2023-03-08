import type { File, UpdateFile, UploadFile } from "@/interface/file"
import type { MemberWithTask } from "@/interface/member"
import api from "@/utils/request"

export const uploadFile = async (data: UploadFile) => {
  return await api<File>({ url: "/file", data, method: "post", headers: { "Content-Type": "multipart/form-data" } })
}

export const modifyFile = async (data: UpdateFile) => {
  return await api<File>({ url: "/file", data, method: "patch", headers: { "Content-Type": "multipart/form-data" } })
}

export const findFileBytaskId = async (taskId: string) => {
  return await api<MemberWithTask>({ url: `/file/taskId/${taskId}`, method: "get" })
}

export const goBackFileByTaskId = async (fileId: string) => {
  return await api({ url: `/file/${fileId}`, method: "delete" })
}
