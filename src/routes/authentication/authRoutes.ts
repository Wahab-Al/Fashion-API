import { Router } from "express";
import { register, login, logout, logoutAll } from "../../controllers/authentication/authController";
import { authMiddleware } from "../../middleware/authMiddleware";

const router = Router()


router.post('/register', register)
router.post('/login', login)
router.post('/logout', authMiddleware, logout)
router.post('/logoutAll', authMiddleware, logoutAll)


export default router