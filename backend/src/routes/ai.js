import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { AiController } from '../controllers/AiController.js'

const router = Router()
const controller = new AiController()

router.post('/chat', asyncHandler(controller.chat))

export default router
