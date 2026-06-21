import { Router } from 'express'
import { getUserOrders, getOrderByUuid, createOrder, updateOrderStatus, deleteOrder } from '../../controllers/order/orderController'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminMiddleware } from '../../middleware/admin/adminMiddleware'
import { getOrderLinesByOrder } from '../../controllers/orderLine/orderLineController'



const router = Router()


//#region Order Routes
router.get('/', authMiddleware, getUserOrders)
router.get('/:uuid', authMiddleware, getOrderByUuid)
router.get('/:uuid/lines', authMiddleware, getOrderLinesByOrder)
router.post('/', authMiddleware, createOrder)
router.patch('/:uuid/status', authMiddleware, updateOrderStatus)
router.delete('/:uuid', authMiddleware, adminMiddleware, deleteOrder)

//#endregion
export default router