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

export const MyLostItems = () => {
  const { currentUser } = useAuth();
  const { items, deleteItem, updateItem } = useData();
  const navigate = useNavigate();

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const myLostItems = items.filter(i => i.createdBy === currentUser?._id && i.type === 'lost');

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
      header: 'Last Seen Location',
      accessor: 'locationName'
    },
    {
      header: 'Date Lost',
      accessor: 'eventDate',
      render: (row) => formatDate(row.eventDate)
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />
    },
    {
      header: 'Reward',
      accessor: 'isRewardOffered',
      render: (row) => row.isRewardOffered ? <span className="reward-tag">Yes</span> : '—'
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
          <h2 className="subpage-title">My Lost Belongings</h2>
          <p className="subpage-desc">
            Manage active missing item notices you have published across the campus network.
          </p>
        </div>
        <Link to="/report/lost">
          <Button variant="danger" size="md" icon={<PlusIcon size={16} />}>
            Report New Lost Item
          </Button>
        </Link>
      </div>

      {myLostItems.length === 0 ? (
        <EmptyState
          icon="🎒"
          title="No Lost Items Reported"
          message="You currently have no active lost item reports on FindIt."
          actionText="Report a Lost Item"
          onAction={() => navigate('/report/lost')}
        />
      ) : (
        <DataTable
          columns={columns}
          data={myLostItems}
          searchPlaceholder="Search my lost items..."
        />
      )}

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Remove Lost Item Notice"
        message="Are you sure you want to remove this post? It will no longer be visible to campus finders."
        confirmText="Remove Post"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default MyLostItems;

