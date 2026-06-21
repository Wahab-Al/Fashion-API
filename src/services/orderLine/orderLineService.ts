import pool from '../../config/database/db'
import { IOrderLine } from '../../interfaces/IOrderLine'
import { RowDataPacket } from 'mysql2'



// Get OrderLine
export const getOrderLinesByOrderUuidService = async (
  orderUuid: string, 
  userUuid: string
): Promise<(Omit<IOrderLine, 'id' | 'order_id' | 'product_id'> & { product_uuid: string })[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT 
      ol.uuid, 
      ol.quantity, 
      ol.price, 
      ol.created_at, 
      ol.updated_at, 
      p.uuid AS product_uuid
    FROM order_lines ol
    JOIN orders o ON ol.order_id = o.id
    JOIN users u ON o.user_id = u.id
    JOIN products p ON ol.product_id = p.id
    WHERE o.uuid = ? AND u.uuid = ?`,
    [orderUuid, userUuid]
  )
  
  return rows as (Omit<IOrderLine, 'id' | 'order_id' | 'product_id'> & { product_uuid: string })[]
}