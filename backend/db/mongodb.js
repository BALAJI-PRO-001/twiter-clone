import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI);
    console.log('Mongodb database connected [ ✔ ]');
  } catch (err) {
    console.log('Mongodb Error: ' + err.message);
    process.exit(1);
  }
}
