import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '../data/mockUsers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize with Prem Solanki as default active logged in user for immediate interactive testing
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('findit_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return mockUsers[0]; // Prem Solanki
  });

  const [availableUsers, setAvailableUsers] = useState(mockUsers);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('findit_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('findit_current_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const user = availableUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password.');
    }
    if (user.accountStatus !== 'active') {
      throw new Error(`Your account is currently ${user.accountStatus}. Please contact support.`);
    }
    setCurrentUser(user);
    return user;
  };

  const signup = (userData) => {
    const existing = availableUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      _id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      role: 'user',
      accountStatus: 'active',
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setAvailableUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId) => {
    if (!userId) {
      setCurrentUser(null); // Guest mode
      return;
    }
    const user = availableUsers.find(u => u._id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const updateUserStatus = (userId, newStatus) => {
    setAvailableUsers(prev => prev.map(u => u._id === userId ? { ...u, accountStatus: newStatus } : u));
    if (currentUser && currentUser._id === userId) {
      setCurrentUser(prev => ({ ...prev, accountStatus: newStatus }));
    }
  };

  const value = {
    currentUser,
    availableUsers,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    login,
    signup,
    logout,
    switchUser,
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

