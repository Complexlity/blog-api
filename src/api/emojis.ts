import express from 'express';
import Comment from './comments/comment.model';
import { v4 as uuidV4 } from 'uuid'
const router = express.Router();

type EmojiResponse = string[];

router.get<{}, EmojiResponse>('/', (req, res) => {
  res.json(['😀', '😳', '🙄']);
});

router.get<{}, Comment>('/comment', (req, res) => {
  let comment = { id: uuidV4(), content: "hello world", createdAt: new Date, likeCount: 0 }
  comment = Comment.parse(comment)
  res.json(comment)
})

export default router;
