import { Router, Request, Response, NextFunction } from 'express'
import { getAllPostsController, updatePostController, createPostController, getPostCommentsController, updateLikeController, getSinglePostController, deletePostController } from './posts.controller'
import { PostSchema, PostUpdateSchema } from './posts.schema'
import validateRequest from '../../middlewares/validateRequest'
import requireUser from '../../middlewares/requireUser'
import { CommentSchema } from '../comments/comments.schema'
import { createCommentController,  } from '../comments/comments.controller'

const router = Router()

router.post('/:postId/comments', requireUser, validateRequest(CommentSchema), createCommentController)
router.get("/:postId/comments", getPostCommentsController)

router.get('/:slug', getSinglePostController)
router.patch("/:postId", requireUser, validateRequest(PostUpdateSchema), updatePostController);
router.put('/:postId', requireUser, updateLikeController)
router.delete('/:postId', requireUser, deletePostController)
router.post('/', requireUser, validateRequest(PostSchema), createPostController)
router.get('/', getAllPostsController)

export default router