import express from 'express';
import bodyParser from 'body-parser';
import { connectDb } from './services/db';
import authRouter from './routers/auth';
import postsRouter from './routers/posts';
import adminRouter from './routers/admin';
import { PORT } from './config';

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/debug', require('./routers/debug').default);

const start = async () => {
	await connectDb();
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();

export default app;

