import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getItemByIdApi } from '../../services/api';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import { 
  MapPinIcon, 
  CalendarIcon, 
  ShieldCheckIcon, 
  GiftIcon, 
  ArrowLeftIcon,
  AlertCircleIcon
} from '../../components/common/Icons';
import { formatDate, getCategoryLabel, getCategoryIcon } from '../../utils/formatters';
import './ItemDetails.css';

export const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { claims, submitReport } = useData();
  const { currentUser, isAuthenticated } = useAuth();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('spam');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  // Store the item fetched from the backend
const [item, setItem] = useState(null);

// Track whether the item is still loading
const [isLoading, setIsLoading] = useState(true);

// Store any error while fetching the item
const [itemError, setItemError] = useState('');

// Fetch the requested item from the backend
useEffect(() => {
  const fetchItem = async () => {
    try {
      const response = await getItemByIdApi(id);
      setItem(response.item);
    } catch (error) {
      setItemError(error.message || 'Failed to load item.');
    } finally {
      setIsLoading(false);
    }
  };

  fetchItem();
}, [id]);

  if (isLoading) {
    return <div className="container section-py">Loading item...</div>;
  }

if (!item) {
    return (
      <div className="container section-py">
        <div className="card item-not-found-card">
          <h2>Item Not Found</h2>
          <p>The requested lost or found post may have been removed or does not exist.</p>
          <Link to="/browse">
            <Button variant="primary">Return to Browse Items</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get the poster details from the backend item
const poster = item.createdBy || {
    name: 'Campus Member',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: null
};

  const images = (item.imageUrls && item.imageUrls.length > 0)
    ? item.imageUrls
    : ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'];

  // Check whether the logged-in user created this item
const isMyPost = currentUser?._id === item.createdBy?._id;

// Check if current user already claimed this found item
  const existingClaim = claims.find(c => c.itemId === item._id && c.claimantId === currentUser?._id);

  const handleClaimClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/claims/${item._id}`);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    submitReport({
      targetType: 'item',
      itemId: item._id,
      reason: reportReason,
      details: reportDetails
    });
    setReportSuccess(true);
    setTimeout(() => {
      setReportModalOpen(false);
      setReportSuccess(false);
      setReportDetails('');
    }, 1500);
  };

  return (
    <div className="item-details-page section-py">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div className="details-breadcrumb">
          <Link to="/browse" className="breadcrumb-back">
            <ArrowLeftIcon size={16} />
            <span>Back to All Listings</span>
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{item.title}</span>
        </div>

        <div className="details-main-grid">
          {/* Left Column: Gallery */}
          <div className="details-gallery-col">
            <div className="gallery-primary-wrap">
              <img
                src={images[activeImageIndex]}
                alt={item.title}
                className="gallery-primary-img"
              />
              <div className="gallery-badges">
                <StatusBadge type={item.type} size="md" />
                <StatusBadge status={item.status} size="md" />
              </div>
            </div>

            {images.length > 1 && (
              <div className="gallery-thumbnails-row">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Safety Reminder Box */}
            <div className="safety-advice-card card">
              <div className="safety-card-header">
                <ShieldCheckIcon size={20} color="var(--color-primary)" />
                <h4>FindIt Handover Safety Policy</h4>
              </div>
              <ul className="safety-points">
                <li>Never share private financial info or wire money.</li>
                <li>Conduct returns inside well-lit campus reception areas or security desks.</li>
                <li>Verify distinguishing clues carefully before handing items over.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="details-info-col">
            <div className="details-meta-header">
              <div className="category-pill">
                <span>{getCategoryIcon(item.category)}</span>
                <span>{getCategoryLabel(item.category)}</span>
              </div>
              <span className="post-date-tag">
                Reported {formatDate(item.createdAt)}
              </span>
            </div>

            <h1 className="details-item-title">{item.title}</h1>

            {item.isRewardOffered && (
              <div className="reward-callout-card">
                <GiftIcon size={20} color="#b45309" />
                <div>
                  <strong>Reward Offered:</strong> {item.rewardDetails || "Owner offers a reward for return"}
                </div>
              </div>
            )}

            {/* Location & Event Date Cards */}
            <div className="meta-info-grid">
              <div className="meta-box">
                <MapPinIcon size={18} color="var(--color-primary)" />
                <div className="meta-box-text">
                  <span className="meta-box-label">{item.type === 'lost' ? 'Last Seen At' : 'Found Location'}</span>
                  <span className="meta-box-val">{item.locationName}</span>
                  {item.locationDetails && (
                    <span className="meta-box-sub">{item.locationDetails}</span>
                  )}
                </div>
              </div>

              <div className="meta-box">
                <CalendarIcon size={18} color="var(--color-primary)" />
                <div className="meta-box-text">
                  <span className="meta-box-label">{item.type === 'lost' ? 'Date Lost' : 'Date Found'}</span>
                  <span className="meta-box-val">{formatDate(item.eventDate)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="details-description-section">
              <h3 className="section-sub-title">Public Description</h3>
              <p className="details-desc-paragraph">{item.description}</p>
            </div>

            {/* Poster Card */}
            <div className="details-poster-card card">
              <span className="poster-subheading">Posted by</span>
              <div className="poster-profile-row">
                <img src={poster.avatarUrl} alt={poster.name} className="poster-avatar" />
                <div className="poster-meta">
                  <span className="poster-name">{poster.name}</span>
                  <span className="poster-member-since">Active since {formatDate(poster.createdAt)}</span>
                </div>
                <span className="verified-poster-tag">✓ Verified User</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="details-action-cta-area">
              {item.type === 'found' ? (
                /* Found Item Action */
                <>
                  {item.status === 'open' ? (
                    isMyPost ? (
                      <div className="my-post-notice">
                        <span>This is your found item post. You can review incoming claims in your dashboard.</span>
                        <Link to="/dashboard/received-claims">
                          <Button variant="outline">View Received Claims</Button>
                        </Link>
                      </div>
                    ) : existingClaim ? (
                      <div className="already-claimed-notice">
                        <span>You submitted an ownership claim for this item (Status: <strong>{existingClaim.status}</strong>).</span>
                        <Link to="/dashboard/claims">
                          <Button variant="primary">Track Claim Status</Button>
                        </Link>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={handleClaimClick}
                        icon={<ShieldCheckIcon size={20} />}
                      >
                        Claim This Item (Prove Ownership)
                      </Button>
                    )
                  ) : item.status === 'returned' ? (
                    <div className="returned-item-banner">
                      ✓ This item has already been successfully returned to its rightful owner.
                    </div>
                  ) : (
                    <div className="pending-item-banner">
                      ⏳ This found item currently has an ownership claim under review.
                    </div>
                  )}
                </>
              ) : (
                /* Lost Item Action */
                <div className="lost-item-help-card">
                  <div className="lost-help-icon">💡</div>
                  <div>
                    <h4>Have you found this item?</h4>
                    <p>
                      If you discovered this item, please submit a found report or notify campus security so the owner can be reunited with it.
                    </p>
                    <Link to="/report/found">
                      <Button variant="success" size="md">I Found This Item</Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Report Suspicious Post */}
              <div className="report-flag-row">
                <button
                  type="button"
                  className="report-flag-btn"
                  onClick={() => setReportModalOpen(true)}
                >
                  <AlertCircleIcon size={14} />
                  Report suspicious or inappropriate post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <Modal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        title="Report Item Post"
        size="sm"
      >
        {reportSuccess ? (
          <div className="report-success-box">
            <span className="success-icon">✓</span>
            <h4>Report Submitted</h4>
            <p>Our campus moderation team will review this listing shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit}>
            <FormField label="Reason for Reporting" htmlFor="reportReason" required>
              <select
                id="reportReason"
                className="form-select"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="spam">Spam or Duplicate Post</option>
                <option value="scam">Scam / Fraudulent Reward Request</option>
                <option value="inappropriate">Inappropriate or Offensive Content</option>
                <option value="harassment">Harassment or Doxxing</option>
                <option value="other">Other Campus Violation</option>
              </select>
            </FormField>

            <FormField label="Additional Details (Optional)" htmlFor="reportDetails">
              <textarea
                id="reportDetails"
                rows={3}
                className="form-textarea"
                placeholder="Explain why this post should be reviewed by admins..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
              />
            </FormField>

            <div className="modal-actions-right">
              <Button variant="outline" type="button" onClick={() => setReportModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" type="submit">
                Submit Report
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ItemDetails;

