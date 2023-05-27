import { Router } from 'express'
import { createUserController, getAllUsersController } from './users.controller'
import validateRequest from '../../middlewares/validateRequest'
import UserSchema from './users.schema'
const router = Router()


router.post("/", validateRequest(UserSchema), createUserController)
router.get('/', getAllUsersController)

export default router