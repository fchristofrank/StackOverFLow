import React, { useState } from 'react';
import Header from './header';
import Main from './main';

/**
 * Represents the main component of the application.
 * It manages the state for search terms and the main title.
 */
const FakeStackOverflow = () => {
  const [search, setSearch] = useState<string>('');
  const [mainTitle, setMainTitle] = useState<string>('All Questions');

  const setQuestionPage = (searchString: string = '', title: string = 'All Questions'): void => {
    setSearch(searchString);
    setMainTitle(title);
  };

  return (
    <>
      <Header search={search} setQuestionPage={setQuestionPage} />
      <Main title={mainTitle} search={search} setQuestionPage={setQuestionPage} />
    </>
  );
};

export default FakeStackOverflow;
