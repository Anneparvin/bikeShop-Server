import {Server} from 'http';
import mongoose from 'mongoose';
import app from './app';
import config from './config/index';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on("unhandledRejection", (error) => {
  console.log(`😈 unhandledRejection is detected , shutting down ...`, error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log(`😈 uncaughtException is detected , shutting down ...`, error);
  process.exit(1);
})