import React, { useEffect, useState } from 'react';
import './index.css';
import QuestionHeader from './header';
import Question from './question';
import { getQuestionsByFilter } from '../../../services/questionService';

/**
 * Interface representing the props for the QuestionPage component.
 *
 * title_text - Optional title text to display at the top of the question page.
 * order - Text specifies the order in which questions should be displayed.
 * search - The search term to filter questions.
 * setQuestionOrder - A function to set the order of questions based on the input order.
 * clickTag - A function that handles clicking on a tag.
 * handleAnswer - A function that handles actions of asnwering the question based on the input question id.
 * handleNewQuestion - A function that handles the action of creating a new question.
 */
export interface QuestionPageProps {
  title_text?: string;
  order: string;
  search: string;
  setQuestionOrder: (order: string) => void;
  clickTag: (tagName: string) => void;
  handleAnswer: (id: string) => void;
  handleNewQuestion: () => void;
}

/**
 * Interface representing the structure of question data used within the QuestionPage component.
 *
 * _id - Unique identifier of the question.
 * answers - An array of answers associated with the question.
 * views - The number of views the question has received.
 * title - The title of the question.
 * tags - An array of tags associated with the question, each tag has a name and description.
 * asked_by - The username of the person who asked the question.
 * ask_date_time - The date and time when the question was asked.
 */
interface QuestionData {
  _id: string;
  answers: any[];
  views: number;
  title: string;
  tags: { name: string; description: string }[];
  asked_by: string;
  ask_date_time: string;
}

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 *
 * @param title_text - Title text for the page. Defaults to 'All Questions'.
 * @param order - Text specifies the ordering of questions.
 * @param search - Search term used to filter questions.
 * @param setQuestionOrder - Function to set the order of questions based on the order text.
 * @param clickTag - Function to handle clicks on tags.
 * @param handleAnswer - Function that handles actions of asnwering the question
 * @param handleNewQuestion - Function to handle the action of asking a new question.
 */
const QuestionPage = ({
  title_text = 'All Questions',
  order,
  search,
  setQuestionOrder,
  clickTag,
  handleAnswer,
  handleNewQuestion,
}: QuestionPageProps) => {
  const [qlist, setQlist] = useState<QuestionData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getQuestionsByFilter(order, search);
      setQlist(res || []);
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [order, search]);

  return (
    <>
      <QuestionHeader
        title_text={title_text}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
      />
      <div id='question_list' className='question_list'>
        {qlist.map((q, idx) => (
          <Question q={q} key={idx} clickTag={clickTag} handleAnswer={handleAnswer} />
        ))}
      </div>
      {title_text === 'Search Results' && !qlist.length && (
        <div className='bold_title right_padding'>No Questions Found</div>
      )}
    </>
  );
};

export default QuestionPage;
