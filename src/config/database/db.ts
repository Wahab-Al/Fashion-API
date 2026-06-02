import mysql from 'mysql2/promise'
import dotenv from 'dotenv'


dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})


export const testConnection = async() : Promise<void> => {
  try {
    const connection = await pool.getConnection()
    console.log('Database connected successfully..')
    connection.release()    
  }catch(error){
    console.error('Database connection failed: ', error)
    process.exit(1)
  }
}

export default pool