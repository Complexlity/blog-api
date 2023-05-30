import express from 'express';
import MessageResponse from '../interfaces/MessageResponse';
import users from './users/users.routes'
import sessions from './sessions/sessions.routes'
import { deserializeUser } from '../middlewares/deserializeUser';


const router = express.Router();


router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use(deserializeUser)
router.use('/users', users)
router.use('/sessions', sessions)

export default router;
