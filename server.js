import { handler } from './build/handler.js';
import express from 'express';

const app = express();

// Let Cloud Run bind to all hosts
app.use(handler);

app.listen('8080', '0.0.0.0', () => {
  console.log(`Server listening on port 8080`);
});