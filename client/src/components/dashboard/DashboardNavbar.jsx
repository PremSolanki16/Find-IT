import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { BellIcon, PlusIcon } from '../common/Icons';
import Button from '../common/Button';
import './DashboardNavbar.css';

export const DashboardNavbar = ({ title, subtitle = null, onToggleSidebar = null }) => {
  const { currentUser } = useAuth();
  const { notifications } = useData();

  const unreadCount = currentUser 
    ? notifications.filter(n => n.recipientId === currentUser._id && !n.isRead).length 
    : 0;

  return (
    <header className="dashboard-navbar">
      <div className="dash-nav-left">
        {onToggleSidebar && (
          <button 
            type="button" 
            className="dash-mobile-sidebar-toggle" 
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}
        <div className="dash-header-titles">
          <h1 className="dash-nav-title">{title}</h1>
          {subtitle && <p className="dash-nav-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="dash-nav-right">
        <Link to="/report/lost">
          <Button variant="outline" size="sm" icon={<PlusIcon size={14} />}>
            Report Lost
          </Button>
        </Link>
        <Link to="/report/found">
          <Button variant="primary" size="sm" icon={<PlusIcon size={14} />}>
            Report Found
          </Button>
        </Link>

        <Link to="/notifications" className="dash-nav-notif-btn" aria-label="Notifications">
          <BellIcon size={18} />
          {unreadCount > 0 && <span className="dash-notif-badge">{unreadCount}</span>}
        </Link>

        <Link to="/dashboard/profile" className="dash-profile-chip">
          <img
            src={currentUser?.avatarUrl}
            alt={currentUser?.name}
            className="dash-chip-avatar"
          />
          <span className="dash-chip-name">{currentUser?.name.split(' ')[0]}</span>
        </Link>
      </div>
    </header>
  );
};

export default DashboardNavbar;

