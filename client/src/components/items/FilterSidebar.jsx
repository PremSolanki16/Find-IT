import React from 'react';
import { FilterIcon, XIcon } from '../common/Icons';
import Button from '../common/Button';
import { CATEGORY_LABELS } from '../../utils/formatters';
import './FilterSidebar.css';

export const FilterSidebar = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0,
  isMobileOpen = false,
  onCloseMobile = () => {}
}) => {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const categories = Object.keys(CATEGORY_LABELS);

  return (
    <aside className={`filter-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="filter-sidebar-header">
        <div className="filter-title-wrap">
          <FilterIcon size={18} color="var(--color-primary)" />
          <h3 className="filter-title">Filters</h3>
        </div>
        <div className="filter-header-actions">
          <button 
            type="button" 
            className="filter-reset-btn"
            onClick={onResetFilters}
          >
            Reset All
          </button>
          {isMobileOpen && (
            <button 
              type="button" 
              className="filter-close-btn"
              onClick={onCloseMobile}
              aria-label="Close filters"
            >
              <XIcon size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="filter-sidebar-body">
        {/* Post Type (Lost / Found) */}
        <div className="filter-group">
          <label className="filter-group-label">Post Type</label>
          <div className="filter-type-toggle">
            {['all', 'lost', 'found'].map((type) => (
              <button
                key={type}
                type="button"
                className={`type-toggle-btn ${filters.type === type ? 'active' : ''}`}
                onClick={() => handleChange('type', type)}
              >
                {type === 'all' ? 'All Items' : type === 'lost' ? 'Lost' : 'Found'}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="filter-group">
          <label className="filter-group-label" htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
            className="form-select filter-select"
            value={filters.category || 'all'}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((catKey) => (
              <option key={catKey} value={catKey}>
                {CATEGORY_LABELS[catKey]}
              </option>
            ))}
          </select>
        </div>

        {/* Location Keyword */}
        <div className="filter-group">
          <label className="filter-group-label" htmlFor="filter-location">Location</label>
          <input
            id="filter-location"
            type="text"
            className="form-input filter-input"
            placeholder="e.g. Library, Gym, Science Hall..."
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>

        {/* Date Range */}
        <div className="filter-group">
          <label className="filter-group-label">Date Range</label>
          <div className="filter-date-row">
            <div className="date-field">
              <span className="date-sublabel">From</span>
              <input
                type="date"
                className="form-input date-input"
                value={filters.startDate || ''}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>
            <div className="date-field">
              <span className="date-sublabel">To</span>
              <input
                type="date"
                className="form-input date-input"
                value={filters.endDate || ''}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="filter-group">
          <label className="filter-group-label" htmlFor="filter-status">Item Status</label>
          <select
            id="filter-status"
            className="form-select filter-select"
            value={filters.status || 'all'}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open (Unclaimed)</option>
            <option value="claim_pending">Claim Pending</option>
            <option value="returned">Returned to Owner</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="filter-group">
          <label className="filter-group-label" htmlFor="filter-sort">Sort By</label>
          <select
            id="filter-sort"
            className="form-select filter-select"
            value={filters.sortBy || 'newest'}
            onChange={(e) => handleChange('sortBy', e.target.value)}
          >
            <option value="newest">Newest Reported First</option>
            <option value="oldest">Oldest Reported First</option>
            <option value="title_asc">Title (A - Z)</option>
            <option value="title_desc">Title (Z - A)</option>
          </select>
        </div>

        {isMobileOpen && (
          <div className="filter-mobile-apply">
            <Button variant="primary" fullWidth onClick={onCloseMobile}>
              Show {totalResults} Results
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default FilterSidebar;

