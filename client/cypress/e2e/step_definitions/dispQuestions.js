import { Given, Then, Before, After, But } from 'cypress-cucumber-preprocessor/steps';

// assumes that the feature will be run from the client directory and all dependencies are installed. Run npm install if dependencies are not installed.

Before(() => {
  cy.exec('node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so');
  cy.exec('node ../server/populate_db.js mongodb://127.0.0.1:27017/fake_so');
});

After(() => {
  cy.exec('node ../server/remove_db.js mongodb://127.0.0.1:27017/fake_so');
});

Given('The user is on the homepage {string}', url => {
  cy.visit(url);
});

Then(
  'The user should see all questions in the Database sorted by the most recently posted question first',
  () => {
    const qTitles = [
      'Quick question about storage on android',
      'Object storage for a web application',
      'android studio save string shared preference, start activity and load the saved string',
      'Programmatically navigate using React router',
    ];
    cy.get('.postTitle').each(($el, index, _) => {
      cy.wrap($el).should('contain', qTitles[index]);
    });
  },
);

When('The user clicks on the Newest tab after clicking on the Active tab', () => {
  cy.contains('Active').click();
  cy.contains('Newest').click();
});

Given('The user is viewing All Questions', () => {
  cy.contains('Questions').click();
});

When('The user clicks on the Active tab', () => {
  cy.contains('Active').click();
});

Then(
  'The user should see all questions in the Database sorted by the most recently active question first',
  () => {
    const qTitles = [
      'Programmatically navigate using React router',
      'android studio save string shared preference, start activity and load the saved string',
      'Quick question about storage on android',
      'Object storage for a web application',
    ];
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    });
  },
);

Given('The user is viewing All Questions', () => {
  cy.contains('Questions').click();
});

And('There are questions in the Database that have no answers', () => {
  // add a question
  cy.contains('Ask a Question').click();
  cy.get('#formTitleInput').type('Test Question A');
  cy.get('#formTextInput').type('Test Question A Text');
  cy.get('#formTagInput').type('javascript');
  cy.get('#formUsernameInput').type('mks1');
  cy.contains('Post Question').click();

  // add another question
  cy.contains('Ask a Question').click();
  cy.get('#formTitleInput').type('Test Question B');
  cy.get('#formTextInput').type('Test Question B Text');
  cy.get('#formTagInput').type('javascript');
  cy.get('#formUsernameInput').type('mks2');
  cy.contains('Post Question').click();

  // add another question
  cy.contains('Ask a Question').click();
  cy.get('#formTitleInput').type('Test Question C');
  cy.get('#formTextInput').type('Test Question C Text');
  cy.get('#formTagInput').type('javascript');
  cy.get('#formUsernameInput').type('mks3');
  cy.contains('Post Question').click();

  // add an answer to question A
  cy.contains('Test Question A').click();
  cy.contains('Answer Question').click();
  cy.get('#answerUsernameInput').type('abc3');
  cy.get('#answerTextInput').type('Answer Question A');
  cy.contains('Post Answer').click();
});

When('The user clicks on the Unanswered tab in All Questions page', () => {
  cy.contains('Questions').click();
  cy.contains('Unanswered').click();
});

Then(
  'The user should see all questions in the Database that have no answers in newest order',
  () => {
    const qTitles = ['Test Question C', 'Test Question B'];
    cy.get('.postTitle').each(($el, index, _) => {
      cy.wrap($el).should('contain', qTitles[index]);
    });
  },
);

But('The user should not see any questions that have answers', () => {
  cy.get('.postTitle').should('have.length', 2);
  cy.get('.postTitle').should('not.contain', 'Test Question A');
});
