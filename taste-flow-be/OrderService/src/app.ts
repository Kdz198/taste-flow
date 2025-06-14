console.log('Starting Order Service...');
import express from 'express';
import dotenv from 'dotenv';
import orderRoutes from './routers/order.routes';
import { connectDB } from './db/db';
connectDB();
dotenv.config();
const app = express();
app.use(express.json());
app.use('/api/order', orderRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Order Service is running on port ${process.env.PORT}`);
});

