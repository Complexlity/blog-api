import { Router, Request, Response, NextFunction } from 'express'
import { getAllPostsController, updatePostController, createPostController, getPostCommentsController, updateLikeController, getSinglePostController, deletePostController } from './posts.controller'
import { PostSchema, PostUpdateSchema } from './posts.schema'
import validateRequest from '../../middlewares/validateRequest'
import requireUser from '../../middlewares/requireUser'
import { CommentSchema } from '../comments/comments.schema'
import { createCommentController,  } from '../comments/comments.controller'
import { handleMulterErrors, upload } from './multerConfig'

const router = Router()

router.post('/:postId/comments', requireUser, validateRequest(CommentSchema), createCommentController)
router.get("/:postId/comments", getPostCommentsController)

router.get('/:slug', getSinglePostController)
router.patch("/:postId", requireUser, validateRequest(PostUpdateSchema), updatePostController);
router.put('/:postId', requireUser, updateLikeController)
router.delete('/:postId', requireUser, deletePostController)
router.post('/', requireUser, validateRequest(PostSchema), createPostController)
router.post('/md_old', requireUser, upload.single('file'), handleMulterErrors,  validateRequest(PostSchema), createPostController)
router.post('/md', (req, res, next) => {
    console.log("I am here jnow")
    console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
    next()
}, upload.any(),  (req: Request, res: Response, next: NextFunction) => {
    const formData = req.body
    
    console.log("Form Data:", formData)
    next(new Error("Successful"))

})
router.get('/', getAllPostsController)

export default router