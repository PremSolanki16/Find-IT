import React from 'react';
import Button from './Button';
import './EmptyState.css';

export const EmptyState = ({
  icon = '📦',
  title = 'No items found',
  message = 'There is nothing to display here right now.',
  actionText = null,
  onAction = null,
  actionIcon = null,
  children = null
}) => {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon">
        {typeof icon === 'string' ? <span>{icon}</span> : icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionText && onAction && (
        <div className="empty-state-action">
          <Button variant="primary" onClick={onAction} icon={actionIcon}>
            {actionText}
          </Button>
        </div>
      )}
      {children}
    </div>
  );
};

export default EmptyState;

