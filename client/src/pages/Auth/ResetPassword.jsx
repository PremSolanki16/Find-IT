
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { resetPasswordApi } from '../../services/api';
import './Auth.css';

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validate the new password and confirmation
  const validate = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit the new password to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      await resetPasswordApi(token, password);
      setIsSuccess(true);
    } catch (error) {
      setGeneralError(
        error.message || 'Unable to reset password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-inner">
      {isSuccess ? (
        <>
          <div className="auth-header">
            <h2 className="auth-title">Password Reset Successful</h2>
            <p className="auth-subtitle">
              Your password has been updated successfully. You can now sign in
              using your new password.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </>
      ) : (
        <>
          <div className="auth-header">
            <h2 className="auth-title">Create New Password</h2>
            <p className="auth-subtitle">
              Enter a new password for your FindIt account.
            </p>
          </div>

          {generalError && (
            <div className="auth-alert error">
              <span>⚠️ {generalError}</span>
            </div>
          )}

          <form className="auth-actual-form" onSubmit={handleSubmit}>
            <Input
              label="New Password"
              id="password"
              name="password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />

            <Input
              label="Confirm New Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Reset Password
            </Button>
          </form>

          <div className="auth-footer-nav">
            <Link to="/login" className="auth-switch-link">
              Back to Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
