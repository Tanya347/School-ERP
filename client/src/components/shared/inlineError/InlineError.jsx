import React from 'react';
import './inlineError.scss';

const InlineError = ({ message, title = "Error", onRetry }) => {
  return (
    <div className="inline-error-container">
      <h3 className="error-title">{title}</h3>
      <p className="error-message">{message || 'An unknown error occurred'}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Retry
        </button>
      )}
    </div>
  );
};

export default InlineError;
