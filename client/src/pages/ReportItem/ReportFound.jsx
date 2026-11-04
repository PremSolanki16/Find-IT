import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/items/ImageUpload';
import { ShieldCheckIcon, PlusIcon, TrashIcon } from '../../components/common/Icons';
import { CATEGORY_LABELS } from '../../utils/formatters';
import { validateRequired } from '../../utils/validators';
import './ReportItem.css';

export const ReportFound = () => {
  const { addItem } = useData();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('accessories');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationDetails, setLocationDetails] = useState('');
  const [eventDate, setEventDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [images, setImages] = useState([]);
  
  // Secret clues kept confidential for ownership verification
  const [privateClues, setPrivateClues] = useState(['']);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddClue = () => {
    setPrivateClues(prev => [...prev, '']);
  };

  const handleClueChange = (index, value) => {
    setPrivateClues(prev => prev.map((c, i) => i === index ? value : c));
  };

  const handleRemoveClue = (index) => {
    setPrivateClues(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs = {};
    const titleErr = validateRequired(title, 'Item Name');
    if (titleErr) errs.title = titleErr;

    const descErr = validateRequired(description, 'Description');
    if (descErr) errs.description = descErr;

    const locErr = validateRequired(locationName, 'Found Location');
    if (locErr) errs.locationName = locErr;

    const dateErr = validateRequired(eventDate, 'Date found');
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
      const filteredClues = privateClues.map(c => c.trim()).filter(Boolean);

      const newItem = addItem({
        type: 'found',
        title: title.trim(),
        category,
        description: description.trim(),
        locationName: locationName.trim(),
        locationDetails: locationDetails.trim(),
        eventDate,
        imageUrls: images,
        privateClues: filteredClues
      });

      setSuccessMessage('Your found item post is now live!');
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
          <div className="report-header found-theme">
            <span className="report-type-badge found">Found Item Report</span>
            <h1 className="report-title">Report a Found Item</h1>
            <p className="report-desc">
              Thank you for being an honest community member! Provide general visual details to help the owner find it, while keeping unique secret marks confidential.
            </p>
          </div>

          {successMessage && (
            <div className="report-success-banner found">
              <span>🎉 {successMessage} Redirecting to listing...</span>
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
              placeholder="e.g. Black Leather Men's Bifold Wallet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              hint="Keep the title general so the claimant must prove ownership"
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

            {/* Public Description */}
            <FormField 
              label="Public Description" 
              htmlFor="description" 
              required 
              error={errors.description}
              hint="Do NOT include secret details like names on cards, engravings, or exact keychain charms."
            >
              <textarea
                id="description"
                rows={3}
                className={`form-textarea ${errors.description ? 'has-error' : ''}`}
                placeholder="Describe visible general appearance without revealing every secret clue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>

            {/* Location & Date */}
            <div className="form-grid-2">
              <Input
                label="Where Did You Find It?"
                id="locationName"
                placeholder="e.g. College Library, 2nd floor"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                error={errors.locationName}
                required
              />

              <Input
                label="Date Found"
                id="eventDate"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                error={errors.eventDate}
                required
              />
            </div>

            <Input
              label="Specific Location Details (Optional)"
              id="locationDetails"
              placeholder="e.g. Left on reading table #14 near south window"
              value={locationDetails}
              onChange={(e) => setLocationDetails(e.target.value)}
            />

            {/* Image Upload */}
            <ImageUpload
              images={images}
              onChange={setImages}
              maxImages={3}
              label="Upload Item Photographs"
              hint="Tip: Crop out private cards or sensitive identification."
            />

            {/* Secret Verification Clues Section */}
            <div className="private-clues-section">
              <div className="clues-header-row">
                <div className="clues-header-text">
                  <div className="clues-title-flex">
                    <ShieldCheckIcon size={18} color="var(--color-primary)" />
                    <h4>Confidential Verification Clues (Private to You & Admins)</h4>
                  </div>
                  <p className="clues-desc">
                    These secret details will NEVER be shown publicly. They allow you to test claimants when they submit ownership proof.
                  </p>
                </div>
              </div>

              <div className="clues-inputs-list">
                {privateClues.map((clue, idx) => (
                  <div key={idx} className="clue-input-row">
                    <input
                      type="text"
                      className="form-input clue-field"
                      placeholder={`Secret Clue ${idx + 1} (e.g. initials "PS" stamped inside, blue transit pass in slot)`}
                      value={clue}
                      onChange={(e) => handleClueChange(idx, e.target.value)}
                    />
                    {privateClues.length > 1 && (
                      <button
                        type="button"
                        className="remove-clue-btn"
                        onClick={() => handleRemoveClue(idx)}
                        aria-label="Remove clue"
                      >
                        <TrashIcon size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="add-clue-btn"
                onClick={handleAddClue}
              >
                <PlusIcon size={14} />
                Add Another Secret Clue
              </button>
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
                variant="primary" 
                size="lg" 
                isLoading={isSubmitting}
              >
                Publish Found Item
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportFound;

