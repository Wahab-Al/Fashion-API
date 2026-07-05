import pool from "../../config/database/db"



//#region UP MIGRATION: CREATE CARTS TABLE
export const up = async (): Promise<void> => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS carts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL UNIQUE,
      user_id INT NOT NULL,
      status ENUM('active', 'abandoned', 'converted') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)
}
//#endregion


//#region DOWN MIGRATION: DROP CARTS TABLE
/**
 * Rollback carts table
 */
export const down = async (): Promise<void> => {
  await pool.execute('DROP TABLE IF EXISTS carts')
}
//#endregion