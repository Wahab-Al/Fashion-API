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


// Create new user address 
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
  if(insertedResult.affectedRows === 0){
    throw new Error('Failed to create address record')
  }
  
  return { 
    uuid: addressUuid, 
    ...data 
  } as IAddress
}


// Update Address infos
export const updateAddressService = async (uuid: string, data: Omit<IAddress, 'id' | 'user_id'>)
: Promise<void> => {
  const [rows] = await pool.execute<ResultSetHeader>(
    `UPDATE addresses SET zip_code = COALESCE(?, zip_code),
    city = COALESCE(?, city),
    street = COALESCE(?, street),
    state = COALESCE(?, state) WHERE uuid = ?
    `, [data.zip_code ?? null, data.city ?? null, data.street ?? null, data.state ?? null, uuid]
  )
  if (rows.affectedRows === 0) {
    throw new Error('address not found')
  }
}




// Delete Address 
export const deleteAddressService = async (uuid: string) 
: Promise<void> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id FROM addresses WHERE uuid = ?', [uuid]
  )
  if(rows.length === 0){
    throw new Error('address that you search not found')
  }

  await pool.execute<ResultSetHeader>('DELETE FROM addresses WHERE uuid = ?', [uuid])
} 