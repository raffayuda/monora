import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { UserController } from '../controllers/UserController.js'

const router = Router()
const controller = new UserController()

router.get('/', authenticate, authorize('app_admin'), asyncHandler(controller.list))
router.put('/:id/role', authenticate, authorize('app_admin'), asyncHandler(controller.updateRole))
router.put('/:id/toggle-status', authenticate, authorize('app_admin'), asyncHandler(controller.toggleStatus))
router.delete('/:id', authenticate, authorize('app_admin'), asyncHandler(controller.remove))

export default router
