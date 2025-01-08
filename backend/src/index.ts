import app from './app';
import * as mongodb from './db';
import dotenv from 'dotenv';
import { extractErrorMessage } from './lib/utils/common';
import { SERVER_START_MSG } from './constants/logMessages';

dotenv.config();

async function main() {
  try {
    await mongodb.connect();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(SERVER_START_MSG);
    });
  } catch (err) {
    console.log('Error: ' + extractErrorMessage(err));
    process.exit(1);
  }
}

main();