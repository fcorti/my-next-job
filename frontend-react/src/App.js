import React, { useState, useEffect } from 'react';
import MessageForm from './components/MessageForm';
import MessageList from './components/MessageList';
import ServerStatus from './components/ServerStatus';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverOnline, setServerOnline] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Check server connection on mount
  useEffect(() => {
    checkServerConnection();
    loadMessages();
  }, []);

  const checkServerConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      if (response.ok) {
        const data = await response.json();
        setServerOnline(true);
        setStatusMessage(data.message);
      } else {
        setServerOnline(false);
        setStatusMessage('Server returned error');
      }
    } catch (err) {
      setServerOnline(false);
      setStatusMessage('Cannot connect to server');
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/messages`);
      if (!response.ok) {
        throw new Error('Failed to load messages');
      }
      const data = await response.json();
      setMessages(data);
      setError('');
    } catch (err) {
      setError('Failed to load messages: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMessage = async (text) => {
    try {
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to create message');
      }

      setError('');
      loadMessages();
    } catch (err) {
      setError('Failed to create message: ' + err.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/messages/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      setError('');
      loadMessages();
    } catch (err) {
      setError('Failed to delete message: ' + err.message);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>My Next Job</h1>
        <p className="subtitle">Help finding new job opportunities</p>
      </div>

      <MessageForm onSubmit={handleCreateMessage} />

      {error && <div className="error-alert">{error}</div>}

      <div className="card">
        <h2>Messages</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <MessageList messages={messages} onDeleteMessage={handleDeleteMessage} />
        )}
      </div>

      <ServerStatus online={serverOnline} message={statusMessage} />
    </div>
  );
}

export default App;
