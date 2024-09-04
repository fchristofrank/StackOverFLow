Feature: Display Questions
  Background:
    Given The user is on the homepage "http://localhost:3000"
  
  Scenario: Show all questions in newest order by default
    Then The user should see all questions in the Database sorted by the most recently posted question first

  Scenario: The Newest tab should show all questions in newest order
    When The user clicks on the Newest tab after clicking on the Active tab
    Then The user should see all questions in the Database sorted by the most recently posted question first

  Scenario: The Active tab should show all questions in active order
    Given The user is viewing All Questions
    When The user clicks on the Active tab
    Then The user should see all questions in the Database sorted by the most recently active question first

  Scenario: The Unanswered tab should show only unanswered questions
    Given The user is viewing All Questions
    And There are questions in the Database that have no answers
    When The user clicks on the Unanswered tab in All Questions page
    Then The user should see all questions in the Database that have no answers in newest order
    But The user should not see any questions that have answers