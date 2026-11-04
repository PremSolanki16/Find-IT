import React, { useState } from 'react';
import { useData } from '../../hooks/useData';
import { useAuth } from '../../hooks/useAuth';
import DataTable from '../../components/dashboard/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import FormField from '../../components/common/FormField';
import { formatDate } from '../../utils/formatters';
import './AdminPages.css';

export const ManageReports = () => {
  const { reports, updateReportStatus, items } = useData();
  const { availableUsers } = useAuth();

  const [activeReport, setActiveReport] = useState(null);
  const [newStatus, setNewStatus] = useState('resolved');
  const [adminNote, setAdminNote] = useState('');

  const handleOpenReview = (report) => {
    setActiveReport(report);
    setNewStatus(report.status === 'open' ? 'under_review' : 'resolved');
    setAdminNote(report.adminNote || '');
  };

  const handleSaveDecision = (e) => {
    e.preventDefault();
    if (activeReport) {
      updateReportStatus(activeReport._id, newStatus, adminNote);
    }
    setActiveReport(null);
  };

  const columns = [
    {
      header: 'Report ID',
      accessor: '_id',
      render: (row) => <span className="font-mono text-xs">{row._id}</span>
    },
    {
      header: 'Target Type',
      accessor: 'targetType',
      render: (row) => <span className="target-pill capitalize">{row.targetType}</span>
    },
    {
      header: 'Reason',
      accessor: 'reason',
      render: (row) => <span className="reason-pill">{row.reason}</span>
    },
    {
      header: 'Filed By',
      render: (row) => {
        const reporter = availableUsers.find(u => u._id === row.reporterId);
        return reporter ? reporter.name : 'Anonymous';
      }
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

      <DataTable
        columns={columns}
        data={reports}
        searchPlaceholder="Search reports by reason, type, or reporter..."
      />

      {/* Review Modal */}
      <Modal
        isOpen={!!activeReport}
        onClose={() => setActiveReport(null)}
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
                <span className="val">{activeReport.details || 'No additional commentary provided.'}</span>
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

            <div className="modal-actions-right">
              <Button type="button" variant="outline" onClick={() => setActiveReport(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Decision
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ManageReports;

