import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Answer collection.
 *
 * This schema defines the structure for storing answers in the database.
 * Each answer includes the following fields:
 * - `text`: The content of the answer.
 * - `ans_by`: The username of the user who provided the answer.
 * - `ans_date_time`: The date and time when the answer was given.
 */
const answerSchema: Schema = new Schema(
  {
    text: {
      type: String,
    },
    ans_by: {
      type: String,
    },
    ans_date_time: {
      type: Date,
    },
  },
  { collection: 'Answer' },
);

export default answerSchema;
