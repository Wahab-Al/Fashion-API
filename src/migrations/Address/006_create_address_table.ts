import pool from "../../config/database/db";

export const createAddressTable = async () : Promise<void> =>{
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS address(
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL UNIQUE,
      zip_code VARCHAR(20),
      city VARCHAR(100),
      street VARCHAR(150),
      state VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `
  await pool.execute(createTableQuery)
  console.log('Address table created successfully.') 
}