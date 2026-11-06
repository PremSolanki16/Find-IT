import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAllItemsApi, deleteItemApi } from '../../services/api';
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

  // Store items fetched from the backend
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');  
  const navigate = useNavigate();

  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Fetch all items from the backend when the page loads
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllItemsApi();
        setItems(response.items || []);
      } catch (error) {
        setFetchError(error.message || 'Failed to load items.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);


  // Filter items created by the logged-in user
  const myLostItems = items.filter(
    (item) =>
      item.createdBy?._id === currentUser?._id &&
      item.type === 'lost'
  );

  // Remove the selected item using the backend DELETE API
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteItemApi(deleteTargetId);

      // Remove the successfully deleted item from the displayed list
      setItems((currentItems) =>
        currentItems.filter((item) => item._id !== deleteTargetId)
      );

      setShowDeleteDialog(false);
      setDeleteTargetId(null);
      setDeleteError('');
    } catch (error) {
      setDeleteError(error.message || 'Failed to remove item.');
    }
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
          <Link to={`/report/lost/edit/${row._id}`}>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-danger"
            icon={<TrashIcon size={14} />}
            onClick={() => {
              setDeleteError('');
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

      {deleteError && <p>{deleteError}</p>}
      {isLoading ? (
        <p>Loading your lost items...</p>
          ) : fetchError ? (
            <p>{fetchError}</p>
          ) : myLostItems.length === 0 ? (
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

