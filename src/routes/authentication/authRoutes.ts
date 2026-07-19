import { Router } from "express";
import { register, login, logout, logoutAll } from "../../controllers/authentication/authController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validate } from "../../middleware/validate/validateMiddleware";
import { registerSchema, loginSchema } from "../../validators/auth.validator";


const router = Router()


router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/logout', authMiddleware, logout)
router.post('/logoutAll', authMiddleware, logoutAll)


export default router