import pool from "../../config/database/db"



//#region UP MIGRATION: CREATE CART_ITEMS TABLE
export const up = async (): Promise<void> => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL UNIQUE,
      cart_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `)
}
//#endregion


//#region DOWN MIGRATION: DROP CART_ITEMS TABLE
/**
 * Rollback cart_items table
 */
export const down = async (): Promise<void> => {
  await pool.execute('DROP TABLE IF EXISTS cart_items')
}
//#endregion