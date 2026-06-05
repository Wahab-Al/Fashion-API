import pool from '../../config/database/db'

export const createCategoriesTable = async () : Promise<void> => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS categories(
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    img_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`
  await pool.execute(createTableQuery)
  console.log('Categories table created successfully.')
}