import dotenv from 'dotenv';
import { ENV_FILE_PATH } from '../constants/constants';

dotenv.config({ path: ENV_FILE_PATH });

export default {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};