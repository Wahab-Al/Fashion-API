import { Router } from 'express'
import { refreshTokens, revokeRefreshToken, revokeAllTokens } from '../../controllers/token/tokenController'
import { authMiddleware } from '../../middleware/authMiddleware'

const router = Router()
//#region Token Routes
router.post('/refresh', refreshTokens)
router.post('/revoke', authMiddleware, revokeRefreshToken)
router.post('/revoke-all', authMiddleware, revokeAllTokens)
//#endregion

export default router