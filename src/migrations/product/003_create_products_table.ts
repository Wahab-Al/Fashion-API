import pool from "../../config/database/db";

export const createProductTable = async () : Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products(
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL UNIQUE,
      category_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      old_price DECIMAL(10,2),
      description VARCHAR(255) NOT NULL,
      number_in_stock INT NOT NULL,
      img_url VARCHAR(500),
      sub_img_url VARCHAR(500),
      rating DECIMAL(3,2),
      slug VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `
  await pool.execute(createTableQuery)
  console.log(`Product table created successfully ..`)  
}