
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import {
  updateProfileApi,
  uploadProfileImageApi
} from '../../services/api';
import { formatDate } from '../../utils/formatters';
import './DashboardPages.css';

export const ProfileInfo = () => {
  const { currentUser, updateCurrentUser } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    currentUser?.avatarUrl || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  // Create and clean up the selected image preview
  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(currentUser?.avatarUrl || '');
      return;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImage, currentUser?.avatarUrl]);

  // Select and validate a profile image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    setError('');
    setUploadSuccess(false);

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must not exceed 5 MB.');
      e.target.value = '';
      return;
    }

    setSelectedImage(file);
  };

  // Upload the selected profile image to Cloudinary
  const handleImageUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    setError('');
    setUploadSuccess(false);

    try {
      const response = await uploadProfileImageApi(selectedImage);

      updateCurrentUser({
        avatarUrl: response.avatarUrl
      });

      setSelectedImage(null);
      setUploadSuccess(true);

    } catch (err) {
      setError(err.message || 'Failed to upload profile picture.');
    } finally {
      setIsUploading(false);
    }
  };

  // Save the updated profile name to MongoDB
  const handleSave = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setIsSaving(true);
    setError('');
    setSavedSuccess(false);

    try {
      const response = await updateProfileApi(name.trim());

      updateCurrentUser({
        name: response.user.name
      });

      setName(response.user.name);
      setSavedSuccess(true);

    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
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
              src={imagePreview || '/default-avatar.png'}
              alt={currentUser?.name || 'Profile'}
              className="profile-large-avatar"
            />

            <div className="profile-top-meta">
              <h3 className="profile-card-name">{currentUser?.name}</h3>
              <span className="profile-card-email">{currentUser?.email}</span>

              <div className="profile-badges-row">
                <StatusBadge
                  status={currentUser?.accountStatus || 'active'}
                  size="sm"
                />
                <span className="profile-role-badge">
                  {currentUser?.role === 'admin'
                    ? 'Administrator'
                    : 'Verified Member'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-details-list">
            <div className="profile-detail-row">
              <span className="detail-label">Member Since</span>
              <span className="detail-val">
                {formatDate(currentUser?.createdAt)}
              </span>
            </div>

            <div className="profile-detail-row">
              <span className="detail-label">User Identifier</span>
              <span className="detail-val font-mono">
                {currentUser?._id}
              </span>
            </div>

            <div className="profile-detail-row">
              <span className="detail-label">Security Role</span>
              <span className="detail-val capitalize">
                {currentUser?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form Card */}
        <div className="card profile-edit-card">
          <h3 className="edit-form-heading">Edit Profile Details</h3>
          <p className="edit-form-sub">
            Update your public display name and profile picture.
          </p>

          {(savedSuccess || uploadSuccess) && (
            <div className="profile-success-alert">
              ✓ {savedSuccess
                ? 'Profile information updated successfully!'
                : 'Profile picture uploaded successfully!'}
            </div>
          )}

          {error && (
            <div className="auth-alert error">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Profile Picture Upload */}
          <div className="profile-image-upload-section">
            <label className="input-label">Profile Picture</label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />

            <div className="profile-image-upload-row">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Choose Photo
              </Button>

              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleImageUpload}
                disabled={!selectedImage}
                isLoading={isUploading}
              >
                Upload Photo
              </Button>
            </div>

            <p className="input-hint-msg">
              Select an image from your device. Maximum size: 5 MB.
            </p>
          </div>

          <form onSubmit={handleSave}>
            <Input
              label="Full Name"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSavedSuccess(false);
              }}
              required
            />

            <Input
              label="Email Address"
              id="email"
              value={currentUser?.email || ''}
              disabled
              hint="Email address is tied to your institutional authentication."
            />

            <div className="profile-submit-row">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
              >
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
