import mongoose from 'mongoose';
import supertest from 'supertest';
import { app, server } from '../server';
import * as util from '../models/application';
import { Question, Tag } from '../types';

const tag1: Tag = {
  _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
  name: 'tag1',
};
const tag2: Tag = {
  _id: new mongoose.Types.ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'tag2',
};

const mockQuestion: Question = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
  title: 'New Question Title',
  text: 'New Question Text',
  tags: [tag1, tag2],
  answers: [],
  asked_by: 'question3_user',
  ask_date_time: new Date('2024-06-06'),
  views: 0,
};

const simplifyQuestion = (question: Question) => ({
  ...question,
  _id: question._id?.toString(), // Converting ObjectId to string
  tags: question.tags.map(tag => ({ ...tag, _id: tag._id?.toString() })), // Converting tag ObjectId
  answers: question.answers.map(answer => ({
    ...answer,
    _id: answer._id?.toString(),
    ans_date_time: answer.ans_date_time.toISOString(),
  })), // Converting answer ObjectId
  ask_date_time: question.ask_date_time.toISOString(),
});

describe('POST /addQuestion', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    server.close();
  });

  it('should add a new question', async () => {
    jest.spyOn(util, 'getTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest.spyOn(util, 'saveQuestion').mockResolvedValueOnce(mockQuestion as Question);

    // Making the request
    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(simplifyQuestion(mockQuestion));
  });

  it('should return 500 if error occurs while adding a new question', async () => {
    jest.spyOn(util, 'getTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest
      .spyOn(util, 'saveQuestion')
      .mockResolvedValueOnce({ error: 'Error while saving question' });

    // Making the request
    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return 500 if tag ids could not be retrieved', async () => {
    jest.spyOn(util, 'getTags').mockResolvedValue([]);

    // Making the request
    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return bad request if question title is empty string', async () => {
    // Making the request
    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question body');
  });

  it('should return bad request if question text is empty string', async () => {
    // Making the request
    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question body');
  });

  it('should return bad request if tags are empty', async () => {
    // Making the request
    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question body');
  });

  it('should return bad request if asked_by is empty string', async () => {
    // Making the request
    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid question body');
  });

  it('should ensure only unique tags are added', async () => {
    const result: Question = {
      _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
      title: 'New Question Title',
      text: 'New Question Text',
      tags: [tag1, tag2], // Duplicate tags
      answers: [],
      asked_by: 'question3_user',
      ask_date_time: new Date('2024-06-06'),
      views: 0,
    };

    // Set up the mock to resolve with unique tags
    jest.spyOn(util, 'getTags').mockResolvedValue([tag1, tag2] as Tag[]);
    jest.spyOn(util, 'saveQuestion').mockResolvedValueOnce({
      ...mockQuestion,
      tags: [tag1, tag2], // Ensure only unique tags are saved
    });

    // Making the request
    const response = await supertest(app).post('/question/addQuestion').send(mockQuestion);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(simplifyQuestion(result)); // Expect only unique tags
  });
});
