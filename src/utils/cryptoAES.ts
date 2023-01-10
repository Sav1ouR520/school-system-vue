import CryptoJS from "crypto-js"
import { useCookies } from "@vueuse/integrations/useCookies"

export const Encrypt = (data: any) => {
  const cookies = useCookies()
  const iv = cookies.get("server.iv")
  const key = cookies.get("server.key")
  const dataHex = CryptoJS.enc.Utf8.parse(data)
  const encrypted = CryptoJS.AES.encrypt(dataHex, key, { iv, mode: CryptoJS.mode.CFB, padding: CryptoJS.pad.AnsiX923 })
  return encrypted.ciphertext.toString()
}
