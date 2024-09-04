import mongoose from 'mongoose';
import AnswerModel from './models/answers';
import QuestionModel from './models/questions';
import TagModel from './models/tags';
import { Answer, Question, Tag } from './types';
import {
  Q1_DESC,
  Q1_TXT,
  Q2_DESC,
  Q2_TXT,
  Q3_DESC,
  Q3_TXT,
  Q4_DESC,
  Q4_TXT,
  A1_TXT,
  A2_TXT,
  A3_TXT,
  A4_TXT,
  A5_TXT,
  A6_TXT,
  A7_TXT,
  A8_TXT,
  T1_NAME,
  T1_DESC,
  T2_NAME,
  T2_DESC,
  T3_NAME,
  T3_DESC,
  T4_NAME,
  T4_DESC,
  T5_NAME,
  T5_DESC,
  T6_NAME,
  T6_DESC,
} from './data/posts_strings';

// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
const userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
  throw new Error('ERROR: You need to specify a valid mongodb URL as the first argument');
}

const mongoDB = userArgs[0];
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/**
 * Creates a new Tag document in the database.
 *
 * @param name The name of the tag.
 * @param description The description of the tag.
 * @returns A Promise that resolves to the created Tag document.
 * @throws An error if the name is empty.
 */
async function tagCreate(name: string, description: string): Promise<Tag> {
  if (name === '') throw new Error('Invalid Tag Format');
  const tag: Tag = { name: name, description: description };
  return await TagModel.create(tag);
}

/**
 * Creates a new Answer document in the database.
 *
 * @param text The content of the answer.
 * @param ans_by The username of the user who wrote the answer.
 * @param ans_date_time The date and time when the answer was created.
 * @returns A Promise that resolves to the created Answer document.
 * @throws An error if any of the parameters are invalid.
 */
async function answerCreate(text: string, ans_by: string, ans_date_time: Date): Promise<Answer> {
  if (text === '' || ans_by === '' || ans_date_time == null)
    throw new Error('Invalid Answer Format');
  const answerDetail: Answer = {
    text: text,
    ans_by: ans_by,
    ans_date_time: ans_date_time,
  };
  return await AnswerModel.create(answerDetail);
}

/**
 * Creates a new Question document in the database.
 *
 * @param title The title of the question.
 * @param text The content of the question.
 * @param tags An array of tags associated with the question.
 * @param answers An array of answers associated with the question.
 * @param asked_by The username of the user who asked the question.
 * @param ask_date_time The date and time when the question was asked.
 * @param views The number of views the question has received.
 * @returns A Promise that resolves to the created Question document.
 * @throws An error if any of the parameters are invalid.
 */
async function questionCreate(
  title: string,
  text: string,
  tags: Tag[],
  answers: Answer[],
  asked_by: string,
  ask_date_time: Date,
  views: number,
): Promise<Question> {
  if (title === '' || text === '' || tags.length === 0 || asked_by === '' || ask_date_time == null)
    throw new Error('Invalid Question Format');
  const questionDetail: Question = {
    title: title,
    text: text,
    tags: tags,
    asked_by: asked_by,
    answers: answers,
    views: views,
    ask_date_time: ask_date_time,
    up_votes: [],
    down_votes: [],
  };
  return await QuestionModel.create(questionDetail);
}

/**
 * Populates the database with predefined data.
 * Logs the status of the operation to the console.
 */
const populate = async () => {
  try {
    const t1 = await tagCreate(T1_NAME, T1_DESC);
    const t2 = await tagCreate(T2_NAME, T2_DESC);
    const t3 = await tagCreate(T3_NAME, T3_DESC);
    const t4 = await tagCreate(T4_NAME, T4_DESC);
    const t5 = await tagCreate(T5_NAME, T5_DESC);
    const t6 = await tagCreate(T6_NAME, T6_DESC);

    const a1 = await answerCreate(A1_TXT, 'hamkalo', new Date('2023-11-20T03:24:42'));
    const a2 = await answerCreate(A2_TXT, 'azad', new Date('2023-11-23T08:24:00'));
    const a3 = await answerCreate(A3_TXT, 'abaya', new Date('2023-11-18T09:24:00'));
    const a4 = await answerCreate(A4_TXT, 'alia', new Date('2023-11-12T03:30:00'));
    const a5 = await answerCreate(A5_TXT, 'sana', new Date('2023-11-01T15:24:19'));
    const a6 = await answerCreate(A6_TXT, 'abhi3241', new Date('2023-02-19T18:20:59'));
    const a7 = await answerCreate(A7_TXT, 'mackson3332', new Date('2023-02-22T17:19:00'));
    const a8 = await answerCreate(A8_TXT, 'ihba001', new Date('2023-03-22T21:17:53'));

    await questionCreate(
      Q1_DESC,
      Q1_TXT,
      [t1, t2],
      [a1, a2],
      'Joji John',
      new Date('2022-01-20T03:00:00'),
      10,
    );
    await questionCreate(
      Q2_DESC,
      Q2_TXT,
      [t3, t4, t2],
      [a3, a4, a5],
      'saltyPeter',
      new Date('2023-01-10T11:24:30'),
      121,
    );
    await questionCreate(
      Q3_DESC,
      Q3_TXT,
      [t5, t6],
      [a6, a7],
      'monkeyABC',
      new Date('2023-02-18T01:02:15'),
      200,
    );
    await questionCreate(
      Q4_DESC,
      Q4_TXT,
      [t3, t4, t5],
      [a8],
      'elephantCDE',
      new Date('2023-03-10T14:28:01'),
      103,
    );

    console.log('Database populated');
  } catch (err) {
    console.log('ERROR: ' + err);
  } finally {
    if (db) db.close();
    console.log('done');
  }
};

populate();

console.log('Processing ...');
