// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import answerController from './controller/answer';
import questionController from './controller/question';
import tagController from './controller/tag';

const MONGO_URL = 'mongodb://127.0.0.1:27017/fake_so';
const CLIENT_URL = 'http://localhost:3000';
const port = 8000;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error: ', err));

const app = express();

app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  }),
);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
  res.end();
});

app.use('/question', questionController);
app.use('/tag', tagController);
app.use('/answer', answerController);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    mongoose.disconnect();
    console.log('Server closed.');
    process.exit(0);
  });
});

export { app, server }; // Export the app instance
