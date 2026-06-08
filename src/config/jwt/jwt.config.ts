import dotenv from 'dotenv'

dotenv.config()

if(!process.env.JWT_SECRET) {
  throw new Error("CRITICAL ERROR: JWT_SECRET is not defined in .env file")
}

export const jwtConfig = {
  secret: process.env.JWT_SECRET as string,
  expiresIn: '7d'
}