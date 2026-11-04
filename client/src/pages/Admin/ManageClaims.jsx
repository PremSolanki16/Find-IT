import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';
import './AdminPages.css';

export const ManageClaims = () => {
  const { claims, items } = useData();
  const { availableUsers } = useAuth();

  const [inspectClaim, setInspectClaim] = useState(null);

  const columns = [
    {
      header: 'Claim ID',
      accessor: '_id',
      render: (row) => <span className="font-mono text-xs">{row._id}</span>
    },
    {
      header: 'Claimed Item',
      render: (row) => {
        const item = items.find(i => i._id === row.itemId);
        return item ? (
          <Link to={`/items/${item._id}`} className="table-item-title-link">
            {item.title}
          </Link>
        ) : 'Item Removed';
      }
    },
    {
      header: 'Claimant',
      render: (row) => {
        const claimant = availableUsers.find(u => u._id === row.claimantId);
        return claimant ? claimant.name : 'Unknown';
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />
    },
    {
      header: 'Date Submitted',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Audit Proof',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setInspectClaim(row)}
        >
          View Verification
        </Button>
      )
    }
  ];

  const inspectItem = inspectClaim ? items.find(i => i._id === inspectClaim.itemId) : null;
  const inspectClaimant = inspectClaim ? availableUsers.find(u => u._id === inspectClaim.claimantId) : null;

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-title">Manage & Audit Claims</h2>
          <p className="admin-subtitle">
            Inspect all ownership claims, review answers submitted by claimants, and verify handover compliance.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={claims}
        searchPlaceholder="Search claims by ID or claimant..."
      />

      {/* Claim Audit Inspection Modal */}
      <Modal
        isOpen={!!inspectClaim}
        onClose={() => setInspectClaim(null)}
        title="Admin Claim Audit"
        size="md"
        footer={
          <Button variant="primary" onClick={() => setInspectClaim(null)}>
            Close Inspection
          </Button>
        }
      >
        {inspectClaim && (
          <div className="claim-audit-modal-body">
            <div className="audit-meta-banner">
              <div>
                <strong>Claim Reference:</strong> <span className="font-mono">{inspectClaim._id}</span>
              </div>
              <StatusBadge status={inspectClaim.status} size="sm" />
            </div>

            <div className="audit-parties-grid">
              <div className="party-box">
                <span className="party-label">Claimed Item:</span>
                <span className="party-val">{inspectItem?.title || 'Unknown Item'}</span>
                <span className="party-sub">Location: {inspectItem?.locationName}</span>
              </div>

              <div className="party-box">
                <span className="party-label">Claimant:</span>
                <span className="party-val">{inspectClaimant?.name || 'Verified Member'}</span>
                <span className="party-sub">{inspectClaimant?.email}</span>
              </div>
            </div>

            <div className="audit-qa-section">
              <h4 className="audit-qa-title">Submitted Ownership Answers:</h4>
              {inspectClaim.answers && inspectClaim.answers.length > 0 ? (
                inspectClaim.answers.map((ans, idx) => (
                  <div key={idx} className="qa-block">
                    <div className="qa-question"><strong>Q{idx + 1}:</strong> {ans.question}</div>
                    <div className="qa-answer"><strong>Answer:</strong> "{ans.answer}"</div>
                  </div>
                ))
              ) : (
                <p>No answers recorded.</p>
              )}
            </div>

            {inspectClaim.reviewNote && (
              <div className="review-note-box">
                <strong>Finder Review Note:</strong> {inspectClaim.reviewNote}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageClaims;

