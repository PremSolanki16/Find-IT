import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validators';
import './Auth.css';

export const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    const nameErr = validateRequired(name, 'Full Name');
    if (nameErr) errs.name = nameErr;

    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;

    const passErr = validatePassword(password);
    if (passErr) errs.password = passErr;

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!termsAgreed) {
      errs.terms = 'Please accept the campus community guidelines';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setGeneralError('');
  if (!validate()) return;

  setIsLoading(true);
  try {
    await signup({
      name: name.trim(),
      email: email.trim(),
      password
    });

    navigate('/login');
  } catch (err) {
    setGeneralError(err.message || 'Signup failed. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="auth-form-inner">
      <div className="auth-header">
        <h2 className="auth-title">Create an Account</h2>
        <p className="auth-subtitle">
          Join FindIt to report belongings, verify claims, and help return found items.
        </p>
      </div>

      {generalError && (
        <div className="auth-alert error">
          <span>⚠️ {generalError}</span>
        </div>
      )}

      <form className="auth-actual-form" onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          id="name"
          name="name"
          type="text"
          placeholder="e.g. Prem Solanki"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        <Input
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="your.email@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          hint="University or personal email"
          required
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="Create a secure password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />

        <Input
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          required
        />

        <div className="terms-checkbox-wrap">
          <label className="remember-checkbox-label">
            <input
              type="checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
            />
            <span>
              I agree to the <span className="terms-highlight">Campus Handover Guidelines</span> and honest ownership policy.
            </span>
          </label>
          {errors.terms && <span className="input-error-msg">{errors.terms}</span>}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Create My Account
        </Button>
      </form>

      <div className="auth-footer-nav">
        <span>Already have an account?</span>
        <Link to="/login" className="auth-switch-link">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Signup;

