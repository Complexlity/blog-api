import { Router } from 'express'
import { getAllPostsController, createPostController, getPostCommentsController } from './posts.controller'
import { PostSchema } from './posts.schema'
import validateRequest from '../../middlewares/validateRequest'
import requireUser from '../../middlewares/requireUser'
import { CommentSchema } from '../comments/comments.schema'
import { createCommentController, deleteCommentController } from '../comments/comments.controller'
const router = Router()

router.post('/:postId/comments', requireUser, validateRequest(CommentSchema), createCommentController)
router.get("/:postId/comments", getPostCommentsController)

router.delete('/:postId/comments/:commentId', requireUser, deleteCommentController)
router.post('/create', requireUser, validateRequest(PostSchema), createPostController)
router.get('/', getAllPostsController)

export default router