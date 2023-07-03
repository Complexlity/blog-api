import { Router } from 'express'
import { createUserController, getAllUsersController, patchUserController } from './users.controller'
import validateRequest from '../../middlewares/validateRequest'
import UserSchema, {UserPatchSchema} from './users.schema'
import requireUser from '../../middlewares/requireUser'
import MessageResponse from '../../interfaces/MessageResponse'
const router = Router()


router.post("/", validateRequest(UserSchema), createUserController)
router.get('/', getAllUsersController)
router.patch<{}, MessageResponse>('/', requireUser, validateRequest(UserPatchSchema), patchUserController)

export default router