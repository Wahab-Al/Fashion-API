import pool from '../../config/database/db'



//#region UP MIGRATION: CREATE USERS TABLE
export const up = async () : Promise<void> => {
  await pool.execute( `
    CREATE TABLE IF NOT EXISTS users(
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      surname VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
      street VARCHAR(255),
      city VARCHAR(100),
      state VARCHAR(100),
      zip_code VARCHAR(20),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
  )
}
//#endregion


//#region DOWN MIGRATION: DROP USERS TABLE
/**
 * Defines to rollback and remove user table
 */
export const down = async () : Promise<void> => {
  await pool.execute(`DROP TABLE IF EXISTS users`)
}
//#endregion