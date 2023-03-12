export type Tokens = {
  accessToken: string
  refreshToken: string
  needRequest: boolean
}
export type ResponseTokens= {
  tokens: { accessToken: string; refreshToken: string }
}

export type TokenPayload = {
  id: string
  exp: number
  iat: number
}
