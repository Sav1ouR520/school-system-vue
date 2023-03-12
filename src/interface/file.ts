export type File = {
  id: string
  taskId: string
  member: string
  message: string
  uploadTime: Date
  filePath: string
  status: boolean
}

export type UploadFile = {
  taskId: string
  file: Blob
}

export type UpdateFile = {
  id: string
  taskId: string
  file: Blob
}

