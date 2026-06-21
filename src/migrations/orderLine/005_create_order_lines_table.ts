import pool from "../../config/database/db";



//#region UP MIGRATION: CREATE ORDERLINES TABLE
export const up = async (): Promise<void> => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS order_lines(
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL UNIQUE,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `)
}
//#endregion


//#region DOWN MIGRATION: DROP ORDERLINES TABLE
/**
 * Defines to rollback and remove orderLines table
 */
export const down = async (): Promise<void> => {
  await pool.execute('DROP TABLE IF EXISTS order_lines')
}