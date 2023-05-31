import { Router } from 'express'
import { getAllPostsController, createPostController } from './posts.controller'
import { PostSchema } from './posts.schema'
import validateRequest from '../../middlewares/validateRequest'
import requireUser from '../../middlewares/requireUser'
const router = Router()

router.get('/', getAllPostsController)
router.post('/create', requireUser, validateRequest(PostSchema), createPostController)

export default router