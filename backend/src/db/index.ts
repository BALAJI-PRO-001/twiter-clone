import mongoose from 'mongoose';
import { extractErrorMessage } from '../lib/utils/common';
import { DB_CONNECTED_MSG } from '../constants/logMessages';

export async function connect(): Promise<void> {
  try { 
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI as string);
    console.log(DB_CONNECTED_MSG);
  } catch (err) {
    console.log(extractErrorMessage(err));
    process.exit(1);
  }
}