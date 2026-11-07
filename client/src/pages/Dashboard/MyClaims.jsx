import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getMyClaimsApi, updateClaimStatusApi } from '../../services/api';
import ClaimCard from '../../components/claims/ClaimCard';
import EmptyState from '../../components/common/EmptyState';
import './DashboardPages.css';

export const MyClaims = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [myClaims, setMyClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch claims submitted by the logged-in user
  useEffect(() => {
    const fetchMyClaims = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await getMyClaimsApi();
        setMyClaims(response.claims || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch your claims.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyClaims();
  }, []);

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

      {isLoading ? (
        <p>Loading your claims...</p>
      ) : error ? (
        <p>{error}</p>
      ) : myClaims.length === 0 ? (        
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
            const item = claim.itemId;
            const finder = item?.createdBy;
            return (
              <ClaimCard
                key={claim._id}
                claim={claim}
                item={item}
                finder={finder}
                isFinderView={false}
                onCancel={async (id) => {
                // Cancel the claim through the backend
                try {
                  const response = await updateClaimStatusApi(id, 'cancelled');

                  setMyClaims((previousClaims) =>
                    previousClaims.map((claim) =>
                      claim._id === id ? response.claim : claim
                    )
                  );
                } catch (err) {
                  alert(err.message || 'Failed to cancel claim.');
                }
              }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyClaims;

