import React from 'react';
import './Button.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    isLoading ? 'btn-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && <span className="btn-spinner" />}
      {!isLoading && icon && iconPosition === 'left' && <span className="btn-icon left">{icon}</span>}
      <span className="btn-text">{children}</span>
      {!isLoading && icon && iconPosition === 'right' && <span className="btn-icon right">{icon}</span>}
    </button>
  );
};

export default Button;

