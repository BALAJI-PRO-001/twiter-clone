import mongoose from 'mongoose';
import { extractErrorMessage } from '../lib/utils/common';

export async function connect(): Promise<void> {
  try { 
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI as string);
    console.log('Mongodb database connected [ ✔ ]');
  } catch (err) {
    console.log(extractErrorMessage(err));
    process.exit(1);
  }
}