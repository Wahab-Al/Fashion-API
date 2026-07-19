import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  surname: z.string().min(2).max(100),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(255)
})


export const loginSchema = z.object({
  email: z.email({message: 'Invalid email address'}).trim().toLowerCase(),
  password: z.string().min(1, { message: "Password is required" })
})