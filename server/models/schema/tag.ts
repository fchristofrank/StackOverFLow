import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Tag collection.
 *
 * This schema defines the structure for storing tags in the database.
 * Each tag includes the following fields:
 * - `name`: The name of the tag. This field is required.
 */
const tagSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false
    }
  },
  { collection: 'Tag' },
);

export default tagSchema;
