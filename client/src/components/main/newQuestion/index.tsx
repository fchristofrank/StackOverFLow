import React, { useState } from 'react';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import Textarea from '../baseComponents/textarea';
import './index.css';
import { validateHyperlink } from '../../../tool';
import { addQuestion } from '../../../services/questionService';

/**
 * Interface representing the props for the NewQuestion component.
 *
 * - handleQuestions - A function that handles the actions after a question is submitted.
 *                   - It is used to update the list of questions
 *                     or refresh the state of the component after a new question has been added.
 */
interface NewQuestionProps {
  handleQuestions: () => void;
}

/**
 * NewQuestion component allows users to submit a new question with a title, description, tags, and username.
 *
 * @param handleQuestions - Function to handle the action after a question is successfully submitted.
 */
const NewQuestion = ({ handleQuestions }: NewQuestionProps) => {
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [tagNames, setTagNames] = useState<string>('');
  const [usrn, setUsrn] = useState<string>('');

  const [titleErr, setTitleErr] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');
  const [tagErr, setTagErr] = useState<string>('');
  const [usrnErr, setUsrnErr] = useState<string>('');

  const postQuestion = async () => {
    let isValid = true;

    if (!title) {
      setTitleErr('Title cannot be empty');
      isValid = false;
    } else if (title.length > 100) {
      setTitleErr('Title cannot be more than 100 characters');
      isValid = false;
    }

    if (!text) {
      setTextErr('Question text cannot be empty');
      isValid = false;
    }

    // Hyperlink validation
    if (!validateHyperlink(text)) {
      setTextErr('Invalid hyperlink format.');
      isValid = false;
    }

    const tagnames = tagNames.split(' ').filter(tagName => tagName.trim() !== '');
    if (tagnames.length === 0) {
      setTagErr('Should have at least 1 tag');
      isValid = false;
    } else if (tagnames.length > 5) {
      setTagErr('Cannot have more than 5 tags');
      isValid = false;
    }

    for (const tagName of tagnames) {
      if (tagName.length > 20) {
        setTagErr('New tag length cannot be more than 20');
        isValid = false;
        break;
      }
    }

    const tags = tagnames.map(tagName => ({
      name: tagName,
      description: 'user added tag',
    }));

    if (!usrn) {
      setUsrnErr('Username cannot be empty');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const question = {
      title,
      text,
      tags,
      asked_by: usrn,
      ask_date_time: new Date(),
    };

    const res = await addQuestion(question);
    if (res && res._id) {
      handleQuestions();
    }
  };

  return (
    <Form>
      <Input
        title={'Question Title'}
        hint={'Limit title to 100 characters or less'}
        id={'formTitleInput'}
        val={title}
        setState={setTitle}
        err={titleErr}
      />
      <Textarea
        title={'Question Text'}
        hint={'Add details'}
        id={'formTextInput'}
        val={text}
        setState={setText}
        err={textErr}
      />
      <Input
        title={'Tags'}
        hint={'Add keywords separated by whitespace'}
        id={'formTagInput'}
        val={tagNames}
        setState={setTagNames}
        err={tagErr}
      />
      <Input
        title={'Username'}
        id={'formUsernameInput'}
        val={usrn}
        setState={setUsrn}
        err={usrnErr}
      />
      <div className='btn_indicator_container'>
        <button
          className='form_postBtn'
          onClick={() => {
            postQuestion();
          }}
        >
          Post Question
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewQuestion;
