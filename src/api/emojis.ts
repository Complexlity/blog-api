import express from 'express';
import { v4 as uuidV4 } from 'uuid'
const router = express.Router();

type EmojiResponse = string[];

router.get<{}, EmojiResponse>('/', (req, res) => {
  res.json(['😀', '😳', '🙄']);
});


export default router;
