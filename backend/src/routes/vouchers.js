import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { VoucherController } from '../controllers/VoucherController.js'

const router = Router()
const controller = new VoucherController()

router.get('/', authenticate, asyncHandler(controller.list))
router.post('/', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.create))
router.put('/:id', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.update))
router.delete('/:id', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.remove))
router.post('/validate', authenticate, asyncHandler(controller.validate))
router.post('/use', authenticate, asyncHandler(controller.use))

export default router
