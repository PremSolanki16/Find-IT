
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { useAuth } from '../hooks/useAuth';
import './PublicLayout.css';

export const PublicLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const showBrowseSidebar =
    location.pathname === '/browse' && isAuthenticated;

  return (
    <div className="public-layout-root">
      <Navbar />

      <main
        className={`public-layout-main ${
          showBrowseSidebar ? 'browse-with-sidebar' : ''
        }`}
      >
        {showBrowseSidebar && (
          <DashboardSidebar />
        )}

        {showBrowseSidebar ? (
          <div className="browse-layout-content">
            <Outlet />
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
