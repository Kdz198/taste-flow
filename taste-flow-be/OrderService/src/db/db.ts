import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING || '');
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

export default connectDB;
export { connectDB };