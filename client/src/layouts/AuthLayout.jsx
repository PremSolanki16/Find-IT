import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon } from '../components/common/Icons';
import './AuthLayout.css';

export const AuthLayout = () => {
  return (
    <div className="auth-layout-root">
      {/* Top back navigation */}
      <div className="auth-top-bar">
        <Link to="/" className="auth-back-link">
          <ArrowLeftIcon size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="auth-container-grid">
        {/* Left Informational Showcase */}
        <div className="auth-showcase-panel">
          <div className="auth-showcase-content">
            <Link to="/" className="auth-brand">
              <div className="brand-logo-mark">
                <span className="logo-letter">F</span>
              </div>
              <span className="auth-brand-name">Find<span>It</span></span>
            </Link>

            <h2 className="showcase-title">
              Reconnecting lost items with their rightful owners.
            </h2>
            <p className="showcase-subtitle">
              Join thousands of students, faculty, and campus members who rely on FindIt for safe, honest lost-and-found recovery.
            </p>

            <div className="showcase-features">
              <div className="feature-item">
                <div className="feature-icon-badge">✓</div>
                <div>
                  <strong>Confidential Verification</strong>
                  <p>Secret clues stay hidden from public view until proven.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-badge">✓</div>
                <div>
                  <strong>Private Direct Chat</strong>
                  <p>Coordinate return time and place safely without sharing phone numbers.</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon-badge">✓</div>
                <div>
                  <strong>Campus Community First</strong>
                  <p>Tailored for universities, libraries, and public institutions.</p>
                </div>
              </div>
            </div>

            <div className="auth-showcase-footer">
              <ShieldCheckIcon size={18} color="#93c5fd" />
              <span>Built with modern privacy and safety standards</span>
            </div>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="auth-form-panel">
          <div className="auth-form-card">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

