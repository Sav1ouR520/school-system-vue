import api from "@/utils/request"
import type { TaskWithFile, FormTask, TaskWithMemberAndFile, ModifyTask } from "@/interface/task"

export const getTasksByTaskId = async (taskId: string) => {
  return await api<TaskWithMemberAndFile>({ url: `/task/taskId/${taskId}`, method: "get" })
}

export const getTasksByGroupId = async (groupId: string) => {
  return await api<TaskWithFile[]>({ url: `/task/groupId/${groupId}`, method: "get" })
}

export const createTask = async (data: FormTask, hasData: Boolean) => {
  if (hasData)
    return await api({
      url: `/task`,
      data,
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
    })
  else
    return await api({
      url: `/task`,
      data: {
        name: data.name,
        introduce: data.introduce,
        groupId: data.groupId,
      },
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
    })
}

export const deleteTask = async (data: string[]) => {
  return await api({ url: "/task", data: { ids: data }, method: "delete" })
}

export const deleteTaskFile = async (taskId: string) => {
  return await api({ url: `/task/file/${taskId}`, method: "delete" })
}

export const modifyTask = async (data: ModifyTask, hasData: Boolean) => {
  if (hasData) {
    return await api({
      url: "/task",
      data,
      method: "patch",
      headers: { "Content-Type": "multipart/form-data" },
    })
  } else {
    return await api({
      url: "/task",
      data: {
        id: data.id,
        name: data.name,
        introduce: data.introduce,
      },
      method: "patch",
      headers: { "Content-Type": "multipart/form-data" },
    })
  }
}