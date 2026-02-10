import React from 'react';
import './ServerStatus.css';

function ServerStatus({ online, message }) {
  return (
    <div className="status">
      <p className={online ? 'success' : 'error'}>
        {online ? '✓' : '✗'} {message}
      </p>
    </div>
  );
}

export default ServerStatus;
