import express from 'express';
import { v4 as uuidV4 } from 'uuid'
import Comment from './comments/comment.model';
const router = express.Router();

type EmojiResponse = string[];

router.get<{}, EmojiResponse>('/', (req, res) => {
  res.json(['😀', '😳', '🙄']);
});

router.get<{}, Comment>('/comment', (req, res) => {
  let comment = { id: uuidV4(), content: "Hello World", createdAt: new Date(), likeCount: 0 }
  res.json(comment)
})

export default router;
