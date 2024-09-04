import React, { useEffect, useState } from 'react';
import { getMetaData } from '../../../tool';
import Answer from './answer';
import AnswerHeader from './header';
import './index.css';
import QuestionBody from './questionBody';
import { getQuestionById } from '../../../services/questionService';
import VoteComponent from '../voteComponent';

/**
 * Interface representing the props for the AnswerPage component.
 *
 * - qid - The unique identifier for the question.
 * - handleNewQuestion - Callback function to handle a new question.
 * - handleNewAnswer - Callback function to handle a new answer.
 */
interface AnswerPageProps {
  qid: string;
  handleNewQuestion: () => void;
  handleNewAnswer: () => void;
}

/**
 * Interface representing the structure of a Question object.
 *
 * - _id - The unique identifier for the question.
 * - tags - An array of tags associated with the question, each containing a name and description.
 * - answers - An array of answers to the question
 * - title - The title of the question.
 * - views - The number of views the question has received.
 * - text - The content of the question.
 * - asked_by - The username of the user who asked the question.
 * - ask_date_time - The date and time when the question was asked.
 * - up_votes - An array of usernames who upvoted the question.
 * - down_votes - An array of usernames who downvoted the question.
 */
interface Question {
  _id: string;
  tags: {
    name: string;
    description: string;
  }[];
  answers: {
    text: string;
    ans_by: string;
    ans_date_time: string;
  }[];
  title: string;
  views: number;
  text: string;
  asked_by: string;
  ask_date_time: string;
  up_votes: string[];
  down_votes: string[];
}

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 *
 * @param qid The unique identifier of the question to be displayed.
 * @param handleNewQuestion Callback function to handle asking a new question.
 * @param handleNewAnswer Callback function to handle posting a new answer.
 */
const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer }: AnswerPageProps) => {
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getQuestionById(qid);
        setQuestion(res || null);
      } catch (error) {
        //TODO: Handle error
      }
    };
    fetchData();
  }, [qid]);

  if (!question) {
    return null;
  }

  return (
    <>
      <VoteComponent question={question} username={'default-user'} />
      <AnswerHeader
        ansCount={question.answers.length}
        title={question.title}
        handleNewQuestion={handleNewQuestion}
      />
      <QuestionBody
        views={question.views}
        text={question.text}
        askby={question.asked_by}
        meta={getMetaData(new Date(question.ask_date_time))}
      />
      {question.answers.map((a, idx) => (
        <Answer
          key={idx}
          text={a.text}
          ansBy={a.ans_by}
          meta={getMetaData(new Date(a.ans_date_time))}
        />
      ))}
      <button
        className='bluebtn ansButton'
        onClick={() => {
          handleNewAnswer();
        }}
      >
        Answer Question
      </button>
    </>
  );
};

export default AnswerPage;
