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

export type AsideTaskWithDegree = {
  group: {
    id: string
    name: string
    icon: string
    member: number
  }
  task: {
    id: string
    name: string
    createTime: Date
    file: number
  }
}

export type AsideTask = {
  group: {
    id: string
    name: string
    icon: string
  }
  task: {
    id: string
    name: string
    createTime: Date
    file: boolean
  }
}

export type TaskWithMember = {
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

export type TaskWithFile = {
  task: TaskWithMember
  File: File | null
}

export type TaskMain = {
  id: string
  name: string
  file: number
}
