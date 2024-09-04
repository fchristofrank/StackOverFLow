import { REACT_APP_API_URL, api } from './config';

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

/**
 * Interface representing a Question object.
 */
interface Question {
  title: string;
  text: string;
  tags: {
    name: string;
    description: string;
  }[];
  asked_by: string;
  ask_date_time: Date;
}

/**
 * Function to get questions by filter.
 *
 * @param order - The order in which to fetch questions. Default is 'newest'.
 * @param search - The search term to filter questions. Default is an empty string.
 * @throws Error if there is an issue fetching or filtering questions.
 */
const getQuestionsByFilter = async (
  order: string = 'newest',
  search: string = '',
): Promise<any> => {
  try {
    const res = await api.get(`${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`);
    if (res.status !== 200) {
      throw new Error('Error when fetching or filtering questions');
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Function to get a question by its ID.
 *
 * @param qid - The ID of the question to retrieve.
 * @throws Error if there is an issue fetching the question by ID.
 */
const getQuestionById = async (qid: string): Promise<any> => {
  try {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);
    if (res.status !== 200) {
      throw new Error('Error when fetching question by id');
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Function to add a new question.
 *
 * @param q - The question object to add.
 * @throws Error if there is an issue creating the new question.
 */
const addQuestion = async (q: Question): Promise<any> => {
  try {
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);
    if (res.status !== 200) {
      throw new Error('Error while creating a new question');
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Function to upvote a question.
 *
 * @param qid - The ID of the question to upvote.
 * @param username - The username of the person upvoting the question.
 * @throws Error if there is an issue upvoting the question.
 */
const upvoteQuestion = async (qid: string, username: string) => {
  const data = { qid, username };
  try {
    const res = await api.post(`${QUESTION_API_URL}/upvoteQuestion`, data);
    if (res.status !== 200) {
      throw new Error('Error while upvoting the question');
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Function to downvote a question.
 *
 * @param qid - The ID of the question to downvote.
 * @param username - The username of the person downvoting the question.
 * @throws Error if there is an issue downvoting the question.
 */
const downvoteQuestion = async (qid: string, username: string) => {
  const data = { qid, username };
  try {
    const res = await api.post(`${QUESTION_API_URL}/downvoteQuestion`, data);
    if (res.status !== 200) {
      throw new Error('Error while downvoting the question');
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

export { getQuestionsByFilter, getQuestionById, addQuestion, upvoteQuestion, downvoteQuestion };
