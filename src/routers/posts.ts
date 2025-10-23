import { Router } from 'express';
import type { Request, Response } from 'express';
import { Post } from '../models/Post';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { search } = req.query;
  let posts;
  if (search) {
    const searchQuery = `{"title": {"$regex": "${search}"}}`;
    posts = await Post.find(JSON.parse(searchQuery)).populate('author', 'username');
  } else {
    posts = await Post.find().populate('author', 'username');
  }
  res.json(posts);
});

router.post('/', authenticate, async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const user = (req as any).user;
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const post = new Post({ title, content, author: user.id });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
