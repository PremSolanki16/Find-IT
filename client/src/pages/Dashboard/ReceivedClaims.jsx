import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import ClaimCard from '../../components/claims/ClaimCard';
import EmptyState from '../../components/common/EmptyState';
import './DashboardPages.css';

export const ReceivedClaims = () => {
  const { currentUser, availableUsers } = useAuth();
  const { items, claims, updateClaimStatus } = useData();

  const myUserId = currentUser?._id;
  const myFoundItemIds = items.filter(i => i.createdBy === myUserId).map(i => i._id);
  const receivedClaims = claims.filter(c => myFoundItemIds.includes(c.itemId));

  return (
    <div className="dash-subpage">
      <div className="subpage-header">
        <div>
          <h2 className="subpage-title">Received Ownership Claims</h2>
          <p className="subpage-desc">
            Review submitted proof from campus members claiming items you found. Compare answers with your secret clues before accepting.
          </p>
        </div>
      </div>

      {receivedClaims.length === 0 ? (
        <EmptyState
          icon="📥"
          title="No Received Claims Yet"
          message="When a community member identifies an item you posted and submits proof, it will appear here for your evaluation."
        />
      ) : (
        <div className="dash-cards-list">
          {receivedClaims.map((claim) => {
            const item = items.find(i => i._id === claim.itemId);
            const claimant = availableUsers.find(u => u._id === claim.claimantId);
            return (
              <ClaimCard
                key={claim._id}
                claim={claim}
                item={item}
                claimant={claimant}
                isFinderView={true}
                onAccept={(id) => updateClaimStatus(id, 'accepted')}
                onReject={(id, note) => updateClaimStatus(id, 'rejected', note)}
                onComplete={(id) => updateClaimStatus(id, 'completed')}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReceivedClaims;

