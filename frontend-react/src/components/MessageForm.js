import React, { useState } from 'react';
import './MessageForm.css';

function MessageForm({ onSubmit }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <div className="card form-card">
      <h2>Create a New Message</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your message..."
            required
          />
          <button type="submit">Send Message</button>
        </div>
      </form>
    </div>
  );
}

export default MessageForm;
