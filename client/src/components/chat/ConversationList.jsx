import React, { useState } from 'react';
import { formatRelativeTime } from '../../utils/formatters';
import { SearchIcon } from '../common/Icons';
import './ConversationList.css';

export const ConversationList = ({
  conversations = [],
  currentUserId,
  users = [],
  items = [],
  selectedConversationId,
  onSelectConversation
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getOtherParticipant = (conv) => {
    const otherId = conv.participantIds.find(id => id !== currentUserId) || conv.participantIds[0];
    return users.find(u => u._id === otherId) || { name: 'Chat Member', avatarUrl: '' };
  };

  const getAssociatedItem = (conv) => {
    return items.find(i => i._id === conv.itemId);
  };

  const filteredConversations = conversations.filter(conv => {
    const other = getOtherParticipant(conv);
    const item = getAssociatedItem(conv);
    const search = searchQuery.toLowerCase();
    return (
      other.name.toLowerCase().includes(search) ||
      (item && item.title.toLowerCase().includes(search))
    );
  });

  return (
    <div className="conversation-list-panel">
      <div className="conversation-list-header">
        <h3 className="conversations-heading">Direct Messages</h3>
        <span className="conv-count-tag">{conversations.length}</span>
      </div>

      <div className="conv-search-box">
        <SearchIcon size={14} color="var(--color-text-muted)" />
        <input
          type="text"
          className="conv-search-input"
          placeholder="Search chats or items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="conversation-items-scroll">
        {filteredConversations.length === 0 ? (
          <div className="no-chats-box">
            <span>No conversations found.</span>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const other = getOtherParticipant(conv);
            const item = getAssociatedItem(conv);
            const isSelected = conv._id === selectedConversationId;

            return (
              <button
                key={conv._id}
                type="button"
                className={`conversation-item-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectConversation(conv._id)}
              >
                <div className="conv-avatar-wrap">
                  <img
                    src={other.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={other.name}
                    className="conv-avatar-img"
                  />
                  <span className="conv-online-dot" />
                </div>

                <div className="conv-item-text">
                  <div className="conv-item-top">
                    <span className="conv-other-name">{other.name}</span>
                    <span className="conv-timestamp">{formatRelativeTime(conv.lastMessageAt)}</span>
                  </div>

                  {item && (
                    <span className="conv-item-reference" title={item.title}>
                      📦 {item.title}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;

