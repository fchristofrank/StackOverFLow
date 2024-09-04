import { REACT_APP_API_URL, api } from './config';

const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

/**
 * Interface represents the data of a answer object.
 *
 * text - The content of the answer.
 * ans_by - The username or identifier of the person who provided the answer.
 * ans_date_time - The date and time when the answer was given
 */
interface Answer {
  text: string;
  ans_by: string;
  ans_date_time: Date;
}

/**
 * Adds a new answer to a specific question.
 *
 * @param qid - The ID of the question to which the answer is being added.
 * @param ans - The answer object containing the answer details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addAnswer = async (qid: string, ans: Answer): Promise<any> => {
  const data = { qid, ans };
  try {
    const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);
    if (res.status !== 200) {
      throw new Error('Error while creating a new answer');
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default addAnswer;
