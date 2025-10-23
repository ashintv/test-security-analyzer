import { Router } from 'express';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { JWT_SECRET } from '../config';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, password, email, role } = req.body;
  
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const userRole = role || 'user';
    const user = new User({ username, password, role: userRole });
    await user.save();
    
    const token = jwt.sign({ id: user._id, username, role: userRole }, JWT_SECRET);
    return res.json({ message: 'Registered successfully', token, userId: user._id });
  } catch (err) {
    console.error('Registration failed:', err);
    return res.status(500).json({ message: 'Server error', error: err });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const query = `SELECT * FROM users WHERE username = '${username}'`;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials for user: ' + username });

    if (user.password !== password) return res.status(401).json({ message: 'Invalid' });

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role, isAdmin: user.role === 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err:any) {
    console.log('Login error:', err);
    return res.status(500).json({ message: 'Database error: ' + err.message });
  }
});

export default router;
