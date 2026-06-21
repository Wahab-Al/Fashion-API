import pool from '../../config/database/db'



//#region UP MIGRATION: CREATE ORDER TABLE
export const up = async (): Promise<void> => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS orders(
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL UNIQUE,
      user_id INT NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      status ENUM('pending', 'processing','delivered','cancelled') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `)
}
//#endregion


//#region DOWN MIGRATION: DROP ORDER TABLE
/**
 * Defines to rollback and remove order table
 */
export const down = async (): Promise<void> => {
  await pool.execute('DROP TABLE IF EXISTS orders')
}
//#endregion