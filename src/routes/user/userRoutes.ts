import { Router } from 'express'
import { getAllUsers, getUserByUuid, updateUser, deleteUser, getMyProfile, updateMyProfile, deleteMyAccount } from '../../controllers/user/userController'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminMiddleware } from '../../middleware/admin/adminMiddleware'

const router = Router()

//#region Customer Self-Management (MUST BE FIRST)
router.get('/me', authMiddleware, getMyProfile);        
router.patch('/me', authMiddleware, updateMyProfile);
router.delete('/me', authMiddleware, deleteMyAccount);
//#endregion

//#region User Routes
router.get('/', authMiddleware, adminMiddleware, getAllUsers)
router.get('/:uuid', authMiddleware, getUserByUuid)
router.patch('/:uuid', authMiddleware, updateUser)
router.delete('/:uuid', authMiddleware, deleteUser)
//#endregion

export default router