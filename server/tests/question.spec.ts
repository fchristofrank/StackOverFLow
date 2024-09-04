import supertest from 'supertest';
import mongoose from 'mongoose';
import { app, server } from '../server';
import * as util from '../models/application';
import { Question } from '../types';

/**
 * TODO: uncomment the below two lines once 'addUpvoteToQuestion' and
 * 'addDownvoteToQuestion' functions are implemented in 'application.ts' file.
 */
// const addUpvoteToQuestionSpy = jest.spyOn(util, "addUpvoteToQuestion");
// const addDownvoteToQuestionSpy = jest.spyOn(util, "addDownvoteToQuestion");

const tag1 = {
  _id: '507f191e810c19729de860ea',
  name: 'tag1',
};
const tag2 = {
  _id: '65e9a5c2b26199dbcc3e6dc8',
  name: 'tag2',
};

const ans1 = {
  _id: '65e9b58910afe6e94fc6e6dc',
  text: 'Answer 1 Text',
  ans_by: 'answer1_user',
  ans_date_time: '2024-06-09',
};

const ans2 = {
  _id: '65e9b58910afe6e94fc6e6dd',
  text: 'Answer 2 Text',
  ans_by: 'answer2_user',
  ans_date_time: '2024-06-10',
};

const ans3 = {
  _id: '65e9b58910afe6e94fc6e6df',
  text: 'Answer 3 Text',
  ans_by: 'answer3_user',
  ans_date_time: '2024-06-11',
};

const ans4 = {
  _id: '65e9b58910afe6e94fc6e6dg',
  text: 'Answer 4 Text',
  ans_by: 'answer4_user',
  ans_date_time: '2024-06-14',
};

const MOCK_QUESTIONS = [
  {
    _id: '65e9b58910afe6e94fc6e6dc',
    title: 'Question 1 Title',
    text: 'Question 1 Text',
    tags: [tag1],
    answers: [ans1],
    asked_by: 'question1_user',
    ask_date_time: new Date('2024-06-03'),
    views: 10,
  },
  {
    _id: '65e9b5a995b6c7045a30d823',
    title: 'Question 2 Title',
    text: 'Question 2 Text',
    tags: [tag2],
    answers: [ans2, ans3],
    asked_by: 'question2_user',
    ask_date_time: new Date('2024-06-04'),
    views: 20,
  },
  {
    _id: '34e9b58910afe6e94fc6e99f',
    title: 'Question 3 Title',
    text: 'Question 3 Text',
    tags: [tag1, tag2],
    answers: [ans4],
    asked_by: 'question3_user',
    ask_date_time: new Date('2024-06-03'),
    views: 101,
  },
];

describe('POST /upvoteQuestion', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    server.close();
  });

  it('should upvote a question successfully', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
      username: 'new-user',
    };

    const mockResponse = {
      msg: 'Question upvoted successfully',
      up_votes: ['new-user'],
      down_votes: [],
    };

    /**
     * TODO: uncomment the below line once the 'addUpvoteToQuestion' function
     * is implemented in 'application.ts' file to test your logic.
     */
    // addUpvoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

    const response = await supertest(app).post('/question/upvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should return bad request error if the request had qid missing', async () => {
    const mockReqBody = {
      username: 'some-user',
    };

    const response = await supertest(app).post(`/question/upvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request had username missing', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const response = await supertest(app).post(`/question/upvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});

describe('POST /downvoteQuestion', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    server.close();
  });

  it('should downvote a question successfully', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
      username: 'new-user',
    };

    const mockResponse = {
      msg: 'Question upvoted successfully',
      down_votes: ['new-user'],
      up_votes: [],
    };

    /**
     * TODO: uncomment the below line once the 'addDownvoteToQuestion' function
     * is implemented in 'application.ts' file to test your logic.
     */
    // addDownvoteToQuestionSpy.mockResolvedValueOnce(mockResponse);

    const response = await supertest(app).post('/question/downvoteQuestion').send(mockReqBody);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it('should return bad request error if the request had qid missing', async () => {
    const mockReqBody = {
      username: 'some-user',
    };

    const response = await supertest(app).post(`/question/downvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return bad request error if the request had username missing', async () => {
    const mockReqBody = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const response = await supertest(app).post(`/question/downvoteQuestion`).send(mockReqBody);

    expect(response.status).toBe(400);
  });
});

describe('GET /getQuestionById/:qid', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    server.close();
  });

  it('should return a question object in the response when the question id is passed as request parameter', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    const findq = MOCK_QUESTIONS.filter(q => q._id.toString() === mockReqParams.qid)[0];

    const mockPopulatedQuestion = {
      ...findq,
      _id: new mongoose.Types.ObjectId(findq._id),
      views: findq.views + 1,
      tags: [],
      answers: [],
      ask_date_time: findq.ask_date_time,
    };

    // Provide mock question data
    jest
      .spyOn(util, 'fetchAndIncrementQuestionViewsById')
      .mockResolvedValueOnce(mockPopulatedQuestion as Question);

    // Making the request
    const response = await supertest(app).get(`/question/getQuestionById/${mockReqParams.qid}`);

    const expectedResponse = {
      ...mockPopulatedQuestion,
      _id: mockPopulatedQuestion._id.toString(),
      ask_date_time: mockPopulatedQuestion.ask_date_time.toISOString(),
    };
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponse);
  });

  it('should return bad request error if the question id is not found in the database', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    jest.spyOn(util, 'fetchAndIncrementQuestionViewsById').mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(app).get(`/question/getQuestionById/${mockReqParams.qid}`);

    // Asserting the response
    expect(response.status).toBe(500);
  });

  it('should return bad request error if an error occurs when fetching and updating the question', async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: '65e9b5a995b6c7045a30d823',
    };

    jest.spyOn(util, 'fetchAndIncrementQuestionViewsById').mockResolvedValueOnce({
      error: 'Error when fetching and updating a question',
    });

    // Making the request
    const response = await supertest(app).get(`/question/getQuestionById/${mockReqParams.qid}`);

    // Asserting the response
    expect(response.status).toBe(500);
  });
});
