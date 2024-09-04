import './index.css';
import React from 'react';
import { getMetaData } from '../../../../tool';

/**
 * Interface representing a tag associated with a question.
 *
 * @property name - The name of the tag.
 * @property description - A description of the tag.
 */
interface Tag {
  name: string;
  description: string;
}

/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 * q.id - Unique identifier for the question object q.
 * q.answers - An array of answers associated with the question object q.
 * q.views - The number of views the question object q has received.
 * q.title - The title of the question object q.
 * q.tags - An array of tags associated with the question object q.
 * q.asked_by - The username of the person who asked the question object q.
 * q.ask_date_time - The date and time when the question object q was asked.
 * clickTag - Function to handle clicking on a tag based on the input tagName
 * handleAnswer - Function to handle the actions when the answer is submitted.
 */
interface QuestionProps {
  q: {
    _id: string;
    answers: any[];
    views: number;
    title: string;
    tags: Tag[];
    asked_by: string;
    ask_date_time: string;
  };
  clickTag: (tagName: string) => void;
  handleAnswer: (id: string) => void;
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param q - The question object containing question details.
 * @param clickTag - Function to handle actions when clicking on a tag.
 * @param handleAnswer - Function to handle actions of answering the question.
 */
const Question = ({ q, clickTag, handleAnswer }: QuestionProps) => (
  <div
    className='question right_padding'
    onClick={() => {
      handleAnswer(q._id);
    }}
  >
    <div className='postStats'>
      <div>{q.answers.length || 0} answers</div>
      <div>{q.views} views</div>
    </div>
    <div className='question_mid'>
      <div className='postTitle'>{q.title}</div>
      <div className='question_tags'>
        {q.tags.map((tag, idx) => (
          <button
            key={idx}
            className='question_tag_button'
            onClick={e => {
              e.stopPropagation();
              clickTag(tag.name);
            }}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
    <div className='lastActivity'>
      <div className='question_author'>{q.asked_by}</div>
      <div>&nbsp;</div>
      <div className='question_meta'>asked {getMetaData(new Date(q.ask_date_time))}</div>
    </div>
  </div>
);

export default Question;
