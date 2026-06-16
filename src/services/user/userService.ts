import pool from '../../config/database/db'
import { IUser } from '../../interfaces/IUser'
import { RowDataPacket } from 'mysql2'

//#region User Service

// Get all users from DB
export const getAllUsersService = async (): Promise<Partial<IUser>[]> => {
  const [rows] = await pool.execute(
    'SELECT uuid, name, surname, email, role, created_at, updated_at FROM users'
  )
  return rows as Partial<IUser>[]
}

// Get single user by uuid
export const getUserByUuidService = async (uuid: string) : Promise<Partial<IUser>> =>{
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT uuid, name, surname, email, role, created_at, updated_at FROM users WHERE uuid = ?',
    [uuid]
  )
  if(rows.length === 0){
    throw new Error('User not found')
  }
  return rows[0] as Partial<IUser>
}

// Update user details (Supports both profile updates and admin role modifications)
export const updateUserService = async (uuid: string, userData: Partial<IUser>) : Promise<void> =>{
  const { name, surname, email, role } = userData

  const [rows] = await pool.execute<RowDataPacket[]>('SELECT uuid FROM users WHERE uuid = ?', [uuid])
  if(rows.length === 0) {
    throw new Error('Target user not found')
  }

  await pool.execute(
    'UPDATE users SET name = COALESCE(?, name), surname = COALESCE(?, surname), email = COALESCE(?, email), role = COALESCE(?, role) WHERE uuid = ?',
    [name ?? null, surname ?? null, email ?? null, role ?? null, uuid]
  )
}

// Delete user from system entirely
export const deleteUserService = async (uuid: string): Promise<void> => { 
  const [rows] = await pool.execute<RowDataPacket[]>( 
    'SELECT uuid FROM users WHERE uuid = ?', [uuid] ) 
  if (rows.length === 0) { 
    throw new Error('Target user not found') 
  } 
  await pool.execute( 'DELETE FROM users WHERE uuid = ?', [uuid] ) 
}

//#endregion