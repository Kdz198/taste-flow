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

//Eureka Config
import { eurekaClient } from './config/eureka.client';

app.listen(3000, () => {
    console.log('MenuService is running on port 3000');
    eurekaClient.start((error) => {
        console.log('Eureka registration complete or failed:', error || 'OK');
    });
});