import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import './PublicLayout.css';

export const PublicLayout = () => {
  return (
    <div className="public-layout-root">
      <Navbar />
      <main className="public-layout-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

