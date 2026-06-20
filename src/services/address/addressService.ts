import { RowDataPacket, ResultSetHeader } from 'mysql2'
import pool from '../../config/database/db'
import { IAddress } from '../../interfaces/IAddress'
import { v7 as uuidv7 } from 'uuid'



// Get all user addresses
export const getUserAddressesService = async (userUuid: string) : Promise<IAddress[]> =>{
  const [rows] = await pool.execute(
    `SELECT a.* FROM address a
      JOIN users u ON  a.user_id = u.id
      WHERE u.uuid = ?
    `, [userUuid]
  )

  return rows as IAddress[]
}


// Get 
export const createAddressService = async (
  userUuid: string, 
  data: Omit<IAddress, 'uuid' | 'id' | 'user_id'> 
): Promise<Omit<IAddress, 'id' | 'user_id'>> => {
  
  const [users] = await pool.execute<RowDataPacket[]>(
    'SELECT id FROM users WHERE uuid = ?', 
    [userUuid]
  )
  
  if (users.length === 0) {
    throw new Error('the user that you search not found')
  }

  const userId = users[0].id
  const addressUuid = uuidv7()

  const [insertedResult] = await pool.execute<ResultSetHeader>(
    'INSERT INTO addresses (uuid, user_id, zip_code, city, street, state) VALUES (?, ?, ?, ?, ?, ?)', 
    [addressUuid, userId, data.zip_code, data.city, data.street, data.state]
  )
  
  return { 
    uuid: addressUuid, 
    ...data 
  } as IAddress
}