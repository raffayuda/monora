import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ChatController } from '../controllers/ChatController.js'

const router = Router()
const controller = new ChatController()

router.post('/send', authenticate, asyncHandler(controller.send))
router.get('/my-chats', authenticate, asyncHandler(controller.myChats))
router.get('/event/:eventId', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.byEvent))
router.get('/all', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.all))
router.post('/:chatId/reply', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.reply))
router.get('/messages/:eventId', authenticate, asyncHandler(controller.messagesByEvent))

export default router
