import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import { formatDate } from '../../utils/formatters';
import './AdminPages.css';

export const ManageUsers = () => {
  const { availableUsers, updateUserStatus, currentUser } = useAuth();

  const [targetUser, setTargetUser] = useState(null);
  const [dialogAction, setDialogAction] = useState(null); // 'suspend' | 'activate'

  const handleConfirmStatusChange = () => {
    if (targetUser && dialogAction) {
      const newStatus = dialogAction === 'suspend' ? 'suspended' : 'active';
      updateUserStatus(targetUser._id, newStatus);
    }
    setTargetUser(null);
    setDialogAction(null);
  };

  const columns = [
    {
      header: 'User',
      accessor: 'name',
      render: (row) => (
        <div className="table-user-cell">
          <img
            src={row.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
            alt={row.name}
            className="table-user-avatar"
          />
          <div className="table-user-meta">
            <span className="table-user-name">{row.name}</span>
            <span className="table-user-email">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span className={`admin-role-badge ${row.role}`}>
          {row.role === 'admin' ? 'Administrator' : 'Standard Member'}
        </span>
      )
    },
    {
      header: 'Account Status',
      accessor: 'accountStatus',
      render: (row) => <StatusBadge status={row.accountStatus} size="sm" />
    },
    {
      header: 'Joined Date',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Actions',
      render: (row) => {
        if (row._id === currentUser?._id) {
          return <span className="current-user-tag">(You)</span>;
        }

        return (
          <div className="table-actions-cell">
            {row.accountStatus === 'active' ? (
              <Button
                variant="ghost"
                size="sm"
                className="text-danger"
                onClick={() => {
                  setTargetUser(row);
                  setDialogAction('suspend');
                }}
              >
                Suspend
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-success"
                onClick={() => {
                  setTargetUser(row);
                  setDialogAction('activate');
                }}
              >
                Restore
              </Button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-title">Manage Registered Users</h2>
          <p className="admin-subtitle">
            Search, inspect, and moderate student and staff accounts across FindIt.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={availableUsers}
        searchPlaceholder="Search users by name or email..."
      />

      <ConfirmationDialog
        isOpen={!!targetUser}
        title={dialogAction === 'suspend' ? 'Suspend Account' : 'Restore Account Access'}
        message={
          dialogAction === 'suspend'
            ? `Are you sure you want to suspend ${targetUser?.name}'s account? They will not be able to log in or create posts.`
            : `Restore full access for ${targetUser?.name}?`
        }
        confirmText={dialogAction === 'suspend' ? 'Suspend User' : 'Restore User'}
        confirmVariant={dialogAction === 'suspend' ? 'danger' : 'primary'}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setTargetUser(null)}
      />
    </div>
  );
};

export default ManageUsers;

