import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { MapPinIcon, CalendarIcon, MessageSquareIcon, CheckIcon, XIcon } from '../common/Icons';
import { formatDate } from '../../utils/formatters';
import './ClaimCard.css';

export const ClaimCard = ({
  claim,
  item,
  claimant,
  finder,
  isFinderView = false, // true = Received claims (I am finder), false = My claims (I am claimant)
  onAccept,
  onReject,
  onComplete,
  onCancel
}) => {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [expandedAnswers, setExpandedAnswers] = useState(false);
  const navigate = useNavigate();

  if (!claim) return null;

  const itemImage = (item?.imageUrls && item.imageUrls[0]) || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80';

  const handleConfirmReject = () => {
    if (onReject) {
      onReject(claim._id, rejectReason);
    }
    setShowRejectDialog(false);
  };

  const handleConfirmCancel = () => {
    if (onCancel) {
      onCancel(claim._id);
    }
    setShowCancelDialog(false);
  };

  return (
    <div className="claim-card card">
      {/* Top Banner / Status */}
      <div className="claim-card-top">
        <div className="claim-id-wrap">
          <span className="claim-id-label">Claim Reference:</span>
          <span className="claim-id-val">{claim._id}</span>
        </div>
        <StatusBadge status={claim.status} size="md" />
      </div>

      <div className="claim-card-grid">
        {/* Item Column */}
        <div className="claim-item-section">
          <div className="claim-item-thumb-wrap">
            <img src={itemImage} alt={item?.title || 'Found item'} className="claim-item-thumb" />
          </div>

          <div className="claim-item-info">
            <span className="claim-found-label">Found Item</span>
            <h4 className="claim-item-title">
              {item ? (
                <Link to={`/items/${item._id}`}>{item.title}</Link>
              ) : (
                'Item details unavailable'
              )}
            </h4>
            <div className="claim-item-meta">
              <span className="meta-bit">
                <MapPinIcon size={12} color="var(--color-text-muted)" />
                {item?.locationName || 'Campus'}
              </span>
              <span className="meta-bit">
                <CalendarIcon size={12} color="var(--color-text-muted)" />
                Claimed on {formatDate(claim.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Counterpart Profile Column */}
        <div className="claim-counterpart-section">
          <span className="section-subhead">
            {isFinderView ? 'Claimant (Believes it is theirs)' : 'Item Posted By'}
          </span>
          <div className="user-mini-badge">
            <img 
              src={(isFinderView ? claimant?.avatarUrl : finder?.avatarUrl) || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} 
              alt="User" 
              className="user-mini-avatar"
            />
            <div className="user-mini-names">
              <span className="user-display-name">
                {isFinderView ? (claimant?.name || 'Verified Claimant') : (finder?.name || 'Finder')}
              </span>
              <span className="user-email-display">
                {isFinderView ? (claimant?.email || 'Student') : (finder?.email || 'Campus Member')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Answers */}
      <div className="claim-answers-container">
        <div className="answers-toggle-row">
          <span className="answers-heading">
            Submitted Proof of Ownership ({claim.answers?.length || 0} Questions Answered)
          </span>
          <button
            type="button"
            className="answers-toggle-btn"
            onClick={() => setExpandedAnswers(prev => !prev)}
          >
            {expandedAnswers ? 'Hide Answers ▲' : 'Review Answers ▼'}
          </button>
        </div>

        {expandedAnswers && (
          <div className="answers-list">
            {claim.answers && claim.answers.length > 0 ? (
              claim.answers.map((ans, idx) => (
                <div key={idx} className="qa-block">
                  <div className="qa-question">
                    <strong>Q{idx + 1}:</strong> {ans.question}
                  </div>
                  <div className="qa-answer">
                    <strong>Claimant Response:</strong> "{ans.answer}"
                  </div>
                </div>
              ))
            ) : (
              <p className="no-answers-note">No additional written verification provided.</p>
            )}

            {claim.reviewNote && (
              <div className="review-note-box">
                <strong>Review Note from Finder:</strong> {claim.reviewNote}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="claim-card-actions">
        {isFinderView ? (
          /* Finder Reviewing Received Claim */
          <>
            {claim.status === 'pending' && (
              <div className="action-buttons-wrap">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowRejectDialog(true)}
                  icon={<XIcon size={14} />}
                >
                  Reject Claim
                </Button>
                <Button 
                  variant="success" 
                  size="sm" 
                  onClick={() => onAccept(claim._id)}
                  icon={<CheckIcon size={14} />}
                >
                  Accept & Open Chat
                </Button>
              </div>
            )}

            {claim.status === 'accepted' && (
              <div className="action-buttons-wrap">
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => navigate('/chat')}
                  icon={<MessageSquareIcon size={14} />}
                >
                  Coordinate Handover in Chat
                </Button>
                <Button 
                  variant="success" 
                  size="sm" 
                  onClick={() => onComplete(claim._id)}
                  icon={<CheckIcon size={14} />}
                >
                  Mark Item Returned
                </Button>
              </div>
            )}

            {claim.status === 'completed' && (
              <span className="completed-label-badge">
                ✓ Handover marked completed. Item archived.
              </span>
            )}
          </>
        ) : (
          /* Claimant View of their own claim */
          <>
            {claim.status === 'pending' && (
              <div className="action-buttons-wrap">
                <span className="pending-wait-text">
                  Waiting for finder to review your verification details...
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCancelDialog(true)}
                >
                  Withdraw Claim
                </Button>
              </div>
            )}

            {claim.status === 'accepted' && (
              <div className="action-buttons-wrap">
                <span className="accepted-ready-text">
                  🎉 Your claim was accepted!
                </span>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => navigate('/chat')}
                  icon={<MessageSquareIcon size={14} />}
                >
                  Chat with Finder
                </Button>
              </div>
            )}

            {claim.status === 'completed' && (
              <span className="completed-label-badge">
                ✓ You successfully received your item back.
              </span>
            )}

            {claim.status === 'rejected' && (
              <span className="rejected-label-badge">
                This claim was declined by the finder.
              </span>
            )}
          </>
        )}
      </div>


      {/* Reject Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showRejectDialog}
        title="Reject Ownership Claim"
        message="Are you sure the claimant's answers do not match the item? The claimant will be notified that their claim was declined."
        confirmText="Decline Claim"
        confirmVariant="danger"
        onConfirm={handleConfirmReject}
        onCancel={() => setShowRejectDialog(false)}
      >
        <div style={{ marginTop: '16px' }}>
          <label htmlFor="rejectReason">
            Review Note (Optional)
          </label>

          <textarea
            id="rejectReason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explain why this claim is being rejected..."
            rows={3}
            style={{
              width: '100%',
              minHeight: '90px',
              resize: 'vertical',
              boxSizing: 'border-box',
              marginTop: '8px',
              padding: '10px',
              fontSize: '14px'
            }}
          />
        </div>
      </ConfirmationDialog>

      {/* Cancel Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showCancelDialog}
        title="Withdraw Ownership Claim"
        message="Are you sure you want to withdraw this claim? You will not be able to coordinate with the finder under this claim."
        confirmText="Withdraw Claim"
        confirmVariant="danger"
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelDialog(false)}
      />
    </div>
  );
};

export default ClaimCard;

