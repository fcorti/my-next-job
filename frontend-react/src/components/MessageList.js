import React from 'react';
import MessageItem from './MessageItem';
import './MessageList.css';

function MessageList({ messages, onDeleteMessage }) {
  if (messages.length === 0) {
    return <div className="empty-state">No messages yet. Create one!</div>;
  }

  return (
    <div className="messages-list">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          onDelete={onDeleteMessage}
        />
      ))}
    </div>
  );
}

export default MessageList;
