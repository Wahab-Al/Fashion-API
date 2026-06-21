import pool from "../../config/database/db";




//#region UP MIGRATION: CREATE ADDRESSES TABLE
export const up = async (): Promise<void> => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS address(
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL UNIQUE,
      user_id INT NOT NULL,
      zip_code VARCHAR(20),
      city VARCHAR(100),
      street VARCHAR(150),
      state VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `)
}
//#endregion


//#region DOWN MIGRATION: DROP ADDRESSES TABLE
/**
 * Defines to rollback and remove address table
 */
export const down = async (): Promise<void> => {
  await pool.execute('DROP TABLE IF EXISTS address')
}
//#endregion

