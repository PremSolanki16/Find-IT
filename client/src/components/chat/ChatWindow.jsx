import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import MessageBubble from './MessageBubble';
import { SendIcon, ShieldCheckIcon } from '../common/Icons';
import Button from '../common/Button';
import './ChatWindow.css';

export const ChatWindow = ({
  conversation,
  messages = [],
  currentUserId,
  users = [],
  item = null,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const messagesContainerRef = useRef(null);

  const otherId = conversation?.participantIds.find(id => id !== currentUserId) || conversation?.participantIds[0];
  const otherUser = users.find(u => u._id === otherId) || { name: 'Chat Member', avatarUrl: '' };

  // Keep scrolling inside the messages area without moving the page
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(conversation._id, inputText);
    setInputText('');
  };

  if (!conversation) {
    return (
      <div className="chat-window-empty">
        <div className="chat-empty-icon">💬</div>
        <h3>Select a Conversation</h3>
        <p>Choose an ongoing return coordination thread from the left sidebar to communicate safely.</p>
      </div>
    );
  }

  return (
    <div className="chat-window-container">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-user">
          <img
            src={otherUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt={otherUser.name}
            className="chat-header-avatar"
          />
          <div className="chat-header-meta">
            <h4 className="chat-partner-name">{otherUser.name}</h4>
            {item && (
              <span className="chat-item-context">
                Regarding:{' '}
                <Link to={`/items/${item._id}`} className="chat-item-link">
                  {item.title}
                </Link>
              </span>
            )}
          </div>
        </div>

        <div className="chat-safety-pill">
          <ShieldCheckIcon size={16} color="var(--color-success)" />
          <span>Encrypted Private Thread</span>
        </div>
      </div>

      {/* Handover Notice Banner */}
      <div className="chat-handover-tip">
        💡 <strong>Safety Tip:</strong> Coordinate meeting during daylight hours at campus reception, library front desk, or security office. Never transfer money beforehand.
      </div>

      {/* Messages Stream */}
      <div className="chat-messages-stream" ref={messagesContainerRef}>
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUserId;
          const sender = isMine ? null : otherUser;
          return (
            <MessageBubble
              key={msg._id}
              message={msg}
              isMine={isMine}
              sender={sender}
            />
          );
        })}
        
      </div>

      {/* Input Row */}
      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          type="text"
          className="chat-text-input"
          placeholder={`Message ${otherUser.name}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          icon={<SendIcon size={16} />}
          disabled={!inputText.trim()}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;

