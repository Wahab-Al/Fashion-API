import pool from '../../config/database/db'
import { IUser } from '../../interfaces/IUser'


// Get all users
export const getAllUsersService = async (): Promise<Partial<IUser>[]> => {
  const [rows] = await pool.execute(
    'SELECT uuid, name, surname, email, role, created_at, updated_at FROM users'
  )
  return rows as Partial<IUser>[]
}


// Get user by uuid
export const getUserByUuidService = async (uuid: string) : Promise<Partial<IUser>> =>{
  const [rows] = await pool.execute(
    'SELECT uuid, name, surname, email, role, created_at, updated_at FROM users WHERE uuid = ?',
    [uuid]
  )
  const users = rows as Partial<IUser>[]
  if(users.length === 0){
    throw new Error('User that you search not found')
  }
  return users[0]
}


// Update user infos
export const updateUserService = async (uuid: string, userData: Partial<IUser>) : Promise<Partial<void>> =>{
  const { name, surname, email } = userData
  await pool.execute(
    'UPDATE users SET name = COALESCE(?, name), surname = COALESCE(?, surname), email = COALESCE(?, email) WHERE uuid = ?',
    [name ?? null, surname ?? null, email ?? null, uuid]
  )
}



// Delete user infos
export const deleteUserService = async (uuid: string): Promise<void> => { 
  const [rows] = await pool.execute( 'SELECT id FROM users WHERE uuid = ?', [uuid] ) 
  if ((rows as any[]).length === 0) { 
    throw new Error('User not found') 
  } 
  await pool.execute( 'DELETE FROM users WHERE uuid = ?', [uuid] ) 
}
