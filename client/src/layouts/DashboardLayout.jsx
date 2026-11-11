import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import './DashboardLayout.css';
import Navbar from '../components/common/Navbar';
export const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const isAdminView = location.pathname.startsWith('/admin');

  // Derive title from pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Admin Overview';
    if (path === '/admin/users') return 'User Accounts';
    if (path === '/admin/items') return 'Item Postings';
    if (path === '/admin/claims') return 'Claim Audits';
    if (path === '/admin/reports') return 'Content Reports';

    if (path === '/dashboard') return 'Dashboard Overview';
    if (path === '/dashboard/lost-items') return 'My Lost Items';
    if (path === '/dashboard/found-items') return 'My Found Items';
    if (path === '/dashboard/claims') return 'My Submitted Claims';
    if (path === '/dashboard/received-claims') return 'Claims Received on My Posts';
    if (path === '/dashboard/profile') return 'Account Profile';

    return 'FindIt Dashboard';
  };

  const getPageSubtitle = () => {
    const path = location.pathname;
    if (isAdminView) return 'Campus moderation, compliance & system controls';
    return 'Manage your reported belongings, incoming requests & return handovers';
  };

  return (

    <>
      <Navbar />

    <div className="dashboard-layout-root">
      {/* Sidebar */}
      <DashboardSidebar isAdminView={isAdminView} />

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="dashboard-mobile-backdrop"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div className="mobile-sidebar-drawer" onClick={(e) => e.stopPropagation()}>
            <DashboardSidebar isAdminView={isAdminView} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="dashboard-main-area">
        <DashboardNavbar 
          title={getPageTitle()} 
          subtitle={getPageSubtitle()} 
          onToggleSidebar={() => setMobileSidebarOpen(prev => !prev)}
        />

        <main className="dashboard-content-body">
          <Outlet />
        </main>
      </div>
    </div>
    </>
  );
};

export default DashboardLayout;

