import express from 'express';
import payload from 'payload';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Added for ESM __dirname

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

const start = async () => {
  // Abort startup if critical environment variables are missing
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is missing');
  }
  if (!process.env.DATABASE_URI) {
    throw new Error('DATABASE_URI environment variable is missing');
  }

  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.listen(process.env.PORT || 3000);
};

start();