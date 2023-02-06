import api from "@/utils/request"
export const getCookie = async () => {
  await api({ url: "/index", method: "GET" })
}
