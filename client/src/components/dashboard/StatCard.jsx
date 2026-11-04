import React from 'react';
import './StatCard.css';

export const StatCard = ({
  title,
  value,
  subtitle = null,
  icon = null,
  variant = 'primary',
  onClick = null
}) => {
  return (
    <div 
      className={`stat-card stat-${variant} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-card-content">
        <span className="stat-card-title">{title}</span>
        <div className="stat-card-value">{value}</div>
        {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
      </div>

      {icon && (
        <div className="stat-card-icon-wrap">
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;

