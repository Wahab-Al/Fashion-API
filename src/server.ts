import express from 'express'
import dotenv from 'dotenv'
import { testConnection }  from './config/database/db'
import { runMigrations } from './migrations/index'
import router from './routes/authentication/authRoutes'
import cors from 'cors'
import userRouter from './routes/user/userRoutes'

dotenv.config()


const app = express()
const PORT : number = process.env.PORT ? Number(process.env.PORT) : 5000


app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use('/api/auth', router)

app.use('/api/users', userRouter)


testConnection()
runMigrations()



app.listen(PORT, ()=>{
  console.log(`Server running on port ${PORT}`)
})


export default app