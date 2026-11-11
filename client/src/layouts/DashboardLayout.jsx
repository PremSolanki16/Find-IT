
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import './DashboardLayout.css';

export const DashboardLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const isAdminView = location.pathname.startsWith('/admin');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-layout-root">
        <DashboardSidebar isAdminView={isAdminView} />

        {mobileSidebarOpen && (
          <div
            className="dashboard-mobile-backdrop"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="mobile-sidebar-drawer"
              onClick={(e) => e.stopPropagation()}
            >
              <DashboardSidebar isAdminView={isAdminView} />
            </div>
          </div>
        )}

        <div className="dashboard-main-area">
          <main className="dashboard-content-body">
            <button
              type="button"
              className="dashboard-mobile-menu-button"
              onClick={() => setMobileSidebarOpen(prev => !prev)}
            >
              <span>☰</span> Dashboard Menu
            </button>

            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
