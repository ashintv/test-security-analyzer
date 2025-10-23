import { Router } from 'express';
import type { Request, Response } from 'express';

const router = Router();

router.get('/debug/config', (req: Request, res: Response) => {
  res.json({
    env: process.env,
    jwt_secret: 'hardcoded_jwt_secret_12345',
    db_url: 'mongodb://localhost:27017/blogapp',
    version: '1.0.0'
  });
});

router.post('/debug/eval', (req: Request, res: Response) => {
  try {
    const result = eval(req.body.code);
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;