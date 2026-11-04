import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import EmptyState from '../../components/common/EmptyState';
import DataTable from '../../components/dashboard/DataTable';
import { PlusIcon, TrashIcon, EyeIcon } from '../../components/common/Icons';
import { formatDate, getCategoryLabel } from '../../utils/formatters';
import './DashboardPages.css';

export const MyFoundItems = () => {
  const { currentUser } = useAuth();
  const { items, claims, deleteItem } = useData();
  const navigate = useNavigate();

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const myFoundItems = items.filter(i => i.createdBy === currentUser?._id && i.type === 'found');

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteItem(deleteTargetId);
    }
    setShowDeleteDialog(false);
    setDeleteTargetId(null);
  };

  const columns = [
    {
      header: 'Item',
      accessor: 'title',
      render: (row) => (
        <div className="table-item-cell">
          <img
            src={(row.imageUrls && row.imageUrls[0]) || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=100&q=80'}
            alt={row.title}
            className="table-item-img"
          />
          <div className="table-item-text">
            <Link to={`/items/${row._id}`} className="table-item-title-link">
              {row.title}
            </Link>
            <span className="table-item-category">{getCategoryLabel(row.category)}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Found At',
      accessor: 'locationName'
    },
    {
      header: 'Date Found',
      accessor: 'eventDate',
      render: (row) => formatDate(row.eventDate)
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />
    },
    {
      header: 'Claims',
      render: (row) => {
        const itemClaims = claims.filter(c => c.itemId === row._id);
        const pending = itemClaims.filter(c => c.status === 'pending').length;
        return (
          <Link to="/dashboard/received-claims" className="item-claims-pill">
            {itemClaims.length} claim(s) {pending > 0 && <span className="pending-indicator">({pending} new)</span>}
          </Link>
        );
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="table-actions-cell">
          <Link to={`/items/${row._id}`}>
            <Button variant="ghost" size="sm" icon={<EyeIcon size={14} />}>
              View
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-danger"
            icon={<TrashIcon size={14} />}
            onClick={() => {
              setDeleteTargetId(row._id);
              setShowDeleteDialog(true);
            }}
          >
            Remove
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="dash-subpage">
      <div className="subpage-header">
        <div>
          <h2 className="subpage-title">Items You Found</h2>
          <p className="subpage-desc">
            Posts of belongings you found and are keeping safe until claimed by the rightful owner.
          </p>
        </div>
        <Link to="/report/found">
          <Button variant="primary" size="md" icon={<PlusIcon size={16} />}>
            Report Found Item
          </Button>
        </Link>
      </div>

      {myFoundItems.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No Found Items Logged"
          message="You haven't posted any found items yet. Thank you for checking!"
          actionText="Log a Found Item"
          onAction={() => navigate('/report/found')}
        />
      ) : (
        <DataTable
          columns={columns}
          data={myFoundItems}
          searchPlaceholder="Search my found items..."
        />
      )}

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Remove Found Item Post"
        message="Are you sure you want to remove this found post? Active claims on it will also be archived."
        confirmText="Remove Post"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default MyFoundItems;

