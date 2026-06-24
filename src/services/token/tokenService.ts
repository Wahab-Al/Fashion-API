import pool from "../../config/database/db";
import crypto from 'crypto';
import { v7 as uuidv7 } from 'uuid'
import { IToken, TokenType } from "../../interfaces/IToken";
import { ResultSetHeader, RowDataPacket } from "mysql2";


const REFRESH_TOKEN_BYTES = 64
/**
 * Hash a raw token using SHA-256
 * @param rawToken the plain text token string to be hashed
 * @returns 64-character hex-encoded SHA-256 hash string
 */
const hashToken = (rawToken: string) : string => {
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}


/**
 * Generate a cryptographically secure random raw token
 * @returns cryptographically strong, hex-encoded random string
 */
const generateRawToken = () : string => {
  return crypto.randomBytes(REFRESH_TOKEN_BYTES).toString('hex')
}



/**
 * returns the expiration date based on the token type
 * @param type expected type of the token ('refresh', 'reset', or 'verify')
 * @returns Date object representing the token's expiration timestamp
 * @throws { Error } If an unknown token type is encountered at runtime
 */
const getExpiryDate = (type: TokenType) : Date => {
  const now = new Date()
  switch (type) {
    case 'refresh':
      now.setDate(now.getDate() + Number(process.env.REFRESH_TOKEN_EXPIRY_DAYS || 5))
      break
    case 'reset':
      now.setMinutes(now.getMinutes() + Number(process.env.RESET_TOKEN_EXPIRY_MINUTES || 20))
      break
    case 'verify':
      now.setHours(now.getHours() + Number(process.env.VERIFY_TOKEN_EXPIRY_HOURS || 24))
      break
    default: 
      throw new Error(`Unhandled token type`)
  }
  return now
}


/**
 * Generates new secure token and stores its hash in the database, then returns the raw value.
 * @param userId ID of the target user
 * @param type expected type of the token ('refresh', 'reset', or 'verify')
 * @param device_info Optional client device metadata
 * @returns The raw plain-text token to be sent to the client
 */
export const generateToken = async (userId: number, type: TokenType, device_info?: string) 
: Promise<string> => {
  const rawToken = generateRawToken()
  const tokenHash = hashToken(rawToken)
  const uuid = uuidv7()
  const expiresAt = getExpiryDate(type)

  await pool.execute(
    `INSERT INTO tokens (uuid, user_id, type, token_hash, device_info, expires_at)
      VALUES(?, ?, ?, ?, ?, ?) 
    `, [uuid, userId, type, tokenHash, device_info ?? null, expiresAt]
  )
  return rawToken
}


/**
 * Verifies a raw token by its hash and type, ensuring it is active and not expired
 * @param rawToken plain-text token received from the client
 * @param type expected type of the token ('refresh', 'reset', or 'verify')
 * @returns complete token record from the database if valid
 * @throws { Error } If the token is invalid, revoked, or expired
 */
export const verifyToken = async (rawToken: string, type: TokenType)
: Promise<IToken> => {
  const tokenHash = hashToken(rawToken)
  const [rows] = await pool.execute<RowDataPacket[]>(
    `
    SELECT * FROM tokens WHERE token_hash = ? AND type = ? AND revoked_at IS NULL
    `, [tokenHash, type]
  )
  if(rows.length === 0){
    throw new Error('Invalid or revoked token')
  }

  const token = rows[0] as IToken
  if(new Date(token.expires_at) < new Date()) {
    throw new Error('Token has expired')
  }
  return token
}



/**
 * Revokes a single token by its UUID, used for single-device logout
 * @param tokenUuid unique identifier (UUIDv7) of the token to revoke
 */
export const revokeToken = async (tokenUuid: string)
: Promise<void> => {
  await pool.execute<ResultSetHeader>(
    'UPDATE tokens SET revoked_at = NOW() WHERE uuid = ?',
    [tokenUuid]
  )
}



/**
 * Revokes all active tokens, used for global logout or password reset
 * @param userId ID of the target user
 * @param type expected type of the token ('refresh', 'reset', or 'verify')
 */
export const revokeAllUserTokens = async (userId: number, type: TokenType)
: Promise<void> => {
  await pool.execute<ResultSetHeader>(
    `UPDATE tokens SET revoked_at = NOW() 
      WHERE user_id = ? AND type = ? AND revoked_at IS NULL`,
    [userId, type]
  )
}



/**
 * Rotates a refresh token by revoking the old one and issuing a brand new one(prevent replay attacks)
 * @param oldRawToken urrent plain-text refresh token from the client
 * @param deviceInfo Optional updated client device metadata
 * @returns object containing the new raw token and the associated user ID
 * @throws { Error } If the token is invalid, revoked, or expired
 */
export const rotateRefreshToken = async (oldRawToken: string, deviceInfo?: string)
: Promise<{ newRawToken: string; userId: number }> => {
  const oldToken = await verifyToken(oldRawToken, 'refresh')
  await revokeToken(oldToken.uuid)

  const newRawToken = await generateToken(oldToken.user_id, 'refresh', deviceInfo)
  return { newRawToken, userId: oldToken.user_id }
}