import { Router } from 'express'
import { getAllCategories, getCategoryByUuid, createCategory, updateCategory, deleteCategory } from '../../controllers/category/categorieController'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminMiddleware } from '../../middleware/admin/adminMiddleware'

const router = Router()

//#region Category Routes
router.get('/', getAllCategories)
router.get('/:uuid', getCategoryByUuid)
router.post('/', authMiddleware, adminMiddleware, createCategory)
router.patch('/:uuid', authMiddleware, adminMiddleware, updateCategory)
router.delete('/:uuid', authMiddleware, adminMiddleware, deleteCategory)
//#endregion

export default router