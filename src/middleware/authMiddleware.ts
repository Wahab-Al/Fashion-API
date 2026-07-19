import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { jwtConfig } from "../config/jwt/jwt.config";
import { ACCESS_TOKEN_COOKIE } from "../config/jwt/cookie.config";

interface TokenPayload extends JwtPayload {
  uuid: string
  role?: string
}

//#region User Authentication Middleware
export const authMiddleware = async (request: Request, response: Response, next: NextFunction) : Promise<void> =>{
  try {
    const token = request.cookies?.[ACCESS_TOKEN_COOKIE]
    if (!token) {
      response.status(401).json({ error: 'Unauthorized: No token provided' })
      return
    }

    const decoded = jwt.verify(token, jwtConfig.secret) as TokenPayload
    if (!decoded || !decoded.uuid) {
      response.status(401).json({ error: 'Unauthorized: Invalid token payload' })
      return
    }

    request.user = {
      uuid: decoded.uuid,
      role: decoded.role
    }
    next()

  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      response.status(401).json({ error: 'Unauthorized: Token has expired' })
      return
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      response.status(401).json({ error: 'Unauthorized: Invalid token signature' })
      return
    }
    response.status(500).json({ error: 'Internal Server Error during authentication' })
  }
}
//#endregion