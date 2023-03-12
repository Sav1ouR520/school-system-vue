import type { UpdateFile, UploadFile } from "@/interface/file"
import type { MemberWithTask } from "@/interface/member"
import api from "@/utils/request"

export const uploadFile =  (data: UploadFile) => {
  return  api({ url: "/file", data, method: "post", headers: { "Content-Type": "multipart/form-data" } })
}

export const modifyFile =  (data: UpdateFile) => {
  return  api({ url: "/file", data, method: "patch", headers: { "Content-Type": "multipart/form-data" } })
}

export const findFileBytaskId =  (taskId: string) => {
  return  api<MemberWithTask>({ url: `/file/taskId/${taskId}`, method: "get" })
}

export const goBackFileByTaskId =  (fileId: string) => {
  return  api({ url: `/file/${fileId}`, method: "delete" })
}
