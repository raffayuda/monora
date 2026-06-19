import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { AuthController } from '../controllers/AuthController.js'

const router = Router()
const controller = new AuthController()

router.post('/register', asyncHandler(controller.register))
router.post('/login', asyncHandler(controller.login))
router.get('/me', authenticate, asyncHandler(controller.me))

export default router
