import React from 'react';
import ItemCard from './ItemCard';
import EmptyState from '../common/EmptyState';
import Loader from '../common/Loader';
import './ItemGrid.css';

export const ItemGrid = ({
  items = [],
  isLoading = false,
  emptyTitle = 'No items found',
  emptyMessage = 'Try adjusting your search keywords or filter options.',
  emptyActionText = null,
  onEmptyAction = null
}) => {
  if (isLoading) {
    return <Loader size="lg" text="Searching items..." />;
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title={emptyTitle}
        message={emptyMessage}
        actionText={emptyActionText}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="item-grid">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
};

export default ItemGrid;

