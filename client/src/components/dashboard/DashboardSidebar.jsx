import React, { useState, useEffect } from 'react';
import { getReceivedClaimsApi } from '../../services/api';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { 
  BellIcon, 
  MessageSquareIcon, 
  UserIcon, 
  ShieldCheckIcon,
  PlusIcon
} from '../common/Icons';
import './DashboardSidebar.css';

export const DashboardSidebar = ({ isAdminView = false }) => {
  const { currentUser, logout } = useAuth();
  const { notifications } = useData();
  const navigate = useNavigate();

  // Store received claims fetched from the backend
  const [claims, setClaims] = useState([]);

  // Fetch received claims from the backend for the sidebar count
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await getReceivedClaimsApi();
        setClaims(response.claims || []);
      } catch (error) {
        console.error('Failed to load sidebar claims:', error);
      }
    };

    fetchClaims();
  }, []);

  // Counts
  const unreadNotifs = notifications.filter(n => n.recipientId === currentUser?._id && !n.isRead).length;
  const pendingClaimsCount = claims.filter(c => c.status === 'pending').length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="dashboard-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <Link to="/" className="sidebar-logo-link">
          <div className="brand-logo-mark small">
            <span className="logo-letter">F</span>
          </div>
          <span className="sidebar-brand-name">Find<span>It</span></span>
        </Link>
        <span className="sidebar-panel-tag">
          {isAdminView ? 'Admin Console' : 'User Portal'}
        </span>
      </div>

      {/* User Info Card */}
      <div className="sidebar-user-card">
        <img
          src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
          alt={currentUser?.name}
          className="sidebar-user-avatar"
        />
        <div className="sidebar-user-meta">
          <span className="sidebar-user-name">{currentUser?.name}</span>
          <span className="sidebar-user-role">
            {currentUser?.role === 'admin' ? 'Administrator' : 'Verified Member'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {isAdminView ? (
          /* Admin Navigation */
          <>
            <div className="sidebar-section-title">Admin Management</div>
            <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">📊</span>
              <span>Overview</span>
            </NavLink>
            <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">👥</span>
              <span>Manage Users</span>
            </NavLink>
            <NavLink to="/admin/items" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">📦</span>
              <span>Manage Items</span>
            </NavLink>
            <NavLink to="/admin/claims" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">⚖️</span>
              <span>Manage Claims</span>
            </NavLink>
            <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">🚨</span>
              <span>Manage Reports</span>
            </NavLink>

            <div className="sidebar-divider" />
            <NavLink to="/dashboard" className="sidebar-link portal-switch">
              <span className="sidebar-icon">👤</span>
              <span>Switch to User View</span>
            </NavLink>
          </>
        ) : (
          /* User Dashboard Navigation */
          <>
            <div className="sidebar-section-title">My Workspace</div>
            <NavLink to="/dashboard" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">📊</span>
              <span>Dashboard Overview</span>
            </NavLink>
            <NavLink to="/dashboard/lost-items" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">🔴</span>
              <span>My Lost Items</span>
            </NavLink>
            <NavLink to="/dashboard/found-items" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">🟢</span>
              <span>My Found Items</span>
            </NavLink>
            <NavLink to="/dashboard/claims" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">📑</span>
              <span>My Claims</span>
            </NavLink>
            <NavLink to="/dashboard/received-claims" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">📥</span>
              <span>Received Claims</span>
              {pendingClaimsCount > 0 && (
                <span className="sidebar-pill">{pendingClaimsCount}</span>
              )}
            </NavLink>

            <div className="sidebar-section-title">Communications</div>
            <NavLink to="/chat" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">💬</span>
              <span>Private Chat</span>
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">🔔</span>
              <span>Notifications</span>
              {unreadNotifs > 0 && (
                <span className="sidebar-pill alert">{unreadNotifs}</span>
              )}
            </NavLink>

            <div className="sidebar-section-title">Settings</div>
            <NavLink to="/dashboard/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon">⚙️</span>
              <span>Profile Settings</span>
            </NavLink>

            {currentUser?.role === 'admin' && (
              <>
                <div className="sidebar-divider" />
                <NavLink to="/admin" className="sidebar-link admin-switch">
                  <span className="sidebar-icon">🛡️</span>
                  <span>Admin Console</span>
                </NavLink>
              </>
            )}
          </>
        )}
      </nav>

      {/* Quick Action & Logout Footer */}
      <div className="sidebar-footer">
        <Link to="/browse" className="sidebar-browse-link">
          ← Back to Public Website
        </Link>
        <button type="button" className="sidebar-logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

