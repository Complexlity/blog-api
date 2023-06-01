import express, { NextFunction } from 'express';
import MessageResponse from '../interfaces/MessageResponse';
import users from './users/users.routes'
import sessions from './sessions/sessions.routes'
import posts from './posts/posts.routes'
import comments from './comments/comments.routes'
import { deserializeUser } from '../middlewares/deserializeUser';
import requireUser from '../middlewares/requireUser';
import { omit } from 'lodash';


const router = express.Router()


router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use(deserializeUser)
router.use('/me', requireUser, (req, res) => {
  let user = res.locals.user
  res.json(omit(user, ['createdAt', 'updatedAt']))
})
router.use('/users', users)
router.use('/sessions', sessions)
router.use('/posts', posts)
router.use('/comments', comments)
export default router;

