
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ConversationList from '../../components/chat/ConversationList';
import ChatWindow from '../../components/chat/ChatWindow';
import {
  getConversationsApi,
  getMessagesApi
} from '../../services/api';
import { createChatSocket } from '../../services/chatSocket';
import './ChatPage.css';

export const ChatPage = () => {
  const { currentUser } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const socketRef = useRef(null);

  const currentUserId = currentUser?._id;

  // Load conversations from the backend
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await getConversationsApi();

        setConversations(response.conversations);

        if (response.conversations.length > 0) {
          setSelectedConvId(response.conversations[0]._id);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Connect to the authenticated Socket.IO server
  useEffect(() => {
    const token = localStorage.getItem('findit_token');

    if (!token) return;

    const socket = createChatSocket(token);

    socketRef.current = socket;

    socket.connect();

    socket.on('connect_error', (error) => {
      console.error('Chat connection failed:', error.message);
    });

    socket.on('message_error', (error) => {
      console.error('Chat message error:', error.message);
    });

    socket.on('receive_message', (message) => {
      setMessages((prev) => {
        const alreadyExists = prev.some(
          (msg) => msg._id === message._id
        );

        return alreadyExists ? prev : [...prev, message];
      });

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id === message.conversationId
            ? {
                ...conversation,
                lastMessageAt: message.createdAt
              }
            : conversation
        )
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Load message history and join the selected conversation
  useEffect(() => {
    if (!selectedConvId) {
      setMessages([]);
      return;
    }

    let isActive = true;

    const loadMessages = async () => {
      try {
        const response = await getMessagesApi(selectedConvId);

        if (isActive) {
          setMessages(response.messages);
        }
      } catch (error) {
        console.error('Failed to load messages:', error.message);
      }
    };

    loadMessages();

    const socket = socketRef.current;

    // Join the conversation whenever the socket connects
    const joinConversation = () => {
      socket.emit('join_conversation', selectedConvId);
    };

    if (socket) {
      socket.on('connect', joinConversation);

      if (socket.connected) {
        joinConversation();
      }
    }

    return () => {
    isActive = false;

    if (socket) {
        socket.off('connect', joinConversation);

        // Leave the previous conversation when switching chats
        socket.emit('leave_conversation', selectedConvId);
    }
};
}, [selectedConvId]);

  // Send a message through Socket.IO
  const sendMessage = (conversationId, text) => {
    if (!text.trim() || !socketRef.current?.connected) {
      console.error('Chat server is not connected');
      return;
    }

    socketRef.current.emit('send_message', {
      conversationId,
      text: text.trim()
    });
  };

  // Convert populated participants into the existing UI structure
  const userConversations = conversations.map((conversation) => ({
    ...conversation,
    participantIds: conversation.participantIds.map(
      (participant) => participant._id
    ),
    itemId: conversation.itemId?._id
  }));

  // Get unique users from backend conversation participants
  const chatUsers = conversations
    .flatMap((conversation) => conversation.participantIds)
    .filter(
      (user, index, users) =>
        users.findIndex((entry) => entry._id === user._id) === index
    );

  const activeConversation = conversations.find(
    (conversation) => conversation._id === selectedConvId
  );

  const activeItem = activeConversation?.itemId || null;

  // Display only messages belonging to the selected conversation
  const activeMessages = messages.filter(
    (message) => message.conversationId === selectedConvId
  );

  if (isLoading) {
    return <div className="chat-page-root">Loading conversations...</div>;
  }

  return (
    <div className="chat-page-root">
      <div className="chat-page-container card">
        <ConversationList
          conversations={userConversations}
          currentUserId={currentUserId}
          users={chatUsers}
          items={conversations.map((conversation) => conversation.itemId)}
          selectedConversationId={selectedConvId}
          onSelectConversation={setSelectedConvId}
        />

        <ChatWindow
          conversation={
            activeConversation
              ? {
                  ...activeConversation,
                  participantIds: activeConversation.participantIds.map(
                    (participant) => participant._id
                  )
                }
              : null
          }
          messages={activeMessages.map((message) => ({
            ...message,
            senderId:
              typeof message.senderId === 'object'
                ? message.senderId._id
                : message.senderId
          }))}
          currentUserId={currentUserId}
          users={chatUsers}
          item={activeItem}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;
