export type File = {
  id: string
  taskId: string
  uploadUser: string
  uploadTime: Date
  filePath: string
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
