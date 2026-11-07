import React, { useState, useEffect } from 'react';
import {
  getAllItemsApi,
  deleteItemApi,
  getReceivedClaimsApi
} from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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

  const navigate = useNavigate();

  // Store items fetched from the backend
  const [items, setItems] = useState([]);
  // Store received claims fetched from the backend
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
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

  // Fetch claims received for the logged-in user's items
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await getReceivedClaimsApi();
        setClaims(response.claims || []);
      } catch (error) {
        console.error('Failed to load received claims:', error);
      }
    };

    fetchClaims();
  }, []);


  // Filter items created by the logged-in user
  const myFoundItems = items.filter(
    (item) =>
      item.createdBy?._id === currentUser?._id &&
      item.type === 'found'
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
      // Find claims belonging to the current found item
      const itemClaims = claims.filter(
        (claim) => (claim.itemId?._id || claim.itemId) === row._id
      );

      const pending = itemClaims.filter(
        (claim) => claim.status === 'pending'
      ).length;
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
          <Link to={`/report/found/edit/${row._id}`}>
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
      {deleteError && <p>{deleteError}</p>}
      {isLoading ? (
        <p>Loading your found items...</p>
      ) : fetchError ? (
        <p>{fetchError}</p>
      ) : myFoundItems.length === 0 ? (
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

