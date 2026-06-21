import { Router } from 'express'
import { getAllProducts, getProductByUuid, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../../controllers/product/productController'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminMiddleware } from '../../middleware/admin/adminMiddleware'



const router = Router()



//#region Product Routes
router.get('/', getAllProducts)
router.get('/:uuid', getProductByUuid)
router.get('/slug/:slug', getProductBySlug)
router.post('/', authMiddleware, adminMiddleware, createProduct)
router.patch('/:uuid', authMiddleware, adminMiddleware, updateProduct)
router.delete('/:uuid', authMiddleware, adminMiddleware, deleteProduct)

//#endregion

export default router