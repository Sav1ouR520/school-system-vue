export type Group = {
  id: string
  name: string
  owner: string
  icon: string
  createTime: string
  status: boolean
}

export type TaskGroup = {
  id: string
  name: string
  icon: string | null
}

export type AsideGroup = {
  id: string
  name: string
  icon: string
  createTime: string
  member: number
  task: number
}