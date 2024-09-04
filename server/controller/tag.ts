import express, { Request, Response, Router } from 'express';
import { getTagCountMap } from '../models/application';

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

// Add appropriate HTTP verbs and their endpoints to the router.
router.get('/getTagsWithQuestionNumber', getTagsWithQuestionNumber);

export default router;
