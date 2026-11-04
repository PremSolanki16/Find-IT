import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockItems } from '../data/mockItems';
import { mockClaims } from '../data/mockClaims';
import { mockConversations } from '../data/mockConversations';
import { mockMessages } from '../data/mockMessages';
import { mockNotifications } from '../data/mockNotifications';
import { mockReports } from '../data/mockReports';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('findit_items');
    return saved ? JSON.parse(saved) : mockItems;
  });

  const [claims, setClaims] = useState(() => {
    const saved = localStorage.getItem('findit_claims');
    return saved ? JSON.parse(saved) : mockClaims;
  });

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('findit_conversations');
    return saved ? JSON.parse(saved) : mockConversations;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('findit_messages');
    return saved ? JSON.parse(saved) : mockMessages;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('findit_notifications');
    return saved ? JSON.parse(saved) : mockNotifications;
  });

  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('findit_reports');
    return saved ? JSON.parse(saved) : mockReports;
  });

  // Sync to local storage for persistent demo experience
  useEffect(() => {
    localStorage.setItem('findit_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('findit_claims', JSON.stringify(claims));
  }, [claims]);

  useEffect(() => {
    localStorage.setItem('findit_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('findit_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('findit_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('findit_reports', JSON.stringify(reports));
  }, [reports]);

  // Items Actions
  const addItem = (itemData) => {
    const newItem = {
      _id: `itm_${Date.now()}`,
      createdBy: currentUser?._id || 'usr_001',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      imageUrls: itemData.imageUrls && itemData.imageUrls.length > 0 
        ? itemData.imageUrls 
        : ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'],
      privateClues: itemData.privateClues || [],
      isRewardOffered: !!itemData.isRewardOffered,
      rewardDetails: itemData.rewardDetails || '',
      ...itemData
    };

    setItems(prev => [newItem, ...prev]);

    // Add notification
    addNotification({
      recipientId: newItem.createdBy,
      type: 'item_update',
      title: 'Post Published Successfully',
      body: `Your ${newItem.type} item post "${newItem.title}" is now visible.`,
      relatedItemId: newItem._id
    });

    return newItem;
  };

  const updateItem = (itemId, updatedFields) => {
    setItems(prev => prev.map(item => {
      if (item._id === itemId) {
        return {
          ...item,
          ...updatedFields,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    }));
  };

  const deleteItem = (itemId) => {
    setItems(prev => prev.filter(item => item._id !== itemId));
  };

  // Claims Actions
  const submitClaim = (claimData) => {
    const newClaim = {
      _id: `clm_${Date.now()}`,
      itemId: claimData.itemId,
      claimantId: currentUser?._id || 'usr_001',
      answers: claimData.answers || [],
      status: 'pending',
      reviewedBy: null,
      reviewNote: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setClaims(prev => [newClaim, ...prev]);

    // Also update item status to claim_pending
    updateItem(claimData.itemId, { status: 'claim_pending' });

    // Notify item creator (finder)
    const targetItem = items.find(i => i._id === claimData.itemId);
    if (targetItem) {
      addNotification({
        recipientId: targetItem.createdBy,
        type: 'claim_received',
        title: 'New Ownership Claim Submitted',
        body: `A claim was submitted for your found post "${targetItem.title}". Review their verification answers.`,
        relatedItemId: targetItem._id,
        relatedClaimId: newClaim._id
      });
    }

    return newClaim;
  };

  const updateClaimStatus = (claimId, newStatus, reviewNote = '') => {
    setClaims(prev => prev.map(claim => {
      if (claim._id === claimId) {
        return {
          ...claim,
          status: newStatus,
          reviewedBy: currentUser?._id || claim.reviewedBy,
          reviewNote: reviewNote || claim.reviewNote,
          updatedAt: new Date().toISOString()
        };
      }
      return claim;
    }));

    const claim = claims.find(c => c._id === claimId);
    if (!claim) return;

    const item = items.find(i => i._id === claim.itemId);

    if (newStatus === 'accepted') {
      // Create conversation if not existing
      let conv = conversations.find(c => c.claimId === claimId);
      if (!conv) {
        conv = {
          _id: `conv_${Date.now()}`,
          claimId: claim._id,
          itemId: claim.itemId,
          participantIds: [claim.claimantId, currentUser?._id || item?.createdBy],
          lastMessageAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setConversations(prev => [conv, ...prev]);

        // Add welcome message
        const initialMsg = {
          _id: `msg_${Date.now()}`,
          conversationId: conv._id,
          senderId: currentUser?._id || item?.createdBy,
          text: `Hello! I have reviewed and accepted your claim for "${item?.title || 'the item'}". Let's coordinate a convenient and safe time and place for handover.`,
          messageType: 'text',
          isDeleted: false,
          createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, initialMsg]);
      }

      // Notify claimant
      addNotification({
        recipientId: claim.claimantId,
        type: 'claim_accepted',
        title: 'Claim Accepted!',
        body: `Your claim for "${item?.title || 'found item'}" was approved. A private conversation has been opened.`,
        relatedItemId: claim.itemId,
        relatedClaimId: claim._id,
        relatedConversationId: conv?._id
      });
    } else if (newStatus === 'rejected') {
      // Revert item status to open if no other pending claims
      if (item) {
        updateItem(item._id, { status: 'open' });
      }

      addNotification({
        recipientId: claim.claimantId,
        type: 'claim_rejected',
        title: 'Claim Not Approved',
        body: `Your claim for "${item?.title || 'found item'}" could not be verified by the finder.`,
        relatedItemId: claim.itemId,
        relatedClaimId: claim._id
      });
    } else if (newStatus === 'completed') {
      // Mark item returned
      if (item) {
        updateItem(item._id, { status: 'returned' });
      }

      addNotification({
        recipientId: claim.claimantId,
        type: 'item_update',
        title: 'Item Return Completed',
        body: `The return process for "${item?.title || 'found item'}" has been marked complete.`,
        relatedItemId: claim.itemId,
        relatedClaimId: claim._id
      });
    }
  };

  // Chat Actions
  const sendMessage = (conversationId, text) => {
    if (!text.trim()) return null;

    const newMsg = {
      _id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser?._id || 'usr_001',
      text: text.trim(),
      messageType: 'text',
      isDeleted: false,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);

    // Update conversation lastMessageAt
    setConversations(prev => prev.map(c => {
      if (c._id === conversationId) {
        return {
          ...c,
          lastMessageAt: newMsg.createdAt,
          updatedAt: newMsg.createdAt
        };
      }
      return c;
    }));

    // Notify other participant
    const conv = conversations.find(c => c._id === conversationId);
    if (conv) {
      const recipientId = conv.participantIds.find(id => id !== currentUser?._id);
      if (recipientId) {
        addNotification({
          recipientId,
          type: 'new_message',
          title: `New Message from ${currentUser?.name || 'User'}`,
          body: text.length > 60 ? `${text.substring(0, 60)}...` : text,
          relatedConversationId: conversationId
        });
      }
    }

    return newMsg;
  };

  // Notification Actions
  const addNotification = (notifData) => {
    const newNotif = {
      _id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      recipientId: notifData.recipientId,
      type: notifData.type || 'item_update',
      title: notifData.title,
      body: notifData.body,
      relatedItemId: notifData.relatedItemId || null,
      relatedClaimId: notifData.relatedClaimId || null,
      relatedConversationId: notifData.relatedConversationId || null,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotif, ...prev]);
    return newNotif;
  };

  const markNotificationAsRead = (notifId) => {
    setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.recipientId === currentUser._id ? { ...n, isRead: true } : n));
  };

  // Reports Actions
  const submitReport = (reportData) => {
    const newReport = {
      _id: `rep_${Date.now()}`,
      reporterId: currentUser?._id || 'usr_001',
      targetType: reportData.targetType,
      itemId: reportData.itemId || null,
      targetUserId: reportData.targetUserId || null,
      messageId: reportData.messageId || null,
      reason: reportData.reason,
      details: reportData.details || '',
      status: 'open',
      reviewedBy: null,
      adminNote: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const updateReportStatus = (reportId, newStatus, adminNote = '') => {
    setReports(prev => prev.map(r => {
      if (r._id === reportId) {
        return {
          ...r,
          status: newStatus,
          adminNote: adminNote || r.adminNote,
          reviewedBy: currentUser?._id || 'usr_admin',
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  };

  // Reset demo state
  const resetDemoData = () => {
    setItems(mockItems);
    setClaims(mockClaims);
    setConversations(mockConversations);
    setMessages(mockMessages);
    setNotifications(mockNotifications);
    setReports(mockReports);
    localStorage.removeItem('findit_items');
    localStorage.removeItem('findit_claims');
    localStorage.removeItem('findit_conversations');
    localStorage.removeItem('findit_messages');
    localStorage.removeItem('findit_notifications');
    localStorage.removeItem('findit_reports');
  };

  const value = {
    items,
    claims,
    conversations,
    messages,
    notifications,
    reports,
    addItem,
    updateItem,
    deleteItem,
    submitClaim,
    updateClaimStatus,
    sendMessage,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    submitReport,
    updateReportStatus,
    resetDemoData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

