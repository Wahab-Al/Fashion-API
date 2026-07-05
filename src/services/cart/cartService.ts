import pool from "../../config/database/db";
import { RowDataPacket } from "mysql2";
import { ICart } from "../../interfaces/ICart";
import { v7 as uuidv7 } from 'uuid'
import { IProduct } from "../../interfaces/IProduct";
import { ICartItemRow, ICartItemWithProduct, ICartWithItems } from "../../interfaces/cart.interface";


/**
 * Retrieves the user's active cart. If the user doesn't have an active cart, it creates a new one.
 * @param userUuid public UUID of the user
 * @returns {Promise<ICart>} A promise that resolves to the user's active cart object
 * @throws {Error} If the user does not exist in the database
 */
export const getOrCreateUserCartService = async (userUuid: string) : Promise<ICart> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT user_id FROM users WHERE uuid = ? LIMIT 1`, [userUuid]
  )

  if(rows.length === 0) {
    throw new Error(`User not found`)
  }
  const userId = rows[0].id

  const [cartRows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM carts WHERE user_id = ? AND status = 'active' LIMIT 1`,
    [userId]
  )

  if(cartRows.length > 0){
    return cartRows[0] as ICart
  }

  const cartUuid = uuidv7()

  await pool.execute<RowDataPacket[]>(
    `INSERT INTO carts (uuid, user_id, status)
    VALUES (?, ?, 'active') 
    ON DUPLICATE KEY UPDATE id=id`, 
    [cartUuid, userId])
  
    const [finalCartRows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM carts WHERE user_id = ? AND status = 'active' LIMIT 1`,
    [userId]
  )
  return finalCartRows[0] as ICart
} 


/**
 * retrieves the user's current shopping cart and lists all the items inside it, along with the full details of each product.
 * @param userUuid unique public UUID of the user owning the cart
 * @returns {Promise<ICartWithItems>} A promise that resolves to the full cart object embedded with an array of structured items
 * @throws { Error } If the user cannot be found or cart creation fails
 */
export const getCartWithItemsService = async (userUuid: string) : Promise<ICartWithItems> => {
  const cart = await getOrCreateUserCartService(userUuid)

  const [rows] = await pool.execute<ICartItemRow[]>(
    `SELECT 
        ci.id as item_id, ci.uuid as item_uuid, ci.cart_id, ci.product_id, ci.quantity, ci.added_at,
        JSON_OBJECT(
          'id', p.id, 'uuid', p.uuid, 'name', p.name, 'price', p.price, 
          'old_price', p.old_price, 'rating', p.rating, 'sub_img_url', p.sub_img_url, 
          'slug', p.slug, 'category_id', p.category_id, 'description', p.description, 
          'number_in_stock', p.number_in_stock, 'img_url', p.img_url, 
          'created_at', p.created_at, 'updated_at', p.updated_at
        ) as product
    FROM cart_item ci
    JOIN product p ON ci.product_id = p.id
    WHERE ci.cart_id = ?`, [cart.id]
  )
  const items: ICartItemWithProduct[] = rows.map(row => {
    const productData = typeof row.product === 'string' ? JSON.parse(row.product) : row.product
    return {
      id: row.item_id,
      uuid: row.item_uuid,
      cart_id: row.cart_id,
      product_id: row.product_id,
      quantity: Number(row.quantity),
      added_at: row.added_at,
      product: productData as IProduct
    };
  })
  return { ...cart, items }
}

/**
 * Adds an item to the user's active cart. Updates quantity if the product already exists.
 * @param userUuid unique UUID of the user
 * @param productUuid public UUID of the product
 * @param quantity quantity of product to add
 * @returns {Promise<void>} Resolves when the operation is successful
 * @throws {Error} If the cart item with the provided UUID does not exist
 */
export const addItemToCartService = async (userUuid: string, productUuid: string, quantity: number) : Promise<void>=> {
  const cart = await getOrCreateUserCartService(userUuid)

  const [productRows] = await pool.execute<RowDataPacket[]>(
    `SELECT id FROM product WHERE uuid = ? LIMIT !`, [productUuid]
  )
  if(!productRows.length) {
    throw new Error('Product not found')
  }

  const internalProductId = productRows[0].id
  const [existingItem] = await pool.execute<RowDataPacket[]>(
    `SELECT id, quantity FROM cart_item WHERE cart_id = ? AND product_id = ? LIMIT 1`, [cart.id, internalProductId]
  )
  if(existingItem.length > 0){
    const newQuantity = existingItem[0].quantity + quantity
    
    await pool.execute(
      `UPDATE cart_item SET quantity = ? WHERE cart_id = ? AND product_id = ?`, [newQuantity, cart.id, internalProductId]
    )
    return
  }

  const itemUuid = uuidv7()
  await pool.execute(
    `INSERT INTO cart_item (uuid, cart_id, product_id, quantity) VALUES (?, ?, ?, ?)`, 
    [itemUuid, cart.id, internalProductId, quantity]
  )
}

/**
 * Updates the quantity of a specific cart item or deletes it if quantity drops to zero.
 * @param itemUuid unique UUID of the cart item
 * @param quantity new quantity value
 * @returns 
 */
export const updateCartItemService = async (itemUuid: string, quantity: number) : Promise<void> => {
  if(quantity <= 0){
    await pool.execute(`DELETE FROM cart_item WHERE uuid = ?`, [itemUuid])
    return
  }
  await pool.execute(`UPDATE cart_item SET quantity = ? WHERE uuid = ?`, [quantity, itemUuid])
}


/**
 * Removes a specific item from the cart using its UUID.
 * @param itemUuid unique UUID of the cart item to remove
 * @throws Error if the cart item does not exist
 */
export const removeItemFromCartService = async (itemUuid: string) : Promise<void> => {
  const [existing] = await pool.execute<RowDataPacket[]>(
    'SELECT id FROM cart_item WHERE uuid = ? LIMIT 1',
    [itemUuid]
  );

  if(!existing.length){
    throw new Error(`Cart item not found or already removed`)
  }
  await pool.execute(`DELETE FROM cart_item WHERE uuid = ?`, [itemUuid])
}


/**
 * Clears all items from the user's active cart.
 * @param userUuid unique UUID of the user
 */
export const clearCartService = async (userUuid: string) : Promise<void> => {
  const cart = await getOrCreateUserCartService(userUuid)
  const [itemsCheck] = await pool.execute<RowDataPacket[]>(
    'SELECT id FROM cart_item WHERE cart_id = ? LIMIT 1',
    [cart.id]
  );
  
  // Cart is already empty
  if(!itemsCheck.length) {
    return
  }
  await pool.execute(`DELETE FROM cart_item WHERE cart_id = ?`, [cart.id])
}