import supertest from 'supertest';
import mongoose from 'mongoose';
import { app, server } from '../server';
import * as util from '../models/application';
import { Answer, Question, Tag } from '../types';

const getQuestionsByOrderSpy: jest.SpyInstance = jest.spyOn(util, 'getQuestionsByOrder');
const filterQuestionsBySearchSpy: jest.SpyInstance = jest.spyOn(util, 'filterQuestionsBySearch');

const tag1: Tag = {
  _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
  name: 'tag1',
};
const tag2: Tag = {
  _id: new mongoose.Types.ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'tag2',
};

const ans1: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'Answer 1 Text',
  ans_by: 'answer1_user',
  ans_date_time: new Date('2024-06-09'), // The mock date is string type but in the actual implementation it is a Date type
};

const ans2: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'Answer 2 Text',
  ans_by: 'answer2_user',
  ans_date_time: new Date('2024-06-10'),
};

const ans3: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'Answer 3 Text',
  ans_by: 'answer3_user',
  ans_date_time: new Date('2024-06-11'),
};

const ans4: Answer = {
  _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'Answer 4 Text',
  ans_by: 'answer4_user',
  ans_date_time: new Date('2024-06-14'),
};

const MOCK_QUESTIONS: Question[] = [
  {
    _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [tag1],
    answers: [ans1],
    asked_by: 'question1_user',
    ask_date_time: new Date('2024-06-03'),
    views: 10,
  },
  {
    _id: new mongoose.Types.ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [ans2, ans3],
    asked_by: 'question2_user',
    ask_date_time: new Date('2024-06-04'),
    views: 20,
  },
  {
    _id: new mongoose.Types.ObjectId('34e9b58910afe6e94fc6e99f'),
    title: 'Question 3 Title',
    text: 'Question 3 Text',
    tags: [tag1, tag2],
    answers: [ans4],
    asked_by: 'question3_user',
    ask_date_time: new Date('2024-06-03'),
    views: 101,
  },
];

const EXPECTED_QUESTIONS = MOCK_QUESTIONS.map(question => ({
  ...question,
  _id: question._id?.toString(), // Converting ObjectId to string
  tags: question.tags.map(tag => ({ ...tag, _id: tag._id?.toString() })), // Converting tag ObjectId
  answers: question.answers.map(answer => ({
    ...answer,
    _id: answer._id?.toString(),
    ans_date_time: answer.ans_date_time.toISOString(),
  })), // Converting answer ObjectId
  ask_date_time: question.ask_date_time.toISOString(),
}));

describe('GET /getQuestion', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    server.close();
  });

  it('should return the result of filterQuestionsBySearch as response even if request parameters of order and search are absent', async () => {
    getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
    filterQuestionsBySearchSpy.mockReturnValueOnce(MOCK_QUESTIONS);
    // Making the request
    const response = await supertest(app).get('/question/getQuestion');

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(EXPECTED_QUESTIONS);
  });

  it('should return the result of filterQuestionsBySearch as response for an order and search criteria in the request parameters', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'dummyOrder',
      search: 'dummySearch',
    };
    getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
    filterQuestionsBySearchSpy.mockReturnValueOnce(MOCK_QUESTIONS);
    // Making the request
    const response = await supertest(app).get('/question/getQuestion').query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(EXPECTED_QUESTIONS);
  });

  it('should return error if getQuestionsByOrder throws an error', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'dummyOrder',
      search: 'dummySearch',
    };
    getQuestionsByOrderSpy.mockRejectedValueOnce(new Error('Error fetching questions'));
    // Making the request
    const response = await supertest(app).get('/question/getQuestion').query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return error if filterQuestionsBySearch throws an error', async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: 'dummyOrder',
      search: 'dummySearch',
    };
    getQuestionsByOrderSpy.mockResolvedValueOnce(MOCK_QUESTIONS);
    filterQuestionsBySearchSpy.mockRejectedValueOnce(new Error('Error filtering questions'));
    // Making the request
    const response = await supertest(app).get('/question/getQuestion').query(mockReqQuery);

    // Asserting the response
    expect(response.status).toBe(500);
  });
});
