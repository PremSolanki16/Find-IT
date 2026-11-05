import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { validateEmail, validatePassword } from '../../utils/validators';
import './Auth.css';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;

    const passErr = validatePassword(password);
    if (passErr) errs.password = passErr;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setGeneralError('');
  if (!validate()) return;

  setIsLoading(true);

  try {
    await login(email.trim().toLowerCase(), password);
    navigate('/dashboard');
  } catch (err) {
    setGeneralError(err.message || 'Login failed. Please check credentials.');
  } finally {
    setIsLoading(false);
  }
};


  // Quick Demo fill helpers
  const fillAsUser = () => {
    setEmail('prem@example.com');
    setPassword('password123');
    setErrors({});
    setGeneralError('');
  };

  const fillAsAdmin = () => {
    setEmail('admin@findit.org');
    setPassword('admin1234');
    setErrors({});
    setGeneralError('');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(forgotEmail)) return;
    setForgotSuccess(true);
  };

  return (
    <div className="auth-form-inner">
      <div className="auth-header">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">
          Sign in to track your reported belongings, respond to claims, or coordinate returns.
        </p>
      </div>

      {generalError && (
        <div className="auth-alert error">
          <span>⚠️ {generalError}</span>
        </div>
      )}

      {/* Demo Fast-Fill Bar */}
      <div className="auth-demo-fill">
        <span className="demo-fill-label">Demo Quick-Fill:</span>
        <div className="demo-fill-buttons">
          <button type="button" className="demo-fill-btn" onClick={fillAsUser}>
            Student (Prem)
          </button>
          <button type="button" className="demo-fill-btn admin" onClick={fillAsAdmin}>
            Admin (Sarah)
          </button>
        </div>
      </div>

      <form className="auth-actual-form" onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="your.email@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <div className="auth-options-row">
          <label className="remember-checkbox-label">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            className="forgot-password-link"
            onClick={() => {
              setForgotEmail(email);
              setForgotSuccess(false);
              setForgotModalOpen(true);
            }}
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="auth-footer-nav">
        <span>Don't have an account yet?</span>
        <Link to="/signup" className="auth-switch-link">
          Create an account
        </Link>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Password"
        size="sm"
        footer={
          forgotSuccess ? (
            <Button variant="primary" onClick={() => setForgotModalOpen(false)}>
              Back to Login
            </Button>
          ) : null
        }
      >
        {forgotSuccess ? (
          <div className="forgot-success-box">
            <span className="success-icon">✉️</span>
            <h4>Check your inbox</h4>
            <p>We've dispatched a simulated recovery code to <strong>{forgotEmail}</strong>.</p>
          </div>
        ) : (
          <form onSubmit={handleForgotSubmit}>
            <p className="forgot-prompt">
              Enter your registered campus or personal email to receive a password recovery link.
            </p>
            <Input
              label="Email Address"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
            <div className="modal-actions-right">
              <Button type="button" variant="outline" onClick={() => setForgotModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Login;

