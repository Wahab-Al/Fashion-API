
/**
 * Represents a secure token record 
 */
export interface IToken {
  id: number, 
  uuid: string,
  user_id: number,
  type: TokenType,
  token_hash: string,
  device_info?: string,
  expires_at: Date,
  revoked_at?: Date | null, 
  created_at: Date,
  updated_at: Date
}

/**
 * Expected token types supported by the authentication system
 */
export type TokenType = 'refresh' | 'reset' | 'verify'

