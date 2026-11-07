import React, { useEffect, useState } from 'react';
import { getReceivedClaimsApi, updateClaimStatusApi } from '../../services/api';
import ClaimCard from '../../components/claims/ClaimCard';
import EmptyState from '../../components/common/EmptyState';
import './DashboardPages.css';

export const ReceivedClaims = () => {
const [receivedClaims, setReceivedClaims] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState('');

  // Fetch claims received by the logged-in finder
  useEffect(() => {
    const fetchReceivedClaims = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await getReceivedClaimsApi();
        setReceivedClaims(response.claims || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch received claims.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceivedClaims();
  }, []);

  // Update a claim status through the backend
  const handleClaimStatusUpdate = async (id, status, note = '') => {
    try {
      const response = await updateClaimStatusApi(id, status, note);

      setReceivedClaims((previousClaims) =>
        previousClaims.map((claim) =>
          claim._id === id ? response.claim : claim
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to update claim status.');
    }
  };


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

      {isLoading ? (
        <p>Loading received claims...</p>
      ) : error ? (
        <p>{error}</p>
      ) : receivedClaims.length === 0 ? (
        <EmptyState
          icon="📥"
          title="No Received Claims Yet"
          message="When a community member identifies an item you posted and submits proof, it will appear here for your evaluation."
        />
      ) : (
        <div className="dash-cards-list">
          {receivedClaims.map((claim) => {
            const item = claim.itemId;
            const claimant = claim.claimantId;
            return (
              <ClaimCard
                key={claim._id}
                claim={claim}
                item={item}
                claimant={claimant}
                isFinderView={true}
                onAccept={(id) => handleClaimStatusUpdate(id, 'accepted')}
                onReject={(id, note) => handleClaimStatusUpdate(id, 'rejected', note)}
                onComplete={(id) => handleClaimStatusUpdate(id, 'completed')}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReceivedClaims;

