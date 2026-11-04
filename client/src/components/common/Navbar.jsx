import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { BellIcon, MenuIcon, XIcon, PlusIcon, UserIcon } from './Icons';
import Button from './Button';
import './Navbar.css';

export const Navbar = () => {
  const { currentUser, isAuthenticated, isAdmin, logout, availableUsers, switchUser } = useAuth();
  const { notifications } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoSwitchOpen, setDemoSwitchOpen] = useState(false);
  const navigate = useNavigate();

  // Calculate unread notifications for current user
  const unreadCount = currentUser 
    ? notifications.filter(n => n.recipientId === currentUser._id && !n.isRead).length 
    : 0;

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <>
      {/* Top Demo Bar for Reviewers to switch between Guest, Normal Users, and Admin */}
      <div className="demo-role-banner">
        <div className="container demo-banner-content">
          <span className="demo-badge">Interactive Demo Mode</span>
          <div className="demo-role-selector">
            <span className="demo-label">Active Role:</span>
            <select
              className="demo-select"
              value={currentUser ? currentUser._id : 'guest'}
              onChange={(e) => {
                const val = e.target.value;
                switchUser(val === 'guest' ? null : val);
              }}
            >
              <option value="usr_001">Prem Solanki (Standard User)</option>
              <option value="usr_002">Priya Sharma (Finder / User)</option>
              <option value="usr_admin">Sarah Jenkins (Platform Admin)</option>
              <option value="guest">Guest (Logged Out)</option>
            </select>
          </div>
        </div>
      </div>

      <header className="navbar-header">
        <div className="container navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-brand" onClick={closeMenus}>
            <div className="brand-logo-mark">
              <span className="logo-letter">F</span>
              <span className="logo-radar"></span>
            </div>
            <div className="brand-text">
              Find<span className="brand-accent">It</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="navbar-nav desktop-nav">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/browse" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Browse Items
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Dashboard
                </NavLink>
                <NavLink to="/chat" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  Messages
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className={({ isActive }) => `nav-link admin-nav-link ${isActive ? 'active' : ''}`}>
                    Admin Panel
                  </NavLink>
                )}
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="navbar-actions desktop-actions">
            {!isAuthenticated ? (
              /* Guest Actions */
              <div className="guest-action-group">
                <Link to="/login">
                  <Button variant="ghost" size="md">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="md">Sign Up</Button>
                </Link>
              </div>
            ) : (
              /* Logged In User Actions */
              <div className="user-action-group">
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

                {/* Notifications Bell */}
                <Link to="/notifications" className="nav-icon-btn" aria-label="Notifications">
                  <BellIcon size={20} />
                  {unreadCount > 0 && (
                    <span className="nav-notification-badge">{unreadCount}</span>
                  )}
                </Link>

                {/* User Profile Dropdown Trigger */}
                <div className="profile-menu-container">
                  <button
                    type="button"
                    className="profile-avatar-btn"
                    onClick={() => setProfileDropdownOpen(prev => !prev)}
                    aria-label="User profile menu"
                  >
                    <img 
                      src={currentUser?.avatarUrl} 
                      alt={currentUser?.name} 
                      className="profile-avatar-img"
                    />
                    <span className="profile-name-short">{currentUser?.name.split(' ')[0]}</span>
                    <span className="dropdown-chevron">▼</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="profile-dropdown-card">
                      <div className="dropdown-user-info">
                        <div className="dropdown-user-name">{currentUser?.name}</div>
                        <div className="dropdown-user-email">{currentUser?.email}</div>
                        <span className={`dropdown-role-tag ${currentUser?.role}`}>
                          {currentUser?.role === 'admin' ? 'Administrator' : 'Verified Member'}
                        </span>
                      </div>

                      <div className="dropdown-divider" />

                      <Link 
                        to="/dashboard" 
                        className="dropdown-item" 
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Dashboard Overview
                      </Link>
                      <Link 
                        to="/dashboard/lost-items" 
                        className="dropdown-item" 
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Lost Items
                      </Link>
                      <Link 
                        to="/dashboard/found-items" 
                        className="dropdown-item" 
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Found Items
                      </Link>
                      <Link 
                        to="/dashboard/claims" 
                        className="dropdown-item" 
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Claims
                      </Link>
                      <Link 
                        to="/dashboard/received-claims" 
                        className="dropdown-item" 
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Received Claims
                      </Link>
                      <Link 
                        to="/dashboard/profile" 
                        className="dropdown-item" 
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Profile Settings
                      </Link>

                      {isAdmin && (
                        <>
                          <div className="dropdown-divider" />
                          <Link 
                            to="/admin" 
                            className="dropdown-item admin-item" 
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            Admin Console
                          </Link>
                        </>
                      )}

                      <div className="dropdown-divider" />

                      <button 
                        type="button" 
                        className="dropdown-item logout-item"
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-menu-drawer">
            <nav className="mobile-nav-links">
              <NavLink 
                to="/" 
                end 
                className="mobile-nav-item"
                onClick={closeMenus}
              >
                Home
              </NavLink>
              <NavLink 
                to="/browse" 
                className="mobile-nav-item"
                onClick={closeMenus}
              >
                Browse Items
              </NavLink>

              {isAuthenticated ? (
                <>
                  <NavLink 
                    to="/dashboard" 
                    className="mobile-nav-item"
                    onClick={closeMenus}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink 
                    to="/chat" 
                    className="mobile-nav-item"
                    onClick={closeMenus}
                  >
                    Messages
                  </NavLink>
                  <NavLink 
                    to="/notifications" 
                    className="mobile-nav-item"
                    onClick={closeMenus}
                  >
                    Notifications ({unreadCount})
                  </NavLink>
                  {isAdmin && (
                    <NavLink 
                      to="/admin" 
                      className="mobile-nav-item admin-item"
                      onClick={closeMenus}
                    >
                      Admin Panel
                    </NavLink>
                  )}

                  <div className="mobile-nav-divider" />

                  <div className="mobile-cta-group">
                    <Link to="/report/lost" onClick={closeMenus} className="w-full">
                      <Button variant="outline" fullWidth icon={<PlusIcon size={16} />}>
                        Report Lost Item
                      </Button>
                    </Link>
                    <Link to="/report/found" onClick={closeMenus} className="w-full">
                      <Button variant="primary" fullWidth icon={<PlusIcon size={16} />}>
                        Report Found Item
                      </Button>
                    </Link>
                  </div>

                  <div className="mobile-nav-divider" />

                  <div className="mobile-user-profile">
                    <img 
                      src={currentUser?.avatarUrl} 
                      alt={currentUser?.name} 
                      className="mobile-avatar"
                    />
                    <div>
                      <div className="mobile-username">{currentUser?.name}</div>
                      <div className="mobile-email">{currentUser?.email}</div>
                    </div>
                  </div>

                  <Button variant="ghost" fullWidth onClick={handleLogout} className="mobile-logout-btn">
                    Log Out
                  </Button>
                </>
              ) : (
                <div className="mobile-cta-group">
                  <Link to="/login" onClick={closeMenus} className="w-full">
                    <Button variant="outline" fullWidth>Log In</Button>
                  </Link>
                  <Link to="/signup" onClick={closeMenus} className="w-full">
                    <Button variant="primary" fullWidth>Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;

