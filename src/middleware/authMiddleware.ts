import { Request, Response, NextFunction, response } from "express";
import jwt from 'jsonwebtoken'
import pool from '../config/database/db'
import { IUser } from "../interfaces/IUser";
import { jwtConfig } from "../config/jwt/jwt.config";


interface AuthenticatedRequest extends Request {
  user?: { uuid: string }
  token?: string
}


export const authMiddleware = async (request: AuthenticatedRequest, response: Response, next: NextFunction) : Promise<void> =>{
  try {
    const authHeader = request.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
      response.status(401).json({ error: 'No token provided' })
      return
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(token, jwtConfig.secret as string) as { uuid: string }

    const [rows] = await pool.execute(
      'SELECT uuid, tokens FROM users WHERE  = ?',
      [decoded.uuid]
    )

    const users = rows as IUser[]

    if(users.length === 0) {
      response.status(401).json({ error: 'User not found'})
      return
    }

    const currentTokens = JSON.parse(users[0].tokens as unknown as string) as string[]

    if(!currentTokens.includes(token)) {
      response.status(401).json({ error: 'Token is invalid or expired' })
      return
    }

    request.user = { uuid: decoded.uuid }
    request.token = token 
    next()
  } catch (error: any) {
    response.status(401).json({ error: 'Invalid token' })
  }
}