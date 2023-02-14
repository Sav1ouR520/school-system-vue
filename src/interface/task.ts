export type Task = {
  id: string
  name: string
  introduce: string
  createUser: string
  groupId: string
  activeStatue: boolean
  dataPath: string
  createTime: Date
  file: Array
}

export type FormTask = {
  name: string
  introduce: string
  groupId: string
  file: Blob
}
