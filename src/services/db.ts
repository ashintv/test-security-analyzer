import mongoose from 'mongoose';
import { MONGO_URL } from '../config/index';

export const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
};
