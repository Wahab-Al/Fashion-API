import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import pool from '../config/database/db'
import { IUser } from "../interfaces/IUser";
import { jwtConfig } from "../config/jwt/jwt.config";
import { RowDataPacket } from "mysql2";



interface AuthenticatedRequest extends Request {
  user?: { uuid: string, role: string }
  token?: string
}

//#region User Authentication Middleware
export const authMiddleware = async (request: AuthenticatedRequest, response: Response, next: NextFunction) : Promise<void> =>{
  try {

    let token: string | undefined
    if(request.cookies && request.cookies.token) {
      token = request.cookies.token
    }
    else if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
      token = request.headers.authorization.split(' ') [1]
    }
    const authHeader = request.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
      response.status(401).json({ error: 'No token provided' })
      return
    }
    if(!token) {
      response.status(401).json({ error: 'Authentication required'})
      return
    }


    const decoded = jwt.verify(token, jwtConfig.secret as string) as { uuid: string, role: string }

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT uuid, role, tokens FROM users WHERE uuid = ?',
      [decoded.uuid]
    )

    const users = rows as IUser[]
    if(users.length === 0) {
      response.status(401).json({ error: 'User not found'})
      return
    }
    const user = users[0]

    const currentTokens = Array.isArray(user.tokens) ? (user.tokens as string[])
    : JSON.parse((user.tokens as unknown as string) || '[]') as string[]

    if(!currentTokens.includes(token)) {
      response.status(401).json({ error: 'Token is invalid or expired' })
      return
    }

    request.user = { uuid: user.uuid, role: user.role }
    request.token = token 
    next()
  } catch (error: any) {
    response.status(401).json({ error: 'Invalid token' })
  }
}

//#endregion