import pool from "../../config/database/db";

export const createOrderLinesTable = async () : Promise<void> => { 
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS order_lines (
      id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(36) NOT NULL UNIQUE,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price  DECIMAL(10,2) NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
  )`

  await pool.execute(createTableQuery)
  console.log(`Order_lines table created successfully ..`)
}