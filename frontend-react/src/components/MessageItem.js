import React from 'react';
import './MessageItem.css';

function MessageItem({ message, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="message-item">
      <p>
        <span className="message-id">#{message.id}</span>
        {message.text}
      </p>
      <p className="message-time">Created: {formatDate(message.created_at)}</p>
      <div className="message-actions">
        <button
          className="delete-btn"
          onClick={() => onDelete(message.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default MessageItem;
