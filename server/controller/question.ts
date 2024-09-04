import express, { Response } from 'express';
import mongoose from 'mongoose';
import {
  Question,
  FindQuestionRequest,
  FindQuestionByIdRequest,
  AddQuestionRequest,
} from '../types';
import {
  fetchAndIncrementQuestionViewsById,
  filterQuestionsBySearch,
  getQuestionsByOrder,
  getTags,
  saveQuestion,
} from '../models/application';

const router = express.Router();
// eslint-disable-next-line @typescript-eslint/naming-convention
const { ObjectId } = mongoose.Types;

/**
 * Retrieves a list of questions filtered by a search term and ordered by a specified criterion.
 * If there is an error, the HTTP response's status is updated.
 *
 * @param req The FindQuestionRequest object containing the query parameters `order` and `search`.
 * @param res The HTTP response object used to send back the filtered list of questions.
 * @returns A Promise that resolves to void.
 */
const getQuestionsByFilter = async (req: FindQuestionRequest, res: Response): Promise<void> => {
  const { order } = req.query;
  const { search } = req.query;

  try {
    const qlist: Question[] = await getQuestionsByOrder(order);
    const resqlist: Question[] = await filterQuestionsBySearch(qlist, search);
    res.json(resqlist);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(`Error when fetching questions by filter: ${err.message}`);
    } else {
      res.status(500).send(`Error when fetching questions by filter`);
    }
  }
};

/**
 * Retrieves a question by its unique ID, and increments the view count for that question.
 * If there is an error, the HTTP response's status is updated.
 *
 * @param req The FindQuestionByIdRequest object containing the question ID as a parameter.
 * @param res The HTTP response object used to send back the question details.
 * @returns A Promise that resolves to void.
 */
const getQuestionById = async (req: FindQuestionByIdRequest, res: Response): Promise<void> => {
  const { qid } = req.params;
  if (!ObjectId.isValid(qid)) {
    res.status(400).send('Invalid ID format');
    return;
  }
  try {
    const q = await fetchAndIncrementQuestionViewsById(qid);
    if (q && !('error' in q)) {
      res.json(q);
      return;
    }
    throw new Error('Error while fetching question by id');
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(`Error when fetching question by id: ${err.message}`);
    } else {
      res.status(500).send(`Error when fetching question by id`);
    }
  }
};

/**
 * Validates the question object to ensure it contains all the necessary fields.
 *
 * @param question The question object to validate.
 * @returns `true` if the question is valid, otherwise `false`.
 */
const isQuestionBodyValid = (question: Question): boolean =>
  question.title !== undefined &&
  question.title !== '' &&
  question.text !== undefined &&
  question.text !== '' &&
  question.tags !== undefined &&
  question.tags.length > 0 &&
  question.asked_by !== undefined &&
  question.asked_by !== '' &&
  question.ask_date_time !== undefined &&
  question.ask_date_time !== null;

/**
 * Adds a new question to the database. The question is first validated and then saved.
 * If the tags are invalid or saving the question fails, the HTTP response status is updated.
 *
 * @param req The AddQuestionRequest object containing the question data.
 * @param res The HTTP response object used to send back the result of the operation.
 * @returns A Promise that resolves to void.
 */
const addQuestion = async (req: AddQuestionRequest, res: Response): Promise<void> => {
  if (!isQuestionBodyValid(req.body)) {
    res.status(400).send('Invalid question body');
    return;
  }
  const question: Question = req.body;
  try {
    question.tags = await getTags(question.tags);
    if (question.tags.length === 0) {
      throw new Error('Invalid tags');
    }
    const result = await saveQuestion(question);
    if ('error' in result) {
      throw new Error(result.error);
    }
    res.json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(`Error when saving question: ${err.message}`);
    } else {
      res.status(500).send(`Error when saving question`);
    }
  }
};

// add appropriate HTTP verbs and their endpoints to the router
router.get('/getQuestion', getQuestionsByFilter);
router.get('/getQuestionById/:qid', getQuestionById);
router.post('/addQuestion', addQuestion);

export default router;
