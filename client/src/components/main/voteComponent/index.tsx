import React, { useState, useEffect } from 'react';
import { downvoteQuestion, upvoteQuestion } from '../../../services/questionService';
import './index.css';

/**
 * Interface represents a question with its voting information.
 *
 * _id - The unique identifier of the question.
 * up_votes - Array of usernames who have upvoted the question.
 * down_votes - Array of usernames who have downvoted the question.
 */
interface Question {
  _id: string;
  up_votes: string[];
  down_votes: string[];
}

/**
 * Interface represents the props for the VoteComponent.
 *
 * question - The question object containing voting information.
 * username - The username of the current user.
 */
interface VoteComponentProps {
  question: Question;
  username: string;
}

/**
 * A Vote component that allows users to upvote or downvote a question.
 *
 * @param question - The question object containing voting information.
 * @param username - The username of the current user.
 */
const VoteComponent = ({ question, username }: VoteComponentProps) => {
  const [count, setCount] = useState<number>(0);
  const [voted, setVoted] = useState<number>(0); // 0 for not voted, 1 for upvote, -1 for downvote

  useEffect(() => {
    const getVoteValue = () => {
      if (username && question?.up_votes?.includes(username)) {
        return 1;
      }
      if (username && question?.down_votes?.includes(username)) {
        return -1;
      }
      return 0;
    };

    setCount((question.up_votes || []).length - (question.down_votes || []).length);

    // Fetch and set voteValue once question and username are available
    const fetchVoteValue = async () => {
      const voteValue = await getVoteValue();
      setVoted(voteValue);
    };
    fetchVoteValue();
  }, [question, username]);

  const handleVote = async (type: string) => {
    try {
      if (type === 'upvote' && voted !== 1) {
        await upvoteQuestion(question._id, username);
        setCount(count + (voted === -1 ? 2 : 1));
        setVoted(1);
      } else if (type === 'downvote' && voted !== -1) {
        await downvoteQuestion(question._id, username);
        setCount(count - (voted === 1 ? 2 : 1));
        setVoted(-1);
      } else if ((type === 'upvote' && voted === 1) || (type === 'downvote' && voted === -1)) {
        // Cancel vote
        if (type === 'upvote') {
          await upvoteQuestion(question._id, username);
        } else {
          await downvoteQuestion(question._id, username);
        }
        setCount(count - voted);
        setVoted(0);
      } else if ((type === 'upvote' && voted === -1) || (type === 'downvote' && voted === 1)) {
        // Change vote
        if (type === 'upvote') {
          await upvoteQuestion(question._id, username);
        } else {
          await downvoteQuestion(question._id, username);
        }
        setCount(count + (type === 'upvote' ? 2 : -2));
        setVoted(type === 'upvote' ? 1 : -1);
      }
    } catch (error) {
      // Handle error, e.g., show error message to the user
    }
  };

  return (
    <div className='vote-container'>
      <button
        className={`vote-button ${voted === 1 ? 'vote-button-upvoted' : ''}`}
        onClick={() => handleVote('upvote')}
      >
        Upvote
      </button>
      <button
        className={`vote-button ${voted === -1 ? 'vote-button-downvoted' : ''}`}
        onClick={() => handleVote('downvote')}
      >
        Downvote
      </button>
      <span className='vote-count'>{count}</span>
    </div>
  );
};

export default VoteComponent;
