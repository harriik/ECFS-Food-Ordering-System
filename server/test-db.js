import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodapp';
console.log('Attempting to connect to:', uri);

mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('CONNECTION_SUCCESS');
    process.exit(0);
  })
  .catch((err) => {
    console.error('CONNECTION_FAIL:', err.message);
    process.exit(1);
  });
