export const jwtConfig = {
  secret: new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET),
}