import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/items/ImageUpload';
import { CATEGORY_LABELS } from '../../utils/formatters';
import { validateRequired } from '../../utils/validators';
import './ReportItem.css';

export const ReportLost = () => {
  const { addItem } = useData();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('electronics');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [eventDate, setEventDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [images, setImages] = useState([]);
  const [isRewardOffered, setIsRewardOffered] = useState(false);
  const [rewardDetails, setRewardDetails] = useState('');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const errs = {};
    const titleErr = validateRequired(title, 'Item Name');
    if (titleErr) errs.title = titleErr;

    const descErr = validateRequired(description, 'Description');
    if (descErr) errs.description = descErr;

    const locErr = validateRequired(locationName, 'Last seen location');
    if (locErr) errs.locationName = locErr;

    const dateErr = validateRequired(eventDate, 'Date lost');
    if (dateErr) errs.eventDate = dateErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const newItem = addItem({
        type: 'lost',
        title: title.trim(),
        category,
        description: description.trim(),
        locationName: locationName.trim(),
        locationDetails: locationDetails.trim(),
        eventDate,
        imageUrls: images,
        isRewardOffered,
        rewardDetails: isRewardOffered ? rewardDetails.trim() : ''
      });

      setSuccessMessage('Your lost item report has been published!');
      setTimeout(() => {
        navigate(`/items/${newItem._id}`);
      }, 1200);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to submit post.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-item-page section-py">
      <div className="content-container">
        <div className="report-card card">
          <div className="report-header lost-theme">
            <span className="report-type-badge lost">Lost Item Report</span>
            <h1 className="report-title">Report a Lost Belonging</h1>
            <p className="report-desc">
              Provide thorough details so campus finders can quickly identify and return your missing belongings.
            </p>
          </div>

          {successMessage && (
            <div className="report-success-banner">
              <span>🎉 {successMessage} Redirecting to your listing...</span>
            </div>
          )}

          {errors.form && (
            <div className="auth-alert error">
              <span>⚠️ {errors.form}</span>
            </div>
          )}

          <form className="report-form" onSubmit={handleSubmit}>
            {/* Title */}
            <Input
              label="Item Name / Headline"
              id="title"
              placeholder="e.g. Silver 13-inch MacBook Air M2 in grey sleeve"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              hint="Be descriptive and include brand, model or color"
              required
            />

            {/* Category */}
            <FormField label="Item Category" htmlFor="category" required>
              <select
                id="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </FormField>

            {/* Description */}
            <FormField 
              label="Public Description" 
              htmlFor="description" 
              required 
              error={errors.description}
              hint="Describe physical appearance, markings, and condition."
            >
              <textarea
                id="description"
                rows={4}
                className={`form-textarea ${errors.description ? 'has-error' : ''}`}
                placeholder="Give helpful public visual characteristics..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>

            {/* Location & Date Row */}
            <div className="form-grid-2">
              <Input
                label="Last Seen Location / Facility"
                id="locationName"
                placeholder="e.g. Student Center Cafeteria"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                error={errors.locationName}
                required
              />

              <Input
                label="Date Lost"
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                error={errors.eventDate}
                required
              />
            </div>

            <Input
              label="Specific Spot or Landmark (Optional)"
              id="locationDetails"
              placeholder="e.g. Table near the juice counter, 2nd floor booth"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
            />

            {/* Image Upload */}
            <ImageUpload
              images={images}
              onChange={setImages}
              maxImages={3}
              label="Photographs of the Lost Item (or similar model)"
              hint="Upload clear photos to help people recognize your item."
            />

            {/* Reward Information */}
            <div className="reward-toggle-box">
              <label className="reward-checkbox-row">
                <input
                  type="checkbox"
                  checked={isRewardOffered}
                  onChange={(e) => setIsRewardOffered(e.target.checked)}
                />
                <span className="reward-checkbox-label">
                  🎁 Offer a cash reward or token of appreciation upon return
                </span>
              </label>

              {isRewardOffered && (
                <div className="reward-input-wrap">
                  <Input
                    label="Reward Details"
                    placeholder="e.g. $50 cash reward or free lunch voucher upon safe handover"
                    value={rewardDetails}
                    onChange={(e) => setRewardDetails(e.target.value)}
                    hint="Rewards encourage honest handovers across campus."
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="form-actions-row">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button 
                type="submit" 
                variant="danger" 
                size="lg" 
                isLoading={isSubmitting}
              >
                Publish Lost Report
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportLost;

