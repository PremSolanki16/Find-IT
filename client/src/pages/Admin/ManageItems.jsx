
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminItemsApi, removeAdminItemApi } from '../../services/api';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { TrashIcon, EyeIcon } from '../../components/common/Icons';
import { formatDate, getCategoryLabel } from '../../utils/formatters';
import './AdminPages.css';

export const ManageItems = () => {
  const [items, setItems] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteTargetItem, setDeleteTargetItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  // Fetch all item postings from the backend
  const fetchItems = async () => {
    try {
      setError('');
      const response = await getAdminItemsApi();
      setItems(response.items);
    } catch (error) {
      setError(error.message || 'Failed to load item postings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Remove an item through the admin moderation API
  const handleDeleteConfirm = async () => {
    if (!deleteTargetItem) return;

    try {
      setActionError('');

      await removeAdminItemApi(deleteTargetItem._id);

      setItems(prev =>
        prev.map(item =>
          item._id === deleteTargetItem._id
            ? { ...item, status: 'removed' }
            : item
        )
      );

      setDeleteTargetItem(null);
    } catch (error) {
      setActionError(error.message || 'Failed to remove item');
    }
  };

  const filteredItems = typeFilter === 'all'
    ? items
    : items.filter(item => item.type === typeFilter);

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
            <span className="table-item-category">
              {getCategoryLabel(row.category)}
            </span>
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      accessor: 'type',
      render: (row) => <StatusBadge type={row.type} size="sm" />
    },
    {
      header: 'Location',
      accessor: 'locationName'
    },
    {
      header: 'Creator',
      render: (row) => row.createdBy?.name || 'Unknown User'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />
    },
    {
      header: 'Date Logged',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt)
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
          {row.status !== 'removed' && (
            <Button
              variant="ghost"
              size="sm"
              className="text-danger"
              icon={<TrashIcon size={14} />}
              onClick={() => {
                setActionError('');
                setDeleteTargetItem(row);
              }}
            >
              Delete
            </Button>
          )}
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="admin-page-container">
        <p>Loading item postings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page-container">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-title">Manage Item Postings</h2>
          <p className="admin-subtitle">
            Audit and moderate all reported lost and found notices on the platform.
          </p>
        </div>

        <div className="admin-type-filters">
          <button
            type="button"
            className={`admin-type-btn ${typeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTypeFilter('all')}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            className={`admin-type-btn ${typeFilter === 'lost' ? 'active' : ''}`}
            onClick={() => setTypeFilter('lost')}
          >
            Lost ({items.filter(item => item.type === 'lost').length})
          </button>
          <button
            type="button"
            className={`admin-type-btn ${typeFilter === 'found' ? 'active' : ''}`}
            onClick={() => setTypeFilter('found')}
          >
            Found ({items.filter(item => item.type === 'found').length})
          </button>
        </div>
      </div>

      {actionError && (
        <p className="text-danger">{actionError}</p>
      )}

      <DataTable
        columns={columns}
        data={filteredItems}
        searchPlaceholder="Search postings by title, location, or keyword..."
      />

      <ConfirmationDialog
        isOpen={!!deleteTargetItem}
        title="Admin: Remove Item Posting"
        message={`Are you sure you want to delete "${deleteTargetItem?.title}"? This permanently removes the listing from the platform.`}
        confirmText="Confirm Delete"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteTargetItem(null);
          setActionError('');
        }}
      />
    </div>
  );
};

export default ManageItems;
