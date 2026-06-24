import { Request, Response } from "express";
import { rotateRefreshToken, revokeToken, revokeAllUserTokens, generateToken } from "../../services/token/tokenService";
import { jwtConfig } from "../../config/jwt/jwt.config";
import jwt, { SignOptions} from "jsonwebtoken";
import pool from "../../config/database/db";
import { RowDataPacket } from "mysql2";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, getCookieOptions } from "../../config/jwt/cookie.config";



// POST /auth/referesh
export const refreshTokens = async (request: Request, response: Response)
: Promise<void> => {
  try {
    const oldRefreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE]
    if(!oldRefreshToken) {
      response.status(401).json({ error: 'No refresh token provided'})
      return
    }

    const deviceInfo = request.headers['user-agent'] ?? undefined
    const  { newRawToken, userId } = await rotateRefreshToken(oldRefreshToken, deviceInfo)

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT uuid, role FROM users WHERE id = ?', [userId]
    )

    const users = rows as any[]
    if (users.length === 0) {
      response.status(401).json({ error: 'User not found' })
      return
    }

    const { uuid, role } = users[0]
    const newAccessToken = jwt.sign(
      { uuid, role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn as SignOptions['expiresIn'] }
    )

    response.cookie(ACCESS_TOKEN_COOKIE, newAccessToken, getCookieOptions(15 * 60 * 1000))
    response.cookie(REFRESH_TOKEN_COOKIE, newRawToken, getCookieOptions(7 * 24 * 60 * 60 * 1000))

    response.status(200).json({ message: 'Tokens refreshed successfully'})
  } catch (error: unknown) {
    if(error instanceof Error) {
      response.status(401).json({ error: error.message })
      return
    }
    response.status(401).json({ error: 'unexpected authentication error' })
  }
}




// POST /auth/revoke
export const revokeRefreshToken = async (request: Request, response: Response): Promise<void> => {
  try {
    const refreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE]

    if (!refreshToken) {
      response.status(400).json({ error: 'No refresh token provided' })
      return
    }
    const decoded = jwt.verify(refreshToken, jwtConfig.secret) as { tokenUuid: string }

    if (!decoded.tokenUuid) {
      response.status(400).json({ error: 'Token UUID is required' })
      return
    }
    await revokeToken(decoded.tokenUuid)

    response.clearCookie(ACCESS_TOKEN_COOKIE, getCookieOptions(0))
    response.clearCookie(REFRESH_TOKEN_COOKIE, getCookieOptions(0))

    response.status(200).json({ message: 'Token revoked successfully' })
  } catch(error: unknown) {
    if(error instanceof Error) {
      response.status(500).json({ error: error.message })
      return
    }
    response.status(500).json({ error: 'Internal Server Error' })
  }
}




// POST/auth/revoke-all
export const revokeAllTokens = async (request: Request, response: Response): Promise<void> => {
  try {
    const userUuid = request.user?.uuid;
    if (!userUuid) {
      response.status(401).json({ error: 'Unauthorized: Missing user context' });
      return;
    }
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE uuid = ?', [userUuid]
    )
    const users = rows as { id: number }[]
    if (users.length === 0) {
      response.status(401).json({ error: 'User not found' })
      return
    }

    await revokeAllUserTokens(users[0].id, 'refresh')

    response.clearCookie(ACCESS_TOKEN_COOKIE, getCookieOptions(0))
    response.clearCookie(REFRESH_TOKEN_COOKIE, getCookieOptions(0))

    response.status(200).json({ message: 'All tokens revoked successfully' })
  } catch(error: unknown) {
    if(error instanceof Error) {
      response.status(500).json({ error: error.message })
      return
    }
    response.status(500).json({ error: 'Internal Server Error' })
  }
}