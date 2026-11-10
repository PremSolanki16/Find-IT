
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAdminOverviewApi,
  getAdminReportsApi
} from '../../services/api';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/formatters';
import './AdminPages.css';

export const AdminOverview = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalClaims: 0,
    completedReturns: 0
  });

  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard statistics and reports from the backend
  useEffect(() => {
    const fetchAdminOverview = async () => {
      try {
        setIsLoading(true);
        setError('');

        const [overviewResponse, reportsResponse] = await Promise.all([
          getAdminOverviewApi(),
          getAdminReportsApi()
        ]);

        setStats(overviewResponse.stats);
        setReports(reportsResponse.reports);

      } catch (error) {
        setError(error.message || 'Failed to load admin dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminOverview();
  }, []);

  const openReports = reports.filter(
    report => report.status === 'open' || report.status === 'under_review'
  );

  if (isLoading) {
    return (
      <div className="admin-page-container">
        <p>Loading admin dashboard...</p>
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
    <div className="admin-overview-root">
      {/* Platform Stats Grid */}
      <div className="admin-stats-grid">
        <StatCard
          title="Total Registered Users"
          value={stats.totalUsers}
          subtitle="Verified campus members"
          icon="👥"
          variant="primary"
          onClick={() => navigate('/admin/users')}
        />
        <StatCard
          title="Total Item Posts"
          value={stats.totalPosts}
          subtitle="Lost and found listings"
          icon="📦"
          variant="primary"
          onClick={() => navigate('/admin/items')}
        />
        <StatCard
          title="Total Claims Logged"
          value={stats.totalClaims}
          subtitle="Ownership requests submitted"
          icon="⚖️"
          variant="warning"
          onClick={() => navigate('/admin/claims')}
        />
        <StatCard
          title="Completed Returns"
          value={stats.completedReturns}
          subtitle="Verified handovers"
          icon="🤝"
          variant="success"
          onClick={() => navigate('/admin/claims')}
        />
      </div>

      {/* Flagged Reports Warning Queue */}
      <div className="admin-section-card card">
        <div className="admin-card-header">
          <div>
            <div className="admin-badge-row">
              <span className="admin-queue-tag">Moderation Queue</span>
              {openReports.length > 0 && (
                <span className="admin-alert-pill">
                  {openReports.length} pending action
                </span>
              )}
            </div>
            <h3 className="admin-card-title">
              Urgent Reports & Community Flags
            </h3>
            <p className="admin-card-sub">
              Review flagged postings, suspected spam, scams, or reported campus accounts.
            </p>
          </div>
          <Link to="/admin/reports">
            <Button variant="outline" size="sm">
              Manage All Reports →
            </Button>
          </Link>
        </div>

        {openReports.length === 0 ? (
          <EmptyState
            icon="🛡️"
            title="Moderation Queue Clear"
            message="There are no unresolved user reports or flagged postings at this time."
          />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Target Type</th>
                  <th>Reason</th>
                  <th>Date Filed</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {openReports.slice(0, 4).map((report) => (
                  <tr key={report._id}>
                    <td className="font-mono">{report._id}</td>
                    <td className="capitalize">{report.targetType}</td>
                    <td>
                      <span className="reason-pill">{report.reason}</span>
                    </td>
                    <td>{formatDate(report.createdAt)}</td>
                    <td>
                      <StatusBadge status={report.status} size="sm" />
                    </td>
                    <td>
                      <Link to="/admin/reports">
                        <Button variant="ghost" size="sm">
                          Review →
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Navigation Panels */}
      <div className="admin-quick-grid">
        <div className="card quick-tool-card">
          <div className="tool-icon">👥</div>
          <h4>User Accounts Management</h4>
          <p>Inspect registered profiles, monitor verified status, and suspend abusive users.</p>
          <Link to="/admin/users">
            <Button variant="outline" size="sm" fullWidth>
              Open Users Directory
            </Button>
          </Link>
        </div>

        <div className="card quick-tool-card">
          <div className="tool-icon">📦</div>
          <h4>Items Content Moderation</h4>
          <p>Review all active and closed postings; remove inappropriate or guideline-violating items.</p>
          <Link to="/admin/items">
            <Button variant="outline" size="sm" fullWidth>
              Audit Item Listings
            </Button>
          </Link>
        </div>

        <div className="card quick-tool-card">
          <div className="tool-icon">⚖️</div>
          <h4>Claims & Return Audits</h4>
          <p>Audit verification answers, examine disputed handovers, and track success rate.</p>
          <Link to="/admin/claims">
            <Button variant="outline" size="sm" fullWidth>
              Audit Claims Registry
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
