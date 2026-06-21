import pool from '../../config/database/db'



//#region  UP MIGRATION: CREATE CATEGORIES TABLE
export const up = async (): Promise<void> => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS categories(
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL UNIQUE,
      img_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
}
//#endregion


//#region DOWN MIGRATION: DROP CATEGORIES TABLE
/**
 * Defines to rollback and remove category table
 */
export const down = async (): Promise<void> => {
  await pool.execute('DROP TABLE IF EXISTS categories')
}
//#endregion