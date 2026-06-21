import pool from '../../config/database/db'
import { IOrder } from '../../interfaces/IOrder'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { v7 as uuidv7 } from 'uuid'




// Get all Orders
export const getUserOrdersService = async (userUuid: string): Promise<IOrder[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT o.* FROM orders o 
    JOIN users u ON o.user_id = u.id 
    WHERE u.uuid = ?`, 
    [userUuid]
  )
  return rows as IOrder[]
}



// Get Order by uuid
export const getOrderByUuidService = async (uuid: string): Promise<IOrder> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM orders WHERE uuid = ?', [uuid])
  
  if (rows.length === 0) {
    throw new Error('Order not found')
  }
  return rows[0] as IOrder
}



// Create new Order
export const createOrderService = async (userUuid: string, data: { product_id: number; quantity: number; price: number }[])
: Promise<Omit<IOrder, 'id' | 'user_id'> & { user_uuid: string }> => {
  const [userRows] = await pool.execute<RowDataPacket[]>('SELECT id FROM users WHERE uuid = ?', [userUuid])
  const userId = userRows[0]?.id
  if (!userId) {
    throw new Error('User not found')
  }

  const total_price = data.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const orderUuid = uuidv7()

  const [orderResult] = await pool.execute<ResultSetHeader>(
    'INSERT INTO orders (uuid, user_id, total_price) VALUES (?, ?, ?)',
    [orderUuid, userId, total_price]
  )

  if (orderResult.affectedRows === 0) {
    throw new Error('Failed to create order record')
  }

  const [orderRows] = await pool.execute<RowDataPacket[]>('SELECT id FROM orders WHERE uuid = ?', [orderUuid])
  const orderId = orderRows[0]?.id
  if (!orderId) {
    throw new Error('Order record insertion verification failed')
  }

  for (const item of data) {
    const lineUuid = uuidv7()
    await pool.execute<ResultSetHeader>(
      'INSERT INTO order_lines (uuid, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
      [lineUuid, orderId, item.product_id, item.quantity, item.price]
    )
  }

  return { 
    uuid: orderUuid, 
    user_uuid: userUuid, 
    total_price, 
    status: 'pending' 
  } as  Omit<IOrder, 'id' | 'user_id'> & { user_uuid: string }
}



// Update Order infos
export const updateOrderStatusService = async (uuid: string, status: string, userUuid: string): Promise<void> => {
  const [orderRows] = await pool.execute<RowDataPacket[]>(
    `SELECT o.id FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE o.uuid = ? AND u.uuid = ?`,
    [uuid, userUuid]
  )

  if (orderRows.length === 0) {
    throw new Error('Unauthorized or Order not found')
  }

  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE orders SET status = ? WHERE uuid = ?', 
    [status, uuid]
  )

  if (result.affectedRows === 0) {
    throw new Error('Status update failed')
  }
}



// Delete Order
export const deleteOrderService = async (uuid: string): Promise<void> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT id FROM orders WHERE uuid = ?', [uuid])
  const orderId = rows[0]?.id

  if (!orderId) {
    throw new Error('Order not found')
  }

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    await connection.execute<ResultSetHeader>('DELETE FROM order_lines WHERE order_id = ?', [orderId])
    
    const [orderResult] = await connection.execute<ResultSetHeader>('DELETE FROM orders WHERE id = ?', [orderId])
    
    if (orderResult.affectedRows === 0) {
      throw new Error('Failed to delete order record')
    }

    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}