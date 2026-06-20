import pool from '../../config/database/db'

export const createOrderTabe = async () : Promise<void> => {
  const createTableQuery = `
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
  `
  await pool.execute(createTableQuery)
  console.log(`Order table created successfully ..  `)
}