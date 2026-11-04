import React from 'react';
import './StatusBadge.css';

export const StatusBadge = ({
  status,
  type = null, // if specified as 'lost' or 'found', gives post-type badge
  size = 'md',
  className = ''
}) => {
  // Post type badges
  if (type === 'lost' || status === 'lost') {
    return <span className={`status-badge badge-lost badge-${size} ${className}`}>Lost</span>;
  }
  if (type === 'found' || status === 'found') {
    return <span className={`status-badge badge-found badge-${size} ${className}`}>Found</span>;
  }

  // Status mapping
  const statusMap = {
    // Items
    open: { label: 'Open', variant: 'info' },
    claim_pending: { label: 'Claim Pending', variant: 'warning' },
    returned: { label: 'Returned', variant: 'success' },
    closed: { label: 'Closed', variant: 'neutral' },
    removed: { label: 'Removed', variant: 'danger' },

    // Claims
    pending: { label: 'Pending Review', variant: 'warning' },
    accepted: { label: 'Accepted', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
    cancelled: { label: 'Cancelled', variant: 'neutral' },
    completed: { label: 'Completed', variant: 'success' },

    // Users
    active: { label: 'Active', variant: 'success' },
    suspended: { label: 'Suspended', variant: 'danger' },
    disabled: { label: 'Disabled', variant: 'neutral' },

    // Reports
    under_review: { label: 'Under Review', variant: 'warning' },
    resolved: { label: 'Resolved', variant: 'success' },
    dismissed: { label: 'Dismissed', variant: 'neutral' }
  };

  const config = statusMap[status] || { label: status || 'Unknown', variant: 'neutral' };

  return (
    <span className={`status-badge badge-${config.variant} badge-${size} ${className}`}>
      <span className="badge-dot" />
      {config.label}
    </span>
  );
};

export default StatusBadge;

