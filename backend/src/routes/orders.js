import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { OrderController } from '../controllers/OrderController.js'

const router = Router()
const controller = new OrderController()

router.post('/', authenticate, asyncHandler(controller.create))
router.get('/my-orders', authenticate, asyncHandler(controller.listMyOrders))
router.get('/', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.list))
router.get('/event/:eventId', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.listByEvent))
router.put('/:id/status', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.updateStatus))

export default router
