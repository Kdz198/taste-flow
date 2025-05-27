console.log('Starting Menu Service...');
import express from 'express';
import dotenv from 'dotenv';
import menuRouter from './routes/menu.route';
import { connectDB } from './database/db';
connectDB();
dotenv.config();
const app = express();
app.use(express.json());
app.use('/api', menuRouter);
app.listen(process.env.PORT, () => {
    console.log(`Menu Service is running on port ${process.env.PORT}`);
});
