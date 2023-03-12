import api from "@/utils/request"
export const sendCode =  (to: string) => {
  return  api({ url: "/email", data: { to }, method: "POST" })
}
