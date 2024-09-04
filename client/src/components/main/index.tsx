/* eslint-disable @typescript-eslint/no-use-before-define */
import './index.css';
import React, { useState } from 'react';
import SideBarNav from './sideBarNav';
import HomePageClass from './routing/home';
import TagPageClass from './routing/tag';
import AnswerPageClass from './routing/answer';
import NewQuestionPageClass from './routing/newQuestion';
import NewAnswerPageClass from './routing/newAnswer';

/**
 * Interface represents the props for the Main component.
 *
 * search - Optional search term for filtering questions.
 * title - The title of the page.
 * setQuestionPage - Function to render the question page based on search and title.
 */
interface MainProps {
  search?: string;
  title: string;
  setQuestionPage: (search?: string, title?: string) => void;
}

/**
 * The Main component that manages page navigation and displays content based on the current page.
 *
 * @param search - Optional search term for filtering questions.
 * @param title - The title of the page.
 * @param setQuestionPage - Function to render the question page based on filtered questions and page title.
 */
const Main = ({ search = '', title, setQuestionPage }: MainProps) => {
  const [questionOrder, setQuestionOrder] = useState<string>('newest');
  const [qid, setQid] = useState<string>('');

  const handleQuestions = () => {
    setQuestionPage();
    setPageInstance(
      new HomePageClass({
        search,
        title,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      }),
    );
  };

  const handleTags = () => {
    setPageInstance(
      new TagPageClass({
        search,
        title,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      }),
    );
  };

  const handleAnswer = (questionID: string) => {
    setQid(questionID);
    setPageInstance(
      new AnswerPageClass({
        search,
        title,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid: questionID,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      }),
    );
  };

  const clickTag = (tname: string) => {
    setQuestionPage(`[${tname}]`, tname);
    setPageInstance(
      new HomePageClass({
        search,
        title,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      }),
    );
  };

  const handleNewQuestion = () => {
    setPageInstance(
      new NewQuestionPageClass({
        search,
        title,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      }),
    );
  };

  const handleNewAnswer = () => {
    // eslint-disable-next-line no-console
    console.log('handleNewAnswer');
    // eslint-disable-next-line no-console
    console.log(qid);
    setPageInstance(
      new NewAnswerPageClass({
        search,
        title,
        setQuestionPage,
        questionOrder,
        setQuestionOrder,
        qid,
        handleQuestions,
        handleTags,
        handleAnswer,
        clickTag,
        handleNewQuestion,
        handleNewAnswer,
      }),
    );
  };

  const [pageInstance, setPageInstance] = useState(
    new HomePageClass({
      search,
      title,
      setQuestionPage,
      questionOrder,
      setQuestionOrder,
      qid,
      handleQuestions,
      handleTags,
      handleAnswer,
      clickTag,
      handleNewQuestion,
      handleNewAnswer,
    }),
  );

  pageInstance.search = search;
  pageInstance.questionOrder = questionOrder;
  pageInstance.qid = qid;

  return (
    <div id='main' className='main'>
      <SideBarNav
        selected={pageInstance.getSelected()}
        handleQuestions={handleQuestions}
        handleTags={handleTags}
      />
      <div id='right_main' className='right_main'>
        {pageInstance.getContent()}
      </div>
    </div>
  );
};

export default Main;
