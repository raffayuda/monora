import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { RefundController } from '../controllers/RefundController.js'

const router = Router()
const controller = new RefundController()

router.post('/', authenticate, asyncHandler(controller.create))
router.get('/', authenticate, asyncHandler(controller.list))
router.get('/order/:orderId', authenticate, asyncHandler(controller.getByOrderId))
router.put('/:id/process', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.process))

export default router
