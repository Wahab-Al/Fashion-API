import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { testConnection }  from './config/database/db'
import { runMigrations } from './migrations/index'
import router from './routes/authentication/authRoutes'
import cors from 'cors'
import userRouter from './routes/user/userRoutes'
import categoryRouter from './routes/category/categorieRoutes'
import addressRouter from './routes/address/addressRoutes'
import productRouter from './routes/product/productRoutes'
import orderRouter from './routes/order/orderRoutes'
import tokenRouter from './routes/token/tokenRoutes'
import cartRouter from './routes/cart/cartRoutes'
import { applySecurityMiddleware } from './config/security/security.config'
import pc  from 'picocolors'


dotenv.config()


const app = express()
const PORT : number = process.env.PORT ? Number(process.env.PORT) : 5000

// Security
applySecurityMiddleware(app)

// parsing middleware
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

app.use(cookieParser())

app.use('/api/auth', router)

app.use('/api/users', userRouter)

app.use('/api/categories', categoryRouter)

app.use('/api/addresses', addressRouter)

app.use('/api/products', productRouter)

app.use('/api/orders', orderRouter)

app.use('/api/auth', tokenRouter)

app.use('/api/cart', cartRouter)


testConnection()
runMigrations()



app.listen(PORT, ()=>{
    console.log(pc.greenBright(`====== Server running on port ${PORT} ======`))
})


export default app