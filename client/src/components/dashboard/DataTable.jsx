import React, { useState } from 'react';
import { SearchIcon } from '../common/Icons';
import Pagination from '../common/Pagination';
import EmptyState from '../common/EmptyState';
import './DataTable.css';

export const DataTable = ({
  columns = [],
  data = [],
  searchable = true,
  searchPlaceholder = 'Search records...',
  emptyMessage = 'No records found matching criteria.',
  pageSize = 8
}) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filteredData = searchable && search.trim()
    ? data.filter(item => {
        const query = search.toLowerCase();
        return Object.values(item).some(val => 
          val && typeof val === 'string' && val.toLowerCase().includes(query)
        );
      })
    : data;

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="data-table-container">
      {searchable && (
        <div className="table-search-bar">
          <SearchIcon size={16} color="var(--color-text-muted)" />
          <input
            type="text"
            className="table-search-input"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ width: col.width || 'auto' }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="table-empty-td">
                  <EmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr key={row._id || rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {col.render 
                        ? col.render(row) 
                        : (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer-pagination">
        <span className="table-counts">
          Showing {paginatedData.length} of {filteredData.length} entries
        </span>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default DataTable;

