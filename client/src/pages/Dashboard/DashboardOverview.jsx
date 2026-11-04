import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import StatCard from '../../components/dashboard/StatCard';
import ItemCard from '../../components/items/ItemCard';
import ClaimCard from '../../components/claims/ClaimCard';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { PlusIcon, ArrowRightIcon } from '../../components/common/Icons';
import './DashboardPages.css';

export const DashboardOverview = () => {
  const { currentUser, availableUsers } = useAuth();
  const { items, claims, updateClaimStatus } = useData();
  const navigate = useNavigate();

  const myUserId = currentUser?._id;

  // Filter items created by current user
  const myLostItems = items.filter(i => i.createdBy === myUserId && i.type === 'lost');
  const myFoundItems = items.filter(i => i.createdBy === myUserId && i.type === 'found');

  // Filter claims
  const myClaims = claims.filter(c => c.claimantId === myUserId);
  const myFoundItemIds = myFoundItems.map(i => i._id);
  const receivedClaims = claims.filter(c => myFoundItemIds.includes(c.itemId));

  const pendingReceivedCount = receivedClaims.filter(c => c.status === 'pending').length;
  const completedReturnsCount = claims.filter(c => 
    (c.claimantId === myUserId || myFoundItemIds.includes(c.itemId)) && c.status === 'completed'
  ).length;

  return (
    <div className="dash-overview-page">
      {/* Welcome Banner */}
      <div className="dash-welcome-card card">
        <div className="welcome-text-col">
          <h2 className="welcome-name">Hello, {currentUser?.name}! 👋</h2>
          <p className="welcome-sub">
            Track your lost items, review incoming verification answers on found items, and coordinate safe handovers.
          </p>
        </div>
        <div className="welcome-cta-group">
          <Link to="/report/lost">
            <Button variant="danger" size="md" icon={<PlusIcon size={14} />}>
              Report Lost Item
            </Button>
          </Link>
          <Link to="/report/found">
            <Button variant="primary" size="md" icon={<PlusIcon size={14} />}>
              Report Found Item
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Primary Stat Cards */}
      <div className="dash-stats-grid">
        <StatCard
          title="My Lost Items"
          value={myLostItems.length}
          subtitle="Actively searchable posts"
          icon="🔴"
          variant="danger"
          onClick={() => navigate('/dashboard/lost-items')}
        />
        <StatCard
          title="My Found Items"
          value={myFoundItems.length}
          subtitle="Helping fellow members"
          icon="🟢"
          variant="primary"
          onClick={() => navigate('/dashboard/found-items')}
        />
        <StatCard
          title="Pending Claims"
          value={pendingReceivedCount}
          subtitle="Incoming proof to review"
          icon="⏳"
          variant="warning"
          onClick={() => navigate('/dashboard/received-claims')}
        />
        <StatCard
          title="Completed Returns"
          value={completedReturnsCount}
          subtitle="Successfully reunited items"
          icon="🤝"
          variant="success"
          onClick={() => navigate('/dashboard/claims')}
        />
      </div>

      {/* Received Claims Requiring Action */}
      <div className="dash-section-block">
        <div className="dash-section-header">
          <div>
            <h3 className="dash-section-heading">Received Claims Awaiting Review</h3>
            <p className="dash-section-sub">
              Claimants have submitted verification details for items you found.
            </p>
          </div>
          <Link to="/dashboard/received-claims" className="dash-view-all-link">
            View All ({receivedClaims.length}) →
          </Link>
        </div>

        {receivedClaims.length === 0 ? (
          <EmptyState
            icon="📥"
            title="No Claims Received Yet"
            message="When someone claims an item you found, their verification answers will appear here for your review."
          />
        ) : (
          <div className="dash-cards-list">
            {receivedClaims.slice(0, 2).map((claim) => {
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

      {/* My Recent Posts */}
      <div className="dash-section-block">
        <div className="dash-section-header">
          <div>
            <h3 className="dash-section-heading">My Active Item Posts</h3>
            <p className="dash-section-sub">Recent lost or found postings created under your profile.</p>
          </div>
          <Link to="/dashboard/lost-items" className="dash-view-all-link">
            Manage All Posts →
          </Link>
        </div>

        {[...myLostItems, ...myFoundItems].length === 0 ? (
          <EmptyState
            icon="📦"
            title="No Items Reported"
            message="You haven't posted any lost or found items yet."
            actionText="Report an Item"
            onAction={() => navigate('/report/lost')}
          />
        ) : (
          <div className="dash-items-grid">
            {[...myLostItems, ...myFoundItems].slice(0, 3).map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;

