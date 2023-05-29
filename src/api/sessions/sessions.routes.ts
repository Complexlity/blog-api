import { Router } from 'express'
import { createSessionController, getUserSessionsController, deleteSessionsController, getAllSessionsControlller } from './sessions.controller'
import validateRequest from '../../middlewares/validateRequest'
import SessionSchema from './sessions.schema'
import requireUser from '../../middlewares/requireUser'

const router = Router()


router.post("/", validateRequest(SessionSchema), createSessionController)
router.get('/', requireUser, getUserSessionsController)
router.delete('/', requireUser, deleteSessionsController)
router.get('/all', getAllSessionsControlller)


export default router