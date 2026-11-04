import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import './DashboardPages.css';

export const ProfileInfo = () => {
  const { currentUser } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (currentUser) {
      currentUser.name = name;
      currentUser.avatarUrl = avatarUrl;
      localStorage.setItem('findit_current_user', JSON.stringify(currentUser));
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="dash-subpage">
      <div className="subpage-header">
        <div>
          <h2 className="subpage-title">Profile & Preferences</h2>
          <p className="subpage-desc">
            Manage your campus profile information, contact preferences, and verified status.
          </p>
        </div>
      </div>

      <div className="profile-layout-grid">
        {/* Profile Card */}
        <div className="card profile-overview-card">
          <div className="profile-card-top">
            <img
              src={avatarUrl || currentUser?.avatarUrl}
              alt={currentUser?.name}
              className="profile-large-avatar"
            />
            <div className="profile-top-meta">
              <h3 className="profile-card-name">{currentUser?.name}</h3>
              <span className="profile-card-email">{currentUser?.email}</span>
              <div className="profile-badges-row">
                <StatusBadge status={currentUser?.accountStatus || 'active'} size="sm" />
                <span className="profile-role-badge">
                  {currentUser?.role === 'admin' ? 'Administrator' : 'Verified Member'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-details-list">
            <div className="profile-detail-row">
              <span className="detail-label">Member Since</span>
              <span className="detail-val">{formatDate(currentUser?.createdAt)}</span>
            </div>
            <div className="profile-detail-row">
              <span className="detail-label">User Identifier</span>
              <span className="detail-val font-mono">{currentUser?._id}</span>
            </div>
            <div className="profile-detail-row">
              <span className="detail-label">Security Role</span>
              <span className="detail-val capitalize">{currentUser?.role}</span>
            </div>
          </div>
        </div>

        {/* Edit Form Card */}
        <div className="card profile-edit-card">
          <h3 className="edit-form-heading">Edit Profile Details</h3>
          <p className="edit-form-sub">
            Update your public display name and avatar photo URL.
          </p>

          {savedSuccess && (
            <div className="profile-success-alert">
              ✓ Profile information updated successfully!
            </div>
          )}

          <form onSubmit={handleSave}>
            <Input
              label="Full Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              id="email"
              value={currentUser?.email}
              disabled
              hint="Email address is tied to your institutional authentication."
            />

            <Input
              label="Avatar Image URL"
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              hint="Paste an image URL from Unsplash or other image host."
            />

            <div className="profile-submit-row">
              <Button type="submit" variant="primary" size="md">
                Save Profile Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

