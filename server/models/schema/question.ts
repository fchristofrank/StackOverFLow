import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Question collection.
 *
 * This schema defines the structure for storing questions in the database.
 * Each question includes the following fields:
 * - `title`: The title of the question.
 * - `text`: The detailed content of the question.
 * - `tags`: An array of references to `Tag` documents associated with the question.
 * - `answers`: An array of references to `Answer` documents associated with the question.
 * - `asked_by`: The username of the user who asked the question.
 * - `ask_date_time`: The date and time when the question was asked.
 * - `views`: The number of times the question has been viewed. Defaults to 0.
 */
const questionSchema: Schema = new Schema(
  {
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    asked_by: {
      type: String,
    },
    ask_date_time: {
      type: Date,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { collection: 'Question' },
);

export default questionSchema;
