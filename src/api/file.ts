import type { File, UpdateFile, UploadFile } from "@/interface/file"
import api from "@/utils/request"

export const uploadFile = async (data: UploadFile) => {
  return await api<File>({ url: "/file", data, method: "post", headers: { "Content-Type": "multipart/form-data" } })
}

export const modifyFile = async (data: UpdateFile) => {
  return await api<File>({ url: "/file", data, method: "patch", headers: { "Content-Type": "multipart/form-data" } })
}

export const findFileBytaskId = async (taskId: string) => {
  return await api<File[]>({ url: `/file/taskId/${taskId}`, method: "get" })
}
