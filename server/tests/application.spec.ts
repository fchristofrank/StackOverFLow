import { ObjectId } from 'mongodb';
import Tags from '../models/tags';
import Questions from '../models/questions';
import {
  addTag,
  getQuestionsByOrder,
  filterQuestionsByAskedBy,
  filterQuestionsBySearch,
  fetchAndIncrementQuestionViewsById,
  saveQuestion,
  getTags,
  saveAnswer,
  addAnswerToQuestion,
  getTagCountMap,
  addDownvoteToQuestion,
  addUpvoteToQuestion,
} from '../models/application';
import { Answer, Question, Tag } from '../types';

// eslint-disable-next-line
const mockingoose = require('mockingoose');

const tag1: Tag = {
  _id: new ObjectId('507f191e810c19729de860ea'),
  name: 'react',
};

const tag2: Tag = {
  _id: new ObjectId('65e9a5c2b26199dbcc3e6dc8'),
  name: 'javascript',
};

const tag3: Tag = {
  _id: new ObjectId('65e9b4b1766fca9451cba653'),
  name: 'android',
};

const ans1: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
  text: 'ans1',
  ans_by: 'ans_by1',
  ans_date_time: new Date('2023-11-18T09:24:00'),
};

const ans2: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6dd'),
  text: 'ans2',
  ans_by: 'ans_by2',
  ans_date_time: new Date('2023-11-20T09:24:00'),
};

const ans3: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6de'),
  text: 'ans3',
  ans_by: 'ans_by3',
  ans_date_time: new Date('2023-11-19T09:24:00'),
};

const ans4: Answer = {
  _id: new ObjectId('65e9b58910afe6e94fc6e6df'),
  text: 'ans4',
  ans_by: 'ans_by4',
  ans_date_time: new Date('2023-11-19T09:24:00'),
};

const QUESTIONS: Question[] = [
  {
    _id: new ObjectId('65e9b58910afe6e94fc6e6dc'),
    title: 'Quick question about storage on android',
    text: 'I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains',
    tags: [tag3, tag2],
    answers: [ans1, ans2],
    asked_by: 'q_by1',
    ask_date_time: new Date('2023-11-16T09:24:00'),
    views: 48,
  },
  {
    _id: new ObjectId('65e9b5a995b6c7045a30d823'),
    title: 'Object storage for a web application',
    text: 'I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.',
    tags: [tag1, tag2],
    answers: [ans1, ans2, ans3],
    asked_by: 'q_by2',
    ask_date_time: new Date('2023-11-17T09:24:00'),
    views: 34,
  },
  {
    _id: new ObjectId('65e9b9b44c052f0a08ecade0'),
    title: 'Is there a language to write programmes by pictures?',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    asked_by: 'q_by3',
    ask_date_time: new Date('2023-11-19T09:24:00'),
    views: 12,
  },
  {
    _id: new ObjectId('65e9b716ff0e892116b2de09'),
    title: 'Unanswered Question #2',
    text: 'Does something like that exist?',
    tags: [],
    answers: [],
    asked_by: 'q_by4',
    ask_date_time: new Date('2023-11-20T09:24:00'),
    views: 233,
  },
];

describe('application module', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  // addTag
  test('addTag return tag if the tag already exists', async () => {
    mockingoose(Tags).toReturn(tag1, 'findOne');

    const result = await addTag({ name: tag1.name });

    expect(result?._id).toEqual(tag1._id);
  });

  test('addTag return tag id of new tag if does not exist in database', async () => {
    mockingoose(Tags).toReturn(null, 'findOne');

    const result = await addTag({ name: tag2.name });

    expect(result).toBeDefined();
  });

  test('addTag returns null if findOne throws an error', async () => {
    mockingoose(Tags).toReturn(new Error('error'), 'findOne');

    const result = await addTag({ name: tag1.name });

    expect(result).toBeNull();
  });

  test('addTag returns null if save throws an error', async () => {
    mockingoose(Tags).toReturn(null, 'findOne');
    mockingoose(Tags).toReturn(new Error('error'), 'save');

    const result = await addTag({ name: tag2.name });

    expect(result).toBeNull();
  });

  // filterQuestionsBySearch
  test('filter questions with empty search string should return all questions', () => {
    const result = filterQuestionsBySearch(QUESTIONS, '');

    expect(result.length).toEqual(QUESTIONS.length);
  });

  test('filter questions with empty list of questions should return empty list', () => {
    const result = filterQuestionsBySearch([], 'react');

    expect(result.length).toEqual(0);
  });

  test('filter questions with empty questions and empty string should return empty list', () => {
    const result = filterQuestionsBySearch([], '');

    expect(result.length).toEqual(0);
  });

  test('filter question by one tag', () => {
    const result = filterQuestionsBySearch(QUESTIONS, '[android]');

    expect(result.length).toEqual(1);
    expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
  });

  test('filter question by multiple tags', () => {
    const result = filterQuestionsBySearch(QUESTIONS, '[android] [react]');

    expect(result.length).toEqual(2);
    expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
    expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
  });

  test('filter question by one user', () => {
    const result = filterQuestionsByAskedBy(QUESTIONS, 'q_by4');

    expect(result.length).toEqual(1);
    expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
  });

  test('filter question by tag and then by user', () => {
    let result = filterQuestionsBySearch(QUESTIONS, '[javascript]');
    result = filterQuestionsByAskedBy(result, 'q_by2');

    expect(result.length).toEqual(1);
    expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
  });

  test('filter question by one keyword', () => {
    const result = filterQuestionsBySearch(QUESTIONS, 'website');

    expect(result.length).toEqual(1);
    expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
  });

  test('filter question by tag and keyword', () => {
    const result = filterQuestionsBySearch(QUESTIONS, 'website [android]');

    expect(result.length).toEqual(2);
    expect(result[0]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
    expect(result[1]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
  });

  // getQuestionsByOrder
  test('get active questions, newest questions sorted by most recently answered 1', async () => {
    mockingoose(Questions).toReturn(QUESTIONS.slice(0, 3), 'find');
    Questions.schema.path('answers', Object);
    Questions.schema.path('tags', Object);

    const result = await getQuestionsByOrder('active');

    expect(result.length).toEqual(3);
    expect(result[0]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
    expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
    expect(result[2]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
  });

  test('get active questions, newest questions sorted by most recently answered 2', async () => {
    const allQuestions = [
      {
        _id: '65e9b716ff0e892116b2de01',
        answers: [ans1, ans3], // 18, 19 => 19
        ask_date_time: new Date('2023-11-20T09:24:00'),
      },
      {
        _id: '65e9b716ff0e892116b2de02',
        answers: [ans1, ans2, ans3, ans4], // 18, 20, 19, 19 => 20
        ask_date_time: new Date('2023-11-20T09:24:00'),
      },
      {
        _id: '65e9b716ff0e892116b2de03',
        answers: [ans1], // 18 => 18
        ask_date_time: new Date('2023-11-19T09:24:00'),
      },
      {
        _id: '65e9b716ff0e892116b2de04',
        answers: [ans4], // 19 => 19
        ask_date_time: new Date('2023-11-21T09:24:00'),
      },
      {
        _id: '65e9b716ff0e892116b2de05',
        answers: [],
        ask_date_time: new Date('2023-11-19T10:24:00'),
      },
    ];
    mockingoose(Questions).toReturn(allQuestions, 'find');
    Questions.schema.path('answers', Object);
    Questions.schema.path('tags', Object);

    const result = await getQuestionsByOrder('active');

    expect(result.length).toEqual(5);
    expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de02');
    expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
    expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
    expect(result[3]._id?.toString()).toEqual('65e9b716ff0e892116b2de03');
    expect(result[4]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
  });

  test('get newest unanswered questions', async () => {
    mockingoose(Questions).toReturn(QUESTIONS, 'find');

    const result = await getQuestionsByOrder('unanswered');

    expect(result.length).toEqual(2);
    expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
    expect(result[1]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
  });

  test('get newest questions', async () => {
    const allQuestions = [
      {
        _id: '65e9b716ff0e892116b2de01',
        ask_date_time: new Date('2023-11-20T09:24:00'),
      },
      {
        _id: '65e9b716ff0e892116b2de04',
        ask_date_time: new Date('2023-11-21T09:24:00'),
      },
      {
        _id: '65e9b716ff0e892116b2de05',
        ask_date_time: new Date('2023-11-19T10:24:00'),
      },
    ];
    mockingoose(Questions).toReturn(allQuestions, 'find');

    const result = await getQuestionsByOrder('newest');

    expect(result.length).toEqual(3);
    expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de04');
    expect(result[1]._id?.toString()).toEqual('65e9b716ff0e892116b2de01');
    expect(result[2]._id?.toString()).toEqual('65e9b716ff0e892116b2de05');
  });

  /**
   * Test the feature to sort questions based on most views
   */
  test('get newest most viewed questions', async () => {
    mockingoose(Questions).toReturn(QUESTIONS, 'find');

    const result = await getQuestionsByOrder('mostViewed');

    expect(result.length).toEqual(4);
    expect(result[0]._id?.toString()).toEqual('65e9b716ff0e892116b2de09');
    expect(result[1]._id?.toString()).toEqual('65e9b58910afe6e94fc6e6dc');
    expect(result[2]._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
    expect(result[3]._id?.toString()).toEqual('65e9b9b44c052f0a08ecade0');
  });

  test('getQuestionsByOrder should return empty list if find throws an error', async () => {
    mockingoose(Questions).toReturn(new Error('error'), 'find');

    const result = await getQuestionsByOrder('newest');

    expect(result.length).toEqual(0);
  });

  test('getQuestionsByOrder should return empty list if find returns null', async () => {
    mockingoose(Questions).toReturn(null, 'find');

    const result = await getQuestionsByOrder('newest');

    expect(result.length).toEqual(0);
  });

  test('fetchAndIncrementQuestionViewsById should return question and increment views by 1 if id exists', async () => {
    const question = QUESTIONS.filter(
      q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
    )[0];
    question.views += 1;
    mockingoose(Questions).toReturn(question, 'findOneAndUpdate');
    Questions.schema.path('answers', Object);

    const result = (await fetchAndIncrementQuestionViewsById(
      '65e9b716ff0e892116b2de01',
    )) as Question;

    expect(result.views).toEqual(35);
    expect(result._id?.toString()).toEqual('65e9b5a995b6c7045a30d823');
    expect(result.title).toEqual(question.title);
    expect(result.text).toEqual(question.text);
    expect(result.answers).toEqual(question.answers);
    expect(result.ask_date_time).toEqual(question.ask_date_time);
  });

  test('fetchAndIncrementQuestionViewsById should return null if id does not exist', async () => {
    mockingoose(Questions).toReturn(null, 'findOneAndUpdate');

    const result = await fetchAndIncrementQuestionViewsById('65e9b716ff0e892116b2de01');

    expect(result).toBeNull();
  });

  test('fetchAndIncrementQuestionViewsById should return an object with error if findOneAndUpdate throws an error', async () => {
    mockingoose(Questions).toReturn(new Error('error'), 'findOneAndUpdate');

    const result = (await fetchAndIncrementQuestionViewsById('65e9b716ff0e892116b2de01')) as {
      error: string;
    };

    expect(result.error).toEqual('Error when fetching and updating a question');
  });

  test('getTags should return the tags of tag names in the collection', async () => {
    mockingoose(Tags).toReturn(tag1, 'findOne');

    const result = await getTags([tag1, tag2]);

    expect(result.length).toEqual(2);
    expect(result[0]._id).toEqual(tag1._id);
    expect(result[1]._id).toEqual(tag1._id);
  });

  test('getTags should return a list of new tags ids if they do not exist in the collection', async () => {
    mockingoose(Tags).toReturn(null, 'findOne');

    const result = await getTags([tag1, tag2]);

    expect(result.length).toEqual(2);
  });

  test('getTags should return empty list if an error is thrown when finding tags', async () => {
    mockingoose(Tags).toReturn(Error('Dummy error'), 'findOne');

    const result = await getTags([tag1, tag2]);

    expect(result.length).toEqual(0);
  });

  test('getTags should return empty list if an error is thrown when saving tags', async () => {
    mockingoose(Tags).toReturn(null, 'findOne');
    mockingoose(Tags).toReturn(Error('Dummy error'), 'save');

    const result = await getTags([tag1, tag2]);

    expect(result.length).toEqual(0);
  });

  test('saveQuestion should return the saved question', async () => {
    const mockQn = {
      title: 'New Question Title',
      text: 'New Question Text',
      tags: [tag1, tag2],
      asked_by: 'question3_user',
      ask_date_time: new Date('2024-06-06'),
      answers: [],
      views: 0,
    };

    const result = (await saveQuestion(mockQn)) as Question;

    expect(result._id).toBeDefined();
    expect(result.title).toEqual(mockQn.title);
    expect(result.text).toEqual(mockQn.text);
    expect(result.tags[0]._id?.toString()).toEqual(tag1._id?.toString());
    expect(result.tags[1]._id?.toString()).toEqual(tag2._id?.toString());
    expect(result.asked_by).toEqual(mockQn.asked_by);
    expect(result.ask_date_time).toEqual(mockQn.ask_date_time);
    expect(result.views).toEqual(0);
    expect(result.answers.length).toEqual(0);
  });

  test('saveAnswer should return the saved answer', async () => {
    const mockAnswer = {
      text: 'This is a test answer',
      ans_by: 'dummyUserId',
      ans_date_time: new Date('2024-06-06'),
    };

    const result = (await saveAnswer(mockAnswer)) as Answer;

    expect(result._id).toBeDefined();
    expect(result.text).toEqual(mockAnswer.text);
    expect(result.ans_by).toEqual(mockAnswer.ans_by);
    expect(result.ans_date_time).toEqual(mockAnswer.ans_date_time);
  });

  test('addAnswerToQuestion should return the updated question', async () => {
    const question = QUESTIONS.filter(
      q => q._id && q._id.toString() === '65e9b5a995b6c7045a30d823',
    )[0];
    question.answers.push(ans4);
    mockingoose(Questions).toReturn(question, 'findOneAndUpdate');

    const result = (await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1)) as Question;

    expect(result.answers.length).toEqual(4);
    expect(result.answers).toContain(ans4);
  });

  test('addAnswerToQuestion should return an object with error if findOneAndUpdate throws an error', async () => {
    mockingoose(Questions).toReturn(new Error('error'), 'findOneAndUpdate');

    const result = await addAnswerToQuestion('65e9b5a995b6c7045a30d823', ans1);

    if (result && 'error' in result) {
      expect(true).toBeTruthy();
    } else {
      expect(false).toBeTruthy();
    }
  });

  test('addAnswerToQuestion should throw an error if a required field is missing in the answer', async () => {
    const invalidAnswer: Partial<Answer> = {
      text: 'This is an answer text',
      ans_by: 'user123', // Missing ans_date_time
    };

    const qid = 'validQuestionId';

    try {
      await addAnswerToQuestion(qid, invalidAnswer as Answer);
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(Error);
      if (err instanceof Error) expect(err.message).toBe('Invalid answer');
    }
  });

  test('addUpvoteToQuestion should upvote a question', async () => {
    const mockQuestion = {
      _id: 'someQuestionId',
      up_votes: [],
      down_votes: [],
    };

    mockingoose(Questions).toReturn(
      { ...mockQuestion, up_votes: ['testUser'], down_votes: [] },
      'findOneAndUpdate',
    );

    const result = await addUpvoteToQuestion('someQuestionId', 'testUser');

    expect(result).toEqual({
      msg: 'Question upvoted successfully',
      up_votes: ['testUser'],
      down_votes: [],
    });
  });

  test('addUpvoteToQuestion should return an error when there is an issue with adding an upvote', async () => {
    mockingoose(Questions).toReturn(new Error('Database error'), 'findOneAndUpdate');

    const result = await addUpvoteToQuestion('someQuestionId', 'testUser');

    expect(result).toEqual({ error: 'Error when adding upvote to question' });
  });

  test('addDownvoteToQuestion should downvote a question', async () => {
    const mockQuestion = {
      _id: 'someQuestionId',
      up_votes: [],
      down_votes: [],
    };

    mockingoose(Questions).toReturn(
      { ...mockQuestion, up_votes: [], down_votes: ['testUser'] },
      'findOneAndUpdate',
    );

    const result = await addDownvoteToQuestion('someQuestionId', 'testUser');

    expect(result).toEqual({
      msg: 'Question downvoted successfully',
      up_votes: [],
      down_votes: ['testUser'],
    });
  });

  test('addDownvoteToQuestion should return an error when there is an issue with adding a downvote', async () => {
    mockingoose(Questions).toReturn(new Error('Database error'), 'findOneAndUpdate');

    const result = await addDownvoteToQuestion('someQuestionId', 'testUser');

    expect(result).toEqual({ error: 'Error when adding downvote to question' });
  });

  test('getTagCountMap should return a map of tag names and their counts', async () => {
    mockingoose(Tags).toReturn([tag1, tag2, tag3], 'find');
    mockingoose(Questions).toReturn(QUESTIONS, 'find');
    Questions.schema.path('tags', Object);

    const result = (await getTagCountMap()) as Map<string, number>;

    expect(result.size).toEqual(3);
    expect(result.get('react')).toEqual(1);
    expect(result.get('javascript')).toEqual(2);
    expect(result.get('android')).toEqual(1);
  });

  test('getTagCountMap should return an object with error if an error is thrown', async () => {
    mockingoose(Questions).toReturn(new Error('error'), 'find');

    const result = await getTagCountMap();

    if (result && 'error' in result) {
      expect(true).toBeTruthy();
    } else {
      expect(false).toBeTruthy();
    }
  });

  test('getTagCountMap should return an object with error if an error is thrown when finding tags', async () => {
    mockingoose(Questions).toReturn(QUESTIONS, 'find');
    mockingoose(Tags).toReturn(new Error('error'), 'find');

    const result = await getTagCountMap();

    if (result && 'error' in result) {
      expect(true).toBeTruthy();
    } else {
      expect(false).toBeTruthy();
    }
  });

  test('getTagCountMap should return null if Tags find returns null', async () => {
    mockingoose(Questions).toReturn(QUESTIONS, 'find');
    mockingoose(Tags).toReturn(null, 'find');

    const result = await getTagCountMap();

    expect(result).toBeNull();
  });

  test('getTagCountMap should return default map if Questions find returns null but not tag find', async () => {
    mockingoose(Questions).toReturn(null, 'find');
    mockingoose(Tags).toReturn([tag1], 'find');

    const result = (await getTagCountMap()) as Map<string, number>;

    expect(result.get('react')).toBe(0);
  });

  test('getTagCountMap should return null if find returns []', async () => {
    mockingoose(Questions).toReturn([], 'find');
    mockingoose(Tags).toReturn([], 'find');

    const result = await getTagCountMap();

    expect(result).toBeNull();
  });
});
