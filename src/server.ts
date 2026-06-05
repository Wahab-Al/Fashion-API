import express from 'express'
import dotenv from 'dotenv'
import { testConnection }  from './config/database/db'
import { runMigrations } from './migrations/index'

dotenv.config()



const app = express()
const PORT : number = process.env.PORT ? Number(process.env.PORT) : 5000

app.use(express.json())

testConnection()
runMigrations()




app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})


export default app