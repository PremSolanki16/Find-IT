import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import ClaimCard from '../../components/claims/ClaimCard';
import EmptyState from '../../components/common/EmptyState';
import './DashboardPages.css';

export const MyClaims = () => {
  const { currentUser, availableUsers } = useAuth();
  const { items, claims, updateClaimStatus } = useData();
  const navigate = useNavigate();

  const myClaims = claims.filter(c => c.claimantId === currentUser?._id);

  return (
    <div className="dash-subpage">
      <div className="subpage-header">
        <div>
          <h2 className="subpage-title">My Ownership Claims</h2>
          <p className="subpage-desc">
            Track claims you submitted for items posted by finders, view approval status, and chat to arrange collection.
          </p>
        </div>
        <Link to="/browse?type=found" className="dash-link-action">
          Browse Found Items to Claim →
        </Link>
      </div>

      {myClaims.length === 0 ? (
        <EmptyState
          icon="📑"
          title="No Submitted Claims"
          message="You haven't submitted any ownership claims yet. If you see an item that matches what you lost, you can submit a claim on its page."
          actionText="Browse Found Items"
          onAction={() => navigate('/browse?type=found')}
        />
      ) : (
        <div className="dash-cards-list">
          {myClaims.map((claim) => {
            const item = items.find(i => i._id === claim.itemId);
            const finder = availableUsers.find(u => u._id === item?.createdBy);
            return (
              <ClaimCard
                key={claim._id}
                claim={claim}
                item={item}
                finder={finder}
                isFinderView={false}
                onCancel={(id) => updateClaimStatus(id, 'cancelled')}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyClaims;

