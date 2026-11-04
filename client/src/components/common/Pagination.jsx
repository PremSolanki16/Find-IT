import React from 'react';
import './Pagination.css';

export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="pagination-nav" aria-label="Pagination">
      <button
        type="button"
        className="pagination-btn pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Previous
      </button>

      <div className="pagination-numbers">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`pagination-num ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="pagination-btn pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </button>
    </nav>
  );
};

export default Pagination;

