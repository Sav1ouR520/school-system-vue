import type { File } from "./file"
import type { Member } from "./member"

export type Task = {
  id: string
  name: string
  introduce: string
  memberId: string
  groupId: string
  activeStatue: boolean
  dataPath: string | null
  createTime: Date
  member: Member
}

export type TaskWithFile = {
  id: string
  name: string
  introduce: string
  memberId: string
  groupId: string
  activeStatue: boolean
  dataPath: string | null
  createTime: Date
  file: Array<File>
}

export type FormTask = {
  name: string
  introduce: string
  groupId: string
  file: Blob
}

export type ModifyTask = {
  id: string
  name: string
  introduce: string
  file: Blob
}

export type TaskWithFile2 = {
  task: Task
  File: File
}
