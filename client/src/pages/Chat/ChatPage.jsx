import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import ConversationList from '../../components/chat/ConversationList';
import ChatWindow from '../../components/chat/ChatWindow';
import './ChatPage.css';

export const ChatPage = () => {
  const { currentUser, availableUsers } = useAuth();
  const { conversations, messages, items, sendMessage } = useData();

  const currentUserId = currentUser?._id;

  // Filter conversations where current user is a participant
  const userConversations = conversations.filter(c => 
    c.participantIds.includes(currentUserId)
  );

  const [selectedConvId, setSelectedConvId] = useState(() => {
    return userConversations.length > 0 ? userConversations[0]._id : null;
  });

  // Current active conversation
  const activeConversation = conversations.find(c => c._id === selectedConvId) || userConversations[0] || null;

  // Messages for active conversation
  const activeMessages = activeConversation
    ? messages.filter(m => m.conversationId === activeConversation._id)
    : [];

  // Related item
  const activeItem = activeConversation
    ? items.find(i => i._id === activeConversation.itemId)
    : null;

  return (
    <div className="chat-page-root">
      <div className="chat-page-container card">
        <ConversationList
          conversations={userConversations}
          currentUserId={currentUserId}
          users={availableUsers}
          items={items}
          selectedConversationId={activeConversation?._id}
          onSelectConversation={setSelectedConvId}
        />

        <ChatWindow
          conversation={activeConversation}
          messages={activeMessages}
          currentUserId={currentUserId}
          users={availableUsers}
          item={activeItem}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;

