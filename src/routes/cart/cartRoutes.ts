import { Router } from "express";
import { getCart, addItemToCart, updateCartItem, removeItemFromCart, clearCart } from "../../controllers/cart/cartController";
import { authMiddleware } from "../../middleware/authMiddleware";


const router = Router()


router.get('/', authMiddleware, getCart)
router.post('/items', authMiddleware, addItemToCart)
router.patch('/items/:uuid', authMiddleware, updateCartItem)
router.delete('/items/:uuid', authMiddleware, removeItemFromCart)
router.delete('/', authMiddleware, clearCart)

export default router