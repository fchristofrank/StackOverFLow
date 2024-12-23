/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectId } from 'mongodb';
import { Answer, AnswerResponse, OrderType, Question, QuestionResponse, Tag } from '../types';
import AnswerModel from './answers';
import QuestionModel from './questions';
import TagModel from './tags';
import { error } from 'console';

/**
 * Parses tags from a search string.
 *
 * @param {string} search - Search string containing tags in square brackets (e.g., "[tag1][tag2]")
 * @returns {string[]} - An array of tags found in the search string
 */
export const parseTags = (search: string): string[] =>
  (search.match(/\[([^\]]+)\]/g) || []).map(word => word.slice(1, -1));

/**
 * Parses keywords from a search string by removing tags and extracting individual words.
 *
 * @param {string} search - The search string containing keywords and possibly tags
 * @returns {string[]} - An array of keywords found in the search string
 */
export const parseKeyword = (search: string): string[] =>
  search.replace(/\[([^\]]+)\]/g, ' ').match(/\b\w+\b/g) || [];

/**
 * Checks if given question contains any tags from the given list.
 *
 * @param {Question} q - The question to check
 * @param {string[]} taglist - The list of tags to check for
 * @returns {boolean} - `true` if any tag is present in the question, `false` otherwise
 */
export const checkTagInQuestion = (q: Question, taglist: string[]): boolean => {
  for (const tagname of taglist) {
    for (const tag of q.tags) {
      if (tagname === tag.name) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Checks if any keywords in the provided list exist in a given question's title or text.
 *
 * @param {Question} q - The question to check
 * @param {string[]} keywordlist - The list of keywords to check for
 * @returns {boolean} - `true` if any keyword is present, `false` otherwise.
 */
export const checkKeywordInQuestion = (q: Question, keywordlist: string[]): boolean => {
  for (const w of keywordlist) {
    if (q.title.includes(w) || q.text.includes(w)) {
      return true;
    }
  }

  return false;
};

/**
 * Gets the newest questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to sort
 * @returns {Question[]} - The sorted list of questions
 */
export const sortQuestionsByNewest = (qlist: Question[]): Question[] =>
  qlist.sort((a, b) => {
    if (a.ask_date_time > b.ask_date_time) {
      return -1;
    }

    if (a.ask_date_time < b.ask_date_time) {
      return 1;
    }

    return 0;
  });

/**
 * Gets unanswered questions from a list, sorted by the asking date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 * @returns {Question[]} - The filtered and sorted list of unanswered questions
 */
export const sortQuestionsByUnanswered = (qlist: Question[]): Question[] =>
  sortQuestionsByNewest(qlist).filter(q => q.answers.length === 0);

/**
 * Records the most recent answer time for a question.
 *
 * @param {Question} q - The question to check
 * @param {Map<string, Date>} mp - A map of the most recent answer time for each question
 */
export const getMostRecentAnswerTime = (q: Question, mp: Map<string, Date>): void => {
  q.answers.forEach((a: Answer) => {
    if (q._id !== undefined) {
      const currentMostRecent = mp.get(q?._id.toString());
      if (!currentMostRecent || currentMostRecent < a.ans_date_time) {
        mp.set(q._id.toString(), a.ans_date_time);
      }
    }
  });
};

/**
 * Gets active questions from a list, sorted by the most recent answer date in descending order.
 *
 * @param {Question[]} qlist - The list of questions to filter and sort
 * @returns {Question[]} - The filtered and sorted list of active questions
 */
export const sortQuestionsByActive = (qlist: Question[]): Question[] => {
  const mp = new Map();
  qlist.forEach(q => {
    getMostRecentAnswerTime(q, mp);
  });

  return sortQuestionsByNewest(qlist).sort((a, b) => {
    const adate = mp.get(a._id?.toString());
    const bdate = mp.get(b._id?.toString());
    if (!adate) {
      return 1;
    }
    if (!bdate) {
      return -1;
    }
    if (adate > bdate) {
      return -1;
    }
    if (adate < bdate) {
      return 1;
    }
    return 0;
  });
};

export const sortQuestionsByMostViewed = (qlist: Question[]): Question[] => {
  return [...qlist].sort((a, b) => b.views - a.views);
};

/**
 * Adds a tag to the database if it does not already exist.
 *
 * @param {Tag} tag - The tag to add
 * @returns {Promise<Tag | null>} - The added or existing tag, or `null` if an error occurred
 */
export const addTag = async (tag: Tag): Promise<Tag | null> => {
  try {
    // Check if a tag with the given name already exists
    const existingTag = await TagModel.findOne({ name: tag.name });

    if (existingTag) {
      return existingTag as Tag;
    }

    // If the tag does not exist, create a new one
    const newTag = new TagModel(tag);
    const savedTag = await newTag.save();

    if (existingTag == null) {
      return new Error('No Element Found');
    }

    return savedTag as Tag;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves questions from the database, ordered by the specified criteria.
 *
 * @param {OrderType} order - The order type to filter the questions
 * @returns {Promise<Question[]>} - Promise that resolves to a list of ordered questions
 */
export const getQuestionsByOrder = async (order: OrderType): Promise<Question[]> => {
  try {
    let qlist = [];

    if (order === 'active') {
      qlist = await QuestionModel.find().populate([
        { path: 'tags', model: TagModel },
        { path: 'answers', model: AnswerModel },
      ]);
      return sortQuestionsByActive(qlist);
    }

    qlist = await QuestionModel.find().populate([{ path: 'tags', model: TagModel }]);

    if (order === 'unanswered') {
      return sortQuestionsByUnanswered(qlist);
    }

    if (order === 'mostViewed') {
      return sortQuestionsByMostViewed(qlist);
    }

    return sortQuestionsByNewest(qlist);
  } catch (error) {
    return [];
  }
};

/**
 * Implement the below function to filter questions based on 'asked_by' attribute.
 */
export const filterQuestionsByAskedBy = (qlist: Question[], asked_by: string): Question[] => {
 
  const result: Question[] = [];

  for (const question of qlist) {
    if (question.asked_by === asked_by) {
      result.push(question);
    }
  }

  return result;
};
/**
 * Filters questions based on a search string containing tags and/or keywords.
 *
 * @param {Question[]} qlist - The list of questions to filter
 * @param {string} search - The search string containing tags and/or keywords
 * @returns {Question[]} - The filtered list of questions matching the search criteria
 */
export const filterQuestionsBySearch = (qlist: Question[], search: string): Question[] => {
  const searchTags = parseTags(search);
  const searchKeyword = parseKeyword(search);

  if (!qlist || qlist.length === 0) {
    return [];
  }
  return qlist.filter((q: Question) => {
    if (searchKeyword.length === 0 && searchTags.length === 0) {
      return true;
    }

    if (searchKeyword.length === 0) {
      return checkTagInQuestion(q, searchTags);
    }

    if (searchTags.length === 0) {
      return checkKeywordInQuestion(q, searchKeyword);
    }

    return checkKeywordInQuestion(q, searchKeyword) || checkTagInQuestion(q, searchTags);
  });
};

/**
 * Fetches a question by its ID and increments its view count.
 *
 * @param {string} qid - The ID of the question to fetch.
 * @returns {Promise<QuestionResponse | null>} - Promise that resolves to the fetched question
 * with incremented views, or error message
 */
export const fetchAndIncrementQuestionViewsById = async (
  qid: string,
): Promise<QuestionResponse | null> => {
  try {
    const q = await QuestionModel.findOneAndUpdate(
      { _id: new ObjectId(qid) },
      { $inc: { views: 1 } },
      { new: true },
    ).populate({ path: 'answers', model: AnswerModel });
    return q;
  } catch (error) {
    return { error: 'Error when fetching and updating a question' };
  }
};

/**
 * Saves a new question to the database.
 *
 * @param {Question} q - The question to save
 * @returns {Promise<QuestionResponse>} - The saved question, or error message
 */
export const saveQuestion = async (q: Question): Promise<QuestionResponse> => {
  try {
    const result = await QuestionModel.create(q);
    return result;
  } catch (error) {
    return { error: 'Error when saving a question' };
  }
};

/**
 * Saves a new answer to the database.
 *
 * @param {Answer} a - The answer to save
 * @returns {Promise<AnswerResponse>} - The saved answer, or an error message if the save failed
 */
export const saveAnswer = async (a: Answer): Promise<AnswerResponse> => {
  try {
    const result = await AnswerModel.create(a);
    return result;
  } catch (error) {
    return { error: 'Error when saving an answer' };
  }
};

/**
 * Gets the list of tags from the database, and adds any new ones to the database.
 *
 * @param {Tag[]} tags - The tags to get
 * @returns {Promise<Tag[]>} - The list of tags, or an empty array if an error occurred
 */
export const getTags = async (tags: Tag[]): Promise<Tag[]> => {
  try {
    // Remove duplicate tags, ensuring that only the first tag object with the same name is used.
    const seenNames = new Set<string>();
    const uniqueTags = tags.filter(tag => {
      if (seenNames.has(tag.name)) {
        return false;
      }
      seenNames.add(tag.name);
      return true;
    });

    // Attempt to add unique tags to the database
    const resultTags = await Promise.all(uniqueTags.map(tag => addTag(tag).catch(() => null)));

    return resultTags.filter((tag): tag is Tag => tag !== null);
  } catch (error) {
    return [];
  }
};

/**
 * Implement the below two functions to handle upvoting and downvoting of questions. These functions will:
 *
 * - Check if the question exists.
 * - Add or remove the user's vote (upvote or downvote) as appropriate.
 * - Update the question’s upvote and downvote counts.
 */

export const addUpvoteToQuestion = async (qid: string, username: string) => {
  try {
    const result = await QuestionModel.findOneAndUpdate(
      { _id: qid, up_votes: { $ne: username } },
      { $push: { up_votes: username } },
      { new: true },
    );

    if (null != result && `error` in result) {
      throw result;
    }

    if (!result) {
      throw new Error('Database error');
    }

    return {
      msg: 'Question upvoted successfully',
      up_votes: result.up_votes,
      down_votes: result.down_votes,
    };
  } catch (error) {
    return { error: 'Error when adding upvote to question' };
  }
};

export const addDownvoteToQuestion = async (qid: string, username: string) => {
  try {
    const result = await QuestionModel.findOneAndUpdate(
      { _id: qid, down_votes: { $ne: username } },
      { $push: { down_votes: username } },
      { new: true },
    );

    if (!result) {
      throw new Error('Database error');
    }

    // Return the formatted response
    return {
      msg: 'Question downvoted successfully',
      up_votes: result.up_votes,
      down_votes: result.down_votes,
    };
  } catch (error) {
    return { error: 'Error when adding downvote to question' };
  }
};

/**
 * Adds an answer to a question.
 *
 * @param {string} qid - The ID of the question to add an answer to
 * @param {Answer} ans - The answer to add
 * @returns {Promise<QuestionResponse | null>} - The updated question, or `null` if an error.
 */
export const addAnswerToQuestion = async (
  qid: string,
  ans: Answer,
): Promise<QuestionResponse | null> => {
  try {
    if (!ans || !ans.text || !ans.ans_by || !ans.ans_date_time) {
      throw new Error('Invalid answer');
    }
    const result = await QuestionModel.findOneAndUpdate(
      { _id: qid },
      { $push: { answers: { $each: [ans._id], $position: 0 } } },
      { new: true },
    );
    return result;
  } catch (error) {
    return { error: 'Error when adding answer to question' };
  }
};

/**
 * Gets a map of tags and their corresponding question counts.
 *
 * @returns {Promise<Map<string, number> | null | { error: string }>} - A map of tags to their
 * counts, `null` if there are no tags in the database, or the error message.
 */
export const getTagCountMap = async (): Promise<Map<string, number> | null | { error: string }> => {
  try {
    const tlist = await TagModel.find();
    const qlist = await QuestionModel.find().populate({
      path: 'tags',
      model: TagModel,
    });

    if (!tlist || tlist.length === 0) {
      return null;
    }

    const tmap = new Map(tlist.map(t => [t.name, 0]));

    if (qlist != null && qlist !== undefined && qlist.length > 0) {
      qlist.forEach(q => {
        q.tags.forEach(t => {
          tmap.set(t.name, (tmap.get(t.name) || 0) + 1);
        });
      });
    }

    return tmap;
  } catch (error) {
    return { error: 'Error when construction tag map' };
  }
};

