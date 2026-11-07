import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getItemByIdApi, submitClaimApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import VerificationForm from '../../components/claims/VerificationForm';
import StatusBadge from '../../components/common/StatusBadge';
import { MapPinIcon, CalendarIcon, ArrowLeftIcon } from '../../components/common/Icons';
import { formatDate, getCategoryLabel } from '../../utils/formatters';
import './SubmitClaim.css';

export const SubmitClaim = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch the found item from the backend
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await getItemByIdApi(id);
        setItem(response.item);
      } catch (err) {
        setError(err.message || 'Failed to load item.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItem();
  }, [id]);

    if (isLoading) {
    return (
      <div className="container section-py">
        <div className="card item-not-found-card">
          <p>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container section-py">
        <div className="card item-not-found-card">
          <h2>Unable to Load Item</h2>
          <p>{error}</p>
          <Link to="/browse?type=found" className="text-primary">
            ← Browse other found belongings
          </Link>
        </div>
      </div>
    );
  }


  if (!item) {
    return (
      <div className="container section-py">
        <div className="card item-not-found-card">
          <h2>Found Item Not Found</h2>
          <p>The post you are trying to claim may have been removed or resolved.</p>
          <Link to="/browse?type=found" className="text-primary">
            ← Browse other found belongings
          </Link>
        </div>
      </div>
    );
  }

    const finder = item.createdBy || {
    name: 'Campus Finder',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  };

  // Submit the claim to the backend
  const handleClaimSubmit = async (claimPayload) => {
    setIsSubmitting(true);

    try {
      await submitClaimApi(claimPayload);
      setSuccess(true);

      setTimeout(() => {
        navigate('/dashboard/claims');
      }, 1500);
    } catch (err) {
      alert(err.message || 'Error submitting claim.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-claim-page section-py">
      <div className="content-container">
        {/* Breadcrumb */}
        <div className="claim-breadcrumb">
          <Link to={`/items/${item._id}`} className="claim-back-link">
            <ArrowLeftIcon size={16} />
            <span>Back to Item Post</span>
          </Link>
        </div>

        <div className="card submit-claim-card">
          <div className="submit-claim-header">
            <span className="claim-intent-badge">Ownership Claim Submission</span>
            <h1 className="submit-claim-title">Claim This Found Item</h1>
            <p className="submit-claim-sub">
              To verify that this item belongs to you, answer the questions below as accurately as possible. The finder will review your responses.
            </p>
          </div>

          {success && (
            <div className="claim-success-alert">
              <span>🎉 Your claim has been submitted! Redirecting to your claims dashboard...</span>
            </div>
          )}

          {/* Item Context Summary Card */}
          <div className="claim-item-summary card">
            <img
              src={(item.imageUrls && item.imageUrls[0]) || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=200&q=80'}
              alt={item.title}
              className="summary-thumb"
            />
            <div className="summary-info">
              <div className="summary-top-row">
                <StatusBadge type="found" size="sm" />
                <span className="summary-cat">{getCategoryLabel(item.category)}</span>
              </div>
              <h3 className="summary-title">{item.title}</h3>
              <div className="summary-meta-row">
                <span><MapPinIcon size={12} /> {item.locationName}</span>
                <span><CalendarIcon size={12} /> Found {formatDate(item.eventDate)}</span>
              </div>
              <div className="summary-finder-note">
                Posted by <strong>{finder.name}</strong>
              </div>
            </div>
          </div>

          {/* Verification Questionnaire */}
          <VerificationForm
            item={item}
            onSubmit={handleClaimSubmit}
            onCancel={() => navigate(-1)}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default SubmitClaim;

