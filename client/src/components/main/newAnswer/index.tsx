import './index.css';
import React, { useState } from 'react';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import Textarea from '../baseComponents/textarea';
import { validateHyperlink } from '../../../tool';
import addAnswer from '../../../services/answerService';

/**
 * Interface representing the props for the NewAnswer component.
 *
 * - qid - The unique identifier of the question that the answer is associated with.
 * - handleAnswer - A function that handles the submitted answer.
 *                - It takes the question ID as a parameter and performs the required action
 */
interface NewAnswerProps {
  qid: string;
  handleAnswer: (qid: string) => void;
}

/**
 * NewAnswer component allows users to submit an answer to a specific question.
 *
 * @param qid - The unique identifier of the question being answered.
 * @param handleAnswer - Function to handle the submission.
 */
const NewAnswer = ({ qid, handleAnswer }: NewAnswerProps) => {
  const [usrn, setUsrn] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [usrnErr, setUsrnErr] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');

  const postAnswer = async () => {
    let isValid = true;

    if (!usrn) {
      setUsrnErr('Username cannot be empty');
      isValid = false;
    }

    if (!text) {
      setTextErr('Answer text cannot be empty');
      isValid = false;
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr('Invalid hyperlink format.');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const answer: {
      text: string;
      ans_by: string;
      ans_date_time: Date;
    } = {
      text,
      ans_by: usrn,
      ans_date_time: new Date(),
    };

    const res = await addAnswer(qid, answer);
    if (res && res._id) {
      handleAnswer(qid);
    }
  };

  return (
    <Form>
      <Input
        title={'Username'}
        id={'answerUsernameInput'}
        val={usrn}
        setState={setUsrn}
        err={usrnErr}
      />
      <Textarea
        title={'Answer Text'}
        id={'answerTextInput'}
        val={text}
        setState={setText}
        err={textErr}
      />
      <div className='btn_indicator_container'>
        <button
          className='form_postBtn'
          onClick={() => {
            postAnswer();
          }}
        >
          Post Answer
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewAnswer;
