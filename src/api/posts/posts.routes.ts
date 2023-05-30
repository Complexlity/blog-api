import { Router } from 'express'
import { defaultRouter } from './post.controller'
const router = Router()

router.get('/', defaultRouter)

export default router