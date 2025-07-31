import mongoose from 'mongoose';

export const connectMongo = async () => {
  if (mongoose.connection.readyState === 0) {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    if (!connectionString) {
      throw new Error('MONGODB_CONNECTION_STRING environment variable must be defined.');
    }
    await mongoose.connect(connectionString);
  }

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database instance is not available.');
  }
  return { db };
};