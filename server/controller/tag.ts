import express, { Request, Response, Router } from 'express'
import { getTagCountMap, getTags } from '../models/application';
import { Tag } from '../types';
import TagModel from '../models/tags';

const router: Router = express.Router();

/**
 * Retrieves a list of tags along with the number of questions associated with each tag.
 * If there is an error, the HTTP response's status is updated.
 *
 * @param _ The HTTP request object (not used in this function).
 * @param res The HTTP response object used to send back the tag count mapping.
 * @returns A Promise that resolves to void.
 */
const getTagsWithQuestionNumber = async (_: Request, res: Response): Promise<void> => {
  try {
    const tagcountmap = await getTagCountMap();
    if (!(tagcountmap instanceof Map)) {
      throw new Error('Error while fetching tag count map');
    } else {
      res.json(
        Array.from(tagcountmap, ([name, qcnt]: [string, number]) => ({
          name,
          qcnt,
        })),
      );
    }
  } catch (err) {
    res.status(500).send(`Error when fetching tag count map: ${(err as Error).message}`);
  }
};

const getTagByName = async (req: Request, res: Response): Promise<void> => {
  const tagName = req.params.tagName;

  if (!tagName) {
    res.status(400).send('Tag name is required');
    return;
  }

  try {
    const tags: Tag[] = [{ name: tagName, description: "" }];
    const result = await getTags(tags);

    if (result[0] instanceof Error) throw result[0];
    if (result[0].name.length > 0) {
      res.status(200).json(result[0]);
      return;
    }

    throw result;
  } catch (error) {
    if ((error as Error).message === "No Element Found") {
      res.status(404).send(`Tag with name "${tagName}" not found`);
      return;
    }

    res.status(500).send(`Error when fetching tag: Error fetching tag`);
  }
};


// Add appropriate HTTP verbs and their endpoints to the router.
router.get('/getTagsWithQuestionNumber', getTagsWithQuestionNumber);
router.get('/getTagByName/:tagName', getTagByName);

export default router;
