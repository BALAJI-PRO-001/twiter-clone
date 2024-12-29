import app from './app';
import * as mongodb from './db';
import dotenv from 'dotenv';
import { extractErrorMessage } from './lib/utils/common';

dotenv.config();

async function main() {
  try {
    await mongodb.connect();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server in running on port: ${PORT} [ ✔ ]`);
    });
  } catch (err) {
    console.log('Error: ' + extractErrorMessage(err));
    process.exit(1);
  }
}

main();