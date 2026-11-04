import React from 'react';
import { SearchIcon, XIcon } from '../common/Icons';
import Button from '../common/Button';
import './SearchBar.css';

export const SearchBar = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search by item name, keyword, or location...',
  size = 'md',
  className = ''
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange({ target: { value: '' } });
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form className={`search-bar-form search-bar-${size} ${className}`} onSubmit={handleSubmit}>
      <div className="search-input-box">
        <span className="search-icon-wrapper">
          <SearchIcon size={size === 'lg' ? 22 : 18} color="var(--color-text-muted)" />
        </span>
        <input
          type="text"
          className="search-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {value && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <XIcon size={16} />
          </button>
        )}
      </div>
      <Button type="submit" variant="primary" size={size}>
        Search
      </Button>
    </form>
  );
};

export default SearchBar;

