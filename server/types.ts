import { Request } from 'express';
import { ObjectId } from 'mongodb';

/**
 * Type representing the possible ordering options for questions.
 */
export type OrderType = 'newest' | 'unanswered' | 'active' | 'mostViewed';

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ans_by - The username of the user who wrote the answer
 * - ans_date_time - The date and time when the answer was created
 */
export interface Answer {
  _id?: ObjectId;
  text: string;
  ans_by: string;
  ans_date_time: Date;
}

/**
 * Interface extending the request body when adding an answer to a question, which contains:
 * - qid - The unique identifier of the question being answered
 * - ans - The answer being added
 */
export interface AnswerRequest extends Request {
  body: {
    qid: string;
    ans: Answer;
  };
}

/**
 * Type representing the possible responses for an Answer-related operation.
 */
export type AnswerResponse = Answer | { error: string };

/**
 * Interface representing a Tag document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - name - Name of the tag
 */
export interface Tag {
  _id?: ObjectId;
  name: string;
}

/**
 * Interface representing a Question document, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - title - The title of the question.
 * - text - The detailed content of the question.
 * - tags - An array of tags associated with the question.
 * - asked_by - The username of the user who asked the question.
 * - ask_date_time - he date and time when the question was asked.
 * - answers - An array of answers for the question.
 * - views - The number of times the question has been viewed.
 *
 */
export interface Question {
  _id?: ObjectId;
  title: string;
  text: string;
  tags: Tag[];
  asked_by: string;
  ask_date_time: Date;
  answers: Answer[];
  views: number;
}

/**
 * Type representing the possible responses for a Question-related operation.
 */
export type QuestionResponse = Question | { error: string };

/**
 * Interface for the request query to find questions using a search string, which contains:
 * - order - The order in which to sort the questions
 * - search - The search string used to find questions
 */
export interface FindQuestionRequest extends Request {
  query: {
    order: OrderType;
    search: string;
  };
}

/**
 * Interface for the request parameters when finding a question by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindQuestionByIdRequest extends Request {
  params: {
    qid: string;
  };
}

/**
 * Interface for the request body when adding a new question.
 */
export interface AddQuestionRequest extends Request {
  body: Question;
}
