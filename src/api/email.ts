import api from "@/utils/request"
export const sendCode = async (to: string) => {
  return await api({ url: "/email", data: { to }, method: "POST" })
}
