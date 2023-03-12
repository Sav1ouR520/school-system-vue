import api from "@/utils/request"
import type { Task, AsideTask, TaskMain, FormTask, TaskWithFile, ModifyTask, AsideTaskWithDegree } from "@/interface/task"

export const findTasksByUserId =  () => {
  return api<AsideTask[]>({ url: `/task/userId`, method: "get" })
}

export const findTaskByOwner =  () => {
  return  api<AsideTaskWithDegree[]>({ url: `/task/owner`, method: "get" })
}

export const findtaskWithFileByTaskId =  (taskId: string) => {
  return  api<TaskWithFile>({ url: `/task/taskId/${taskId}`, method: "get" })
}

export const findtaskInfoByTaskId =  (taskId: string) => {
  return  api<Task>({ url: `/task/info/${taskId}`, method: "get" })
}

export const getTaskByGroupId =  (groupId: string) => {
  return  api<TaskMain[]>({ url: `/task/groupId/${groupId}`, method: "get" })
}

export const createTask =  (data: FormTask, hasData: Boolean) => {
  if (hasData)
    return  api({
      url: `/task`,
      data,
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
    })
  else
    return  api({
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

export const deleteTask =  (data: string[]) => {
  return  api({ url: "/task", data: { ids: data }, method: "delete" })
}

export const deleteTaskFile =  (taskId: string) => {
  return  api({ url: `/task/file/${taskId}`, method: "delete" })
}

export const modifyTask =  (data: ModifyTask, hasData: Boolean) => {
  if (hasData) {
    return  api({
      url: "/task",
      data,
      method: "patch",
      headers: { "Content-Type": "multipart/form-data" },
    })
  } else {
    return  api({
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
