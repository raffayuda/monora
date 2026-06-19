import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { CategoryController } from '../controllers/CategoryController.js'

const router = Router()
const controller = new CategoryController()

router.get('/', asyncHandler(controller.list))
router.post('/', authenticate, authorize('app_admin'), asyncHandler(controller.create))
router.put('/:id', authenticate, authorize('app_admin'), asyncHandler(controller.update))
router.delete('/:id', authenticate, authorize('app_admin'), asyncHandler(controller.remove))

export default router
