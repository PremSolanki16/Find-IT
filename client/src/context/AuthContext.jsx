
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockUsers';
import {
  registerUser as registerUserApi,
  loginUser as loginUserApi,
  getCurrentUser as getCurrentUserApi
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('findit_current_user');

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }

    return null;
  });

  const [availableUsers, setAvailableUsers] = useState(mockUsers);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Convert backend user response to existing frontend user structure
  const formatUser = (user) => ({
    ...user,
    _id: user.id || user._id
  });

  // Save current user in localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('findit_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('findit_current_user');
    }
  }, [currentUser]);

  // Validate saved login session with backend
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem('findit_token');

      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const response = await getCurrentUserApi(token);
        const user = formatUser(response.user);

        setCurrentUser(user);

        setAvailableUsers(prev => [
          user,
          ...prev.filter(u => u._id !== user._id)
        ]);

      } catch (error) {
        // Clear session only when the backend rejects authentication
        if (
          error.message === "Invalid or expired authentication token" ||
          error.message === "Authentication token is required" ||
          error.message === "Your account is not active" ||
          error.message === "User not found"
        ) {
          localStorage.removeItem('findit_token');
          localStorage.removeItem('findit_current_user');
          setCurrentUser(null);
        }

      } finally {
        setIsAuthLoading(false);
      }
    };

    verifySession();
  }, []);

  // Login an existing user
  const login = async (email, password) => {
    const response = await loginUserApi({
      email: email.trim().toLowerCase(),
      password
    });

    const user = formatUser(response.user);

    localStorage.setItem('findit_token', response.token);

    setCurrentUser(user);
    setAvailableUsers(prev => [
      user,
      ...prev.filter(u => u._id !== user._id)
    ]);

    return user;
  };


  // Register a new user
const signup = async (userData) => {
  const credentials = {
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
    password: userData.password
  };

  const response = await registerUserApi(credentials);

  return response;
};
  // Logout current user
  const logout = () => {
    localStorage.removeItem('findit_token');
    setCurrentUser(null);
  };

  

  // Existing user status management
  const updateUserStatus = (userId, newStatus) => {
    setAvailableUsers(prev =>
      prev.map(u =>
        u._id === userId ? { ...u, accountStatus: newStatus } : u
      )
    );

    if (currentUser && currentUser._id === userId) {
      setCurrentUser(prev => ({
        ...prev,
        accountStatus: newStatus
      }));
    }
  };

  const value = {
    currentUser,
    isAuthLoading,
    availableUsers,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    login,
    signup,
    logout,
    updateUserStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
