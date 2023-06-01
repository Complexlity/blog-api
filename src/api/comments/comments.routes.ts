import { Router } from 'express'
import requireUser from '../../middlewares/requireUser'
import { deleteCommentController, updateLikeController } from './comments.controller'

const router = Router()

router.get('/', (req, res) => {
    res.send('I am from the comments area')
})

router.put('/:commentId', requireUser, updateLikeController)
router.delete('/:commentId', requireUser, deleteCommentController)

export default router