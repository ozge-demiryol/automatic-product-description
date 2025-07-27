import mongoose from 'mongoose';

export const connectMongo = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI || '');
  }
};
