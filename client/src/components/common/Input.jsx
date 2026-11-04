import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from './Icons';
import './Input.css';

export const Input = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  hint,
  required = false,
  disabled = false,
  prefixIcon = null,
  suffixIcon = null,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || name || `input_${Math.random().toString(36).substr(2, 6)}`;

  return (
    <div className={`input-field-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}

      <div className={`input-wrapper ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}>
        {prefixIcon && <span className="input-icon-prefix">{prefixIcon}</span>}

        <input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="input-element"
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(prev => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex="-1"
          >
            {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        )}

        {!isPassword && suffixIcon && (
          <span className="input-icon-suffix">{suffixIcon}</span>
        )}
      </div>

      {error && <span className="input-error-msg">{error}</span>}
      {!error && hint && <span className="input-hint-msg">{hint}</span>}
    </div>
  );
};

export default Input;

