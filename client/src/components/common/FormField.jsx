import React from 'react';

export const FormField = ({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
  className = ''
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="form-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}
      {children}
      {error && <span className="form-error">{error}</span>}
      {!error && hint && <span className="form-hint">{hint}</span>}
    </div>
  );
};

export default FormField;

