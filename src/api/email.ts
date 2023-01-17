import api from "@/utils/request"
export const sendCode = async (to: string) => {
  return await api.post("/email", { to })
}
