import React from 'react';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/formatters';
import { BellIcon, CheckIcon } from '../common/Icons';
import './NotificationCard.css';

export const NotificationCard = ({
  notification,
  onMarkRead
}) => {
  if (!notification) return null;

  const getTargetLink = () => {
    if (notification.relatedConversationId) {
      return `/chat`;
    }
    if (notification.relatedClaimId) {
      return `/dashboard/claims`;
    }
    if (notification.relatedItemId) {
      return `/items/${notification.relatedItemId}`;
    }
    return `/notifications`;
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'claim_accepted': return '🎉';
      case 'claim_received': return '📋';
      case 'claim_rejected': return '❌';
      case 'new_message': return '💬';
      case 'item_update': return '📢';
      default: return '🔔';
    }
  };

  return (
    <div className={`notification-card ${notification.isRead ? 'read' : 'unread'}`}>
      <div className="notif-icon-col">
        <span className="notif-badge-icon">{getIcon()}</span>
      </div>

      <div className="notif-main-col">
        <div className="notif-header-row">
          <Link to={getTargetLink()} className="notif-title-link">
            {notification.title}
          </Link>
          <span className="notif-timestamp">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>

        <p className="notif-body-text">{notification.body}</p>

        <div className="notif-actions-row">
          <Link to={getTargetLink()} className="notif-view-btn">
            View Details →
          </Link>

          {!notification.isRead && onMarkRead && (
            <button
              type="button"
              className="notif-mark-btn"
              onClick={() => onMarkRead(notification._id)}
            >
              <CheckIcon size={12} />
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;

