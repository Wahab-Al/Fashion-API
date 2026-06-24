import { Request, Response } from "express";
import { registerService, loginService, logoutService, logoutAllService } from "../../services/authentication/authService";
import jwt, { SignOptions } from 'jsonwebtoken'
import pool from '../../config/database/db'
import { RowDataPacket } from 'mysql2'
import { jwtConfig } from "../../config/jwt/jwt.config";
import { generateToken } from "../../services/token/tokenService";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, getCookieOptions } from "../../config/jwt/cookie.config";



// register controller:
export const register = async (request: Request, response: Response) : Promise<void> =>{
  try {
    const { name, surname, email, password } = request.body
    if(!name || !surname || !email || !password ){
      response.status(400).json({ error: 'All fields are required'})
      return
    }

    const result = await registerService({ name, surname, email, password })
    const userUuid = result.user.uuid
    if (!userUuid) {
      response.status(500).json({ error: 'User UUID missing after registration' })
      return
    }

    const accessToken = jwt.sign(
      { uuid: result.user.uuid, role: result.user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn as SignOptions['expiresIn'] }
    )

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE uuid = ?',
      [userUuid]
    )

    const userId = (rows as { id: number }[])[0]?.id
    if (!userId) {
      response.status(404).json({ error: 'User registration verified but ID not found' })
      return
    }

    const userAgent = request.headers['user-agent'] || 'unknown'
    const refreshToken = await generateToken(userId, 'refresh', userAgent)
    response.cookie(ACCESS_TOKEN_COOKIE, accessToken, getCookieOptions(15 * 60 * 1000))
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000))


    response.status(201).json({ message: 'User registered successfully', data: result})
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(400).json({ error: error.message })
      return
    }
    response.status(400).json({ error: 'An unexpected error occurred during registration' })
  }
}



// login controller:
export const login = async (request: Request, response: Response): Promise<void> => {
  try {
    const { email, password } = request.body
    if (!email || !password) {
      response.status(400).json({ error: 'Email and password are required' })
      return
    }

    const result = await loginService(email, password)

    const userUuid = result.user?.uuid
    if (!userUuid) {
      response.status(401).json({ error: 'Invalid user context' })
      return
    }

    const accessToken = jwt.sign(
      { uuid: userUuid, role: result.user.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn as SignOptions['expiresIn'] }
    )

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM users WHERE uuid = ?',
      [userUuid]
    )
    
    const userId = (rows as { id: number }[])[0]?.id
    if (!userId) {
      response.status(404).json({ error: 'User verified but missing DB identifier' })
      return
    }

    const userAgent = request.headers['user-agent'] || 'unknown'
    const refreshToken = await generateToken(userId, 'refresh', userAgent)

    response.cookie(ACCESS_TOKEN_COOKIE, accessToken, getCookieOptions(15 * 60 * 1000))
    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000))

    response.status(200).json({ message: 'Login successful', data: { user: result.user } })

  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(401).json({ error: error.message })
      return
    }
    response.status(401).json({ error: 'Authentication failed' })
  }
}



// logout controller
export const logout = async (request: Request, response: Response): Promise<void> => {
  try {
    const refreshToken = request.cookies?.[REFRESH_TOKEN_COOKIE];
    const userUuid = request.user?.uuid;

    if (!userUuid || !refreshToken) {
      response.status(401).json({ error: 'Unauthorized: Missing session tokens' });
      return;
    }

    await logoutService(userUuid, refreshToken);

    response.clearCookie(ACCESS_TOKEN_COOKIE, getCookieOptions(0));
    response.clearCookie(REFRESH_TOKEN_COOKIE, getCookieOptions(0));

    response.status(200).json({ message: 'Logged out successfully from this device' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ error: error.message });
      return;
    }
    response.status(500).json({ error: 'Internal Server Error' });
  }
};



//logoutAll controller
export const logoutAll = async (request: Request, response: Response): Promise<void> => {
  try {
    const userUuid = request.user?.uuid;

    if (!userUuid) {
      response.status(401).json({ error: 'Unauthorized operational state' });
      return;
    }

    await logoutAllService(userUuid);

    response.clearCookie(ACCESS_TOKEN_COOKIE, getCookieOptions(0));
    response.clearCookie(REFRESH_TOKEN_COOKIE, getCookieOptions(0));

    response.status(200).json({ message: 'Logged out successfully from all devices' });
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ error: error.message });
      return;
    }
    response.status(500).json({ error: 'Internal Server Error' });
  }
};