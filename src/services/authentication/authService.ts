import pool from "../../config/database/db";
import argon2  from "argon2";
import jwt from 'jsonwebtoken'
import { v7 as uuidv7 } from 'uuid'
import { IUser } from "../../interfaces/IUser";
import { jwtConfig } from "../../config/jwt/jwt.config";

// register service
export const registerService = async (userData: Omit<IUser, 'id' | 'uuid' | 'tokens' | 'role' | 'created_at' | 'updated_at'>) : Promise<{user: Partial<IUser>, token: string}> => {
  const { name, surname, email, password } = userData

  const [rows] = await pool.execute(
    'SELECT id FROM users WHERE email = ?', [email]
  )

  if((rows as any[]).length > 0){
    throw new Error('Email already registerd')
  } 

  const hashedPassword = await argon2.hash(password)

  const uuid = uuidv7()
  const token = jwt.sign({uuid} , jwtConfig.secret  as string, { expiresIn: jwtConfig.expiresIn as any})
  const tokens = JSON.stringify([token])

  await pool.execute(
    `INSERT INTO users (uuid, name, surname, email, password, role, tokens)
      VALUES(?, ?, ?, ?, ?, ?, ?)
    `, [uuid, name, surname, email, hashedPassword, 'customer', tokens]
  )

  return {
    user: {uuid: uuid, name: name, surname: surname, email: email, role: 'customer'}, token: token
  } 
}


// login service
export const loginService = async (email: string, password: string) : Promise<{ user: Partial<IUser>, token: string }> =>{
  const [rows] = await pool.execute(
    'SELECT * FROM users  WHERE email = ?', [email]
  )

  const users = rows as IUser[]
  if(users.length === 0) {
    throw new Error('Invalid email or password')
  }
  

  const user = users[0] 
  const isValidPassword = await argon2.verify(user.password, password)

  if(!isValidPassword){
    throw new Error('Invalid email or password')
  }

  const token = jwt.sign({ uuid: user.uuid },jwtConfig.secret  as string, { expiresIn: jwtConfig.expiresIn as any})
  const currentTokens = Array.isArray(user.tokens) ? user.tokens as string[] :
    JSON.parse(user.tokens as unknown as string || '[]') as string[]
  currentTokens.push(token)

  await pool.execute(
    'UPDATE users SET tokens = ? WHERE id = ?',
    [JSON.stringify(currentTokens), user.id]
  )

  return {
    user: {uuid: user.uuid, name: user.name, surname: user.surname, email: user.email, role: user.role},
    token
  }
}

//logout service
export const logoutService = async (uuid: string, token: string) : Promise<void> =>{
  const [rows] = await pool.execute(
    'SELECT tokens FROM users WHERE uuid = ?', [uuid]
  )
  const users = rows as IUser[]
  if(users.length === 0){
    throw new Error("User not Found")    
  }
  const currentTokens = JSON.parse(users[0].tokens as unknown as string) as string[]
  const updatedToken = currentTokens.filter(t => t !== token)

  await pool.execute(
    'UPDATE users SET tokens = ? WHERE uuid = ?', 
    [JSON.stringify(updatedToken), uuid]
  )
}


//logoutAll service
export const logoutAllService = async (uuid: string) : Promise<void> => {
  await pool.execute(
    'UPDATE users SET tokens = ? WHERE uuid = ?', 
    [JSON.stringify([]), uuid]
  )
} 