export const ACCESS_TOKEN_COOKIE ='access_token'
export const REFRESH_TOKEN_COOKIE ='refresh_token'


export const getCookieOptions = (maxAgeMs: number) => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: maxAgeMs
  }
}