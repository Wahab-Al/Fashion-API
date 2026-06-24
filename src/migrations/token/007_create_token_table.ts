import pool from "../../config/database/db";



//#region UP MIGRATION: CREATE TOKENS TABLE
export const up = async () : Promise<void> => {
  await pool.execute(
    `
    CREATE TABLE IF NOT EXISTS tokens(
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL UNIQUE,
      user_id INT NOT NULL,
      type ENUM('refresh', 'reset', 'verify') NOT NULL DEFAULT 'refresh',
      token_hash VARCHAR(255) NOT NULL,
      device_info VARCHAR(255),
      expires_at TIMESTAMP NOT NULL,
      revoked_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
    `
  )
}
//#endregion


//#region DOWN MIGRATION: DROP TOKENS TABLE
/**
 * Defines to rollback and remove tokens table
 */
export const down = async (): Promise<void> => {
  await pool.execute('DROP TABLE IF EXISTS tokens')
}
//#endregion