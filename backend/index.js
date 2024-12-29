import app from './app.js';
import * as mongodb from './db/mongodb.js';

async function main() {
  try {
    await mongodb.connect();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT} [ ✔ ]`);
    });
  } catch (err) {
    console.log('Error: ' + err.message);
    process.exit(1);
  }
}

main();