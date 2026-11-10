
import React, { useEffect, useState } from 'react';
import {
  getAdminReportsApi,
  updateAdminReportStatusApi
} from '../../services/api';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import { formatDate } from '../../utils/formatters';
import './AdminPages.css';

export const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [newStatus, setNewStatus] = useState('resolved');
  const [adminNote, setAdminNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  // Fetch all reports from the backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getAdminReportsApi();
        setReports(response.reports);
      } catch (error) {
        setError(error.message || 'Failed to load reports');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Open the existing report review modal
  const handleOpenReview = (report) => {
    setActiveReport(report);
    setNewStatus(report.status === 'open' ? 'under_review' : 'resolved');
    setAdminNote(report.adminNote || '');
    setActionError('');
  };

  // Save the moderation decision through the backend
  const handleSaveDecision = async (e) => {
    e.preventDefault();

    if (!activeReport) return;

    try {
      setIsSaving(true);
      setActionError('');

      const response = await updateAdminReportStatusApi(
        activeReport._id,
        newStatus,
        adminNote
      );

      setReports(prev =>
        prev.map(report =>
          report._id === activeReport._id
            ? {
                ...report,
                status: response.report?.status || newStatus,
                adminNote: response.report?.adminNote ?? adminNote
              }
            : report
        )
      );

      setActiveReport(null);
    } catch (error) {
      setActionError(error.message || 'Failed to update report');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    {
      header: 'Report ID',
      accessor: '_id',
      render: (row) => (
        <span className="font-mono text-xs">{row._id}</span>
      )
    },
    {
      header: 'Target Type',
      accessor: 'targetType',
      render: (row) => (
        <span className="target-pill capitalize">{row.targetType}</span>
      )
    },
    {
      header: 'Reason',
      accessor: 'reason',
      render: (row) => <span className="reason-pill">{row.reason}</span>
    },
    {
      header: 'Filed By',
      render: (row) => row.reporterId?.name || 'Anonymous'
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} size="sm" />
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Action',
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleOpenReview(row)}
        >
          Review Report
        </Button>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="admin-page-container">
        <p>Loading reports...</p>
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
          <h2 className="admin-title">Manage Content Reports</h2>
          <p className="admin-subtitle">
            Take action on user-submitted flags regarding suspicious items, abusive accounts, or scam behavior.
          </p>
        </div>
      </div>

      {actionError && !activeReport && (
        <p className="text-danger">{actionError}</p>
      )}

      <DataTable
        columns={columns}
        data={reports}
        searchPlaceholder="Search reports by reason, type, or reporter..."
      />

      {/* Review Modal */}
      <Modal
        isOpen={!!activeReport}
        onClose={() => {
          if (!isSaving) {
            setActiveReport(null);
            setActionError('');
          }
        }}
        title="Admin Report Review"
        size="md"
      >
        {activeReport && (
          <form onSubmit={handleSaveDecision} className="report-review-modal-form">
            <div className="report-info-box">
              <div className="report-info-row">
                <span className="lbl">Target Type:</span>
                <span className="val capitalize">{activeReport.targetType}</span>
              </div>
              <div className="report-info-row">
                <span className="lbl">Flagged Reason:</span>
                <span className="val">{activeReport.reason}</span>
              </div>
              <div className="report-info-row">
                <span className="lbl">Details provided:</span>
                <span className="val">
                  {activeReport.details || 'No additional commentary provided.'}
                </span>
              </div>
            </div>

            <FormField label="Update Moderation Status" htmlFor="newStatus" required>
              <select
                id="newStatus"
                className="form-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="under_review">Mark Under Review</option>
                <option value="resolved">Resolved (Appropriate Action Taken)</option>
                <option value="dismissed">Dismissed (False Alarm)</option>
                <option value="open">Keep Open</option>
              </select>
            </FormField>

            <FormField label="Internal Moderation Note" htmlFor="adminNote">
              <textarea
                id="adminNote"
                rows={3}
                className="form-textarea"
                placeholder="Log internal notes for other campus administrators..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </FormField>

            {actionError && (
              <p className="text-danger">{actionError}</p>
            )}

            <div className="modal-actions-right">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setActiveReport(null);
                  setActionError('');
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Decision'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ManageReports;
