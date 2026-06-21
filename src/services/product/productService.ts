import pool from '../../config/database/db'
import { IProduct } from '../../interfaces/IProduct'
import { RowDataPacket, ResultSetHeader } from 'mysql2'
import { v7 as uuidv7 } from 'uuid'


// Get all Products
export const getAllProductsService = async (): Promise<IProduct[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM products')
  return rows as IProduct[]
}




// Get Product by uuid
export const getProductByUuidService = async (uuid: string): Promise<IProduct> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM products WHERE uuid = ?', [uuid])
  
  if (rows.length === 0) {
    throw new Error('Product that you search not found')
  }
  return rows[0] as IProduct
}




// Get Product by Slug
export const getProductBySlugService = async (slug: string): Promise<IProduct> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT * FROM products WHERE slug = ?', [slug])
  
  if (rows.length === 0) {
    throw new Error('Product that you search not found')
  }
  return rows[0] as IProduct
}




// Create new Product
export const createProductService = async (
  data: Omit<IProduct, 'id' | 'uuid' | 'created_at' | 'updated_at'>
): Promise<Omit<IProduct, 'id' | 'created_at' | 'updated_at'>> => {
  const uuid = uuidv7()
  
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO products (uuid, category_id, name, price, old_price, description, number_in_stock, img_url, sub_img_url, rating, slug)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuid, data.category_id, data.name, data.price, data.old_price ?? null, data.description,
      data.number_in_stock, data.img_url ?? null, data.sub_img_url ?? null, data.rating ?? null, data.slug
    ]
  )

  if (result.affectedRows === 0) {
    throw new Error('Failed to create product record')
  }

  return { uuid, ...data }
}




// Update Product infos
export const updateProductService = async (uuid: string, data: Partial<IProduct>): Promise<void> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `UPDATE products SET
    name = COALESCE(?, name),
    price = COALESCE(?, price),
    old_price = COALESCE(?, old_price),
    description = COALESCE(?, description),
    number_in_stock = COALESCE(?, number_in_stock),
    img_url = COALESCE(?, img_url),
    sub_img_url = COALESCE(?, sub_img_url),
    rating = COALESCE(?, rating)
    WHERE uuid = ?`,
    [
      data.name ?? null, data.price ?? null, data.old_price ?? null,
      data.description ?? null, data.number_in_stock ?? null,
      data.img_url ?? null, data.sub_img_url ?? null, data.rating ?? null, uuid
    ]
  )

  if (result.affectedRows === 0) {
    throw new Error('Product that you search not found or no changes applied')
  }
}




// Delete Product 
export const deleteProductService = async (uuid: string): Promise<void> => {
  const [rows] = await pool.execute<RowDataPacket[]>('SELECT id FROM products WHERE uuid = ?', [uuid])
  
  if (rows.length === 0) {
    throw new Error('Product that you search not found')
  }
  
  await pool.execute<ResultSetHeader>('DELETE FROM products WHERE uuid = ?', [uuid])
}