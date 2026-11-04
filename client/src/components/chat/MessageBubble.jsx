import React from 'react';
import { formatDateTime } from '../../utils/formatters';
import './MessageBubble.css';

export const MessageBubble = ({
  message,
  isMine = false,
  sender = null
}) => {
  return (
    <div className={`message-bubble-row ${isMine ? 'mine' : 'theirs'}`}>
      {!isMine && (
        <img
          src={sender?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
          alt={sender?.name || 'User'}
          className="bubble-avatar"
        />
      )}

      <div className="bubble-content-wrap">
        {!isMine && sender?.name && (
          <span className="bubble-sender-name">{sender.name}</span>
        )}
        <div className="bubble-text">
          {message.text}
        </div>
        <span className="bubble-timestamp">
          {formatDateTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;

