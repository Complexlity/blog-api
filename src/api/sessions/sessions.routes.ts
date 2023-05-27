import { Router } from 'express'
import { createSessionController, getSessionsController } from './sessions.controller'
import validateRequest from '../../middlewares/validateRequest'
import SessionSchema from './sessions.schema'
const router = Router()


router.post("/", validateRequest(SessionSchema), createSessionController)
router.get('/', getSessionsController)



export default router