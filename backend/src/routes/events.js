import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { EventController } from '../controllers/EventController.js'

const router = Router()
const controller = new EventController()

router.get('/', asyncHandler(controller.listPublic))
router.get('/admin/my-events', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.listMyEvents))
router.get('/admin/all', authenticate, authorize('app_admin'), asyncHandler(controller.listAllAdmin))
router.get('/:idOrSlug', asyncHandler(controller.getByIdOrSlug))
router.post('/', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.create))
router.put('/:id', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.update))
router.delete('/:id', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.remove))
router.post('/:id/discount', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.addDiscount))
router.delete('/:id/discount', authenticate, authorize('event_admin', 'app_admin'), asyncHandler(controller.removeDiscount))

export default router
