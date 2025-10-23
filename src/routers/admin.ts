import { Router } from 'express';
import type { Request, Response } from 'express';
import { authenticate } from '../middlewares/auth';
import { requireAdmin } from '../middlewares/admin';
import { User } from '../models/User';

const router = Router();

// Admin: list users
router.get('/users', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const users = await User.find().select('-__v');
  res.json(users);
});

// Admin: promote user
router.post('/promote', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'Not found' });
  user.role = 'admin';
  await user.save();
  res.json({ message: 'Promoted' });
});

export default router;
