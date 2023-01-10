import api from "@/utils/request"
export const getCookie = async () => {
  await api.get("/index")
}
