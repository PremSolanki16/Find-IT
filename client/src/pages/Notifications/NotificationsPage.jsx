import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import NotificationCard from '../../components/dashboard/NotificationCard';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { CheckIcon } from '../../components/common/Icons';
import './NotificationsPage.css';

export const NotificationsPage = () => {
  const { currentUser } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();

  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const userNotifications = notifications.filter(n => n.recipientId === currentUser?._id);

  const filtered = filter === 'unread'
    ? userNotifications.filter(n => !n.isRead)
    : userNotifications;

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  return (
    <div className="notifications-page section-py">
      <div className="content-container">
        <div className="notifications-header-row">
          <div>
            <h1 className="notifs-title">Notifications & Alerts</h1>
            <p className="notifs-subtitle">
              Updates about your claims, new messages, and status changes on your belongings.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={<CheckIcon size={14} />}
              onClick={markAllNotificationsAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="notifs-filter-tabs">
          <button
            type="button"
            className={`notif-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Updates ({userNotifications.length})
          </button>
          <button
            type="button"
            className={`notif-tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* List */}
        <div className="notifs-list-container">
          {filtered.length === 0 ? (
            <EmptyState
              icon="🔔"
              title={filter === 'unread' ? "No unread notifications" : "No notifications yet"}
              message="When someone claims your item, responds to your claim, or sends a private message, it will show up here."
            />
          ) : (
            filtered.map((notif) => (
              <NotificationCard
                key={notif._id}
                notification={notif}
                onMarkRead={markNotificationAsRead}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

