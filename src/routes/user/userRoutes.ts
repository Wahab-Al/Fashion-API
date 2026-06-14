import { Router } from 'express'
import { getAllUsers, getUserByUuid, updateUser, deleteUser } from '../../controllers/user/userController'
import { authMiddleware } from '../../middleware/authMiddleware'

const router = Router()

router.get('/', authMiddleware, getAllUsers)
router.get('/:uuid', authMiddleware, getUserByUuid)
router.patch('/:uuid', authMiddleware, updateUser)
router.delete('/:uuid', authMiddleware, deleteUser)

export default router