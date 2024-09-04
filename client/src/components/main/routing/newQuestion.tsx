import React from 'react';
import PageClass from '.';
import NewQuestion from '../newQuestion';

/**
 * Page class for creating a new question.
 */
export default class NewQuestionPageClass extends PageClass {
  getContent(): React.ReactNode {
    // eslint-disable-next-line no-console
    console.log(this);
    return <NewQuestion handleQuestions={this.handleQuestions} />;
  }

  /**
   * It represents the current state.
   * By default, it returns an empty string.
   */
  getSelected(): string {
    return '';
  }
}
