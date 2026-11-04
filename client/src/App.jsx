import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home/Home';
import BrowseItems from './pages/BrowseItems/BrowseItems';
import ItemDetails from './pages/ItemDetails/ItemDetails';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// User Action Pages
import ReportLost from './pages/ReportItem/ReportLost';
import ReportFound from './pages/ReportItem/ReportFound';
import SubmitClaim from './pages/Claims/SubmitClaim';
import ChatPage from './pages/Chat/ChatPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';

// User Dashboard Pages
import DashboardOverview from './pages/Dashboard/DashboardOverview';
import MyLostItems from './pages/Dashboard/MyLostItems';
import MyFoundItems from './pages/Dashboard/MyFoundItems';
import MyClaims from './pages/Dashboard/MyClaims';
import ReceivedClaims from './pages/Dashboard/ReceivedClaims';
import ProfileInfo from './pages/Dashboard/ProfileInfo';

// Admin Dashboard Pages
import AdminOverview from './pages/Admin/AdminOverview';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageItems from './pages/Admin/ManageItems';
import ManageClaims from './pages/Admin/ManageClaims';
import ManageReports from './pages/Admin/ManageReports';

// Route Guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export const App = () => {
  return (
    <Routes>
      {/* 1. Public Layout Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<BrowseItems />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        
        {/* User Direct Workflow Pages */}
        <Route 
          path="/report/lost" 
          element={
            <ProtectedRoute>
              <ReportLost />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/report/found" 
          element={
            <ProtectedRoute>
              <ReportFound />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/claims/:id" 
          element={
            <ProtectedRoute>
              <SubmitClaim />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat/:id" 
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* 2. Authentication Layout Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* 3. User Dashboard Layout Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="lost-items" element={<MyLostItems />} />
        <Route path="found-items" element={<MyFoundItems />} />
        <Route path="claims" element={<MyClaims />} />
        <Route path="received-claims" element={<ReceivedClaims />} />
        <Route path="profile" element={<ProfileInfo />} />
      </Route>

      {/* 4. Admin Dashboard Layout Routes */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <DashboardLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="items" element={<ManageItems />} />
        <Route path="claims" element={<ManageClaims />} />
        <Route path="reports" element={<ManageReports />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
