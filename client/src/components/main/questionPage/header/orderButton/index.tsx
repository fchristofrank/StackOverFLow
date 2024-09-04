import './index.css';
import React from 'react';

/**
 * Interface representing the props for the OrderButton component.
 *
 * message - The text to be displayed on the button.
 * setQuestionOrder - A function that sets the order of questions based on the message.
 */
interface OrderButtonProps {
  message: string;
  setQuestionOrder: (message: string) => void;
}

/**
 * OrderButton component renders a button that, when clicked, triggers the setQuestionOrder function
 * with the provided message.
 * It will update the order of questions based on the input message.
 *
 * @param message - The label for the button and the value passed to setQuestionOrder function.
 * @param setQuestionOrder - Callback function to set the order of questions based on the input message.
 */
const OrderButton = ({ message, setQuestionOrder }: OrderButtonProps) => (
  <button
    className='btn'
    onClick={() => {
      setQuestionOrder(message);
    }}
  >
    {message}
  </button>
);

export default OrderButton;
