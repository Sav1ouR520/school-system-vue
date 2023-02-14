import api from "@/utils/request"
import type { Task, FormTask } from "@/interface/task"

export const getTasks = async (groupId: string) => {
  return await api<Task[]>({ url: `/task/groupId/${groupId}`, method: "get" })
}

export const createTask = async (data: FormTask) => {
  return await api({ url: `/task`, data, method: "post", headers: { "Content-Type": "multipart/form-data" } })
}

export const deleteTask = async (data: string[]) => {
  return await api({ url: "/task", data: { ids: data }, method: "delete" })
}
