import React from 'react';
import { getCategoryLabel, getCategoryIcon } from '../../utils/formatters';
import './CategoryCard.css';

export const CategoryCard = ({ categoryKey, count = 0, onClick, isSelected = false }) => {
  return (
    <button
      type="button"
      className={`category-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="category-card-icon">
        {getCategoryIcon(categoryKey)}
      </div>
      <div className="category-card-info">
        <h4 className="category-card-name">{getCategoryLabel(categoryKey)}</h4>
        <span className="category-card-count">
          {count} {count === 1 ? 'post' : 'posts'}
        </span>
      </div>
    </button>
  );
};

export default CategoryCard;

