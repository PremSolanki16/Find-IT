import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { XIcon, BellIcon } from './Icons';
import './NotificationToast.css';

// Display a toast when a new notification arrives
const NotificationToast = () => {
  const {
    toastNotification,
    dismissNotificationToast
  } = useNotifications();

  if (!toastNotification) return null;

  // Get the destination based on notification type
  const getTargetLink = () => {
    switch (toastNotification.type) {
      case 'claim_received':
        return '/dashboard/received-claims';

      case 'claim_accepted':
      case 'claim_rejected':
        return '/dashboard/claims';

      case 'new_message':
        return '/chat';

      case 'item_update':
        return toastNotification.relatedItemId
          ? `/items/${toastNotification.relatedItemId}`
          : '/notifications';

      default:
        return '/notifications';
    }
  };

  return (
    <div className="notification-toast">
      <div className="notification-toast-icon">
        <BellIcon size={20} />
      </div>

      <div className="notification-toast-content">
        <strong>{toastNotification.title}</strong>
        <p>{toastNotification.body}</p>

        <Link
          to={getTargetLink()}
          onClick={dismissNotificationToast}
        >
          View Details
        </Link>
      </div>

      <button
        type="button"
        className="notification-toast-close"
        onClick={dismissNotificationToast}
        aria-label="Close notification"
      >
        <XIcon size={16} />
      </button>
    </div>
  );
};

export default NotificationToast;