import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllItemsApi } from '../../services/api';
import ItemGrid from '../../components/items/ItemGrid';
import SearchBar from '../../components/items/SearchBar';
import FilterSidebar from '../../components/items/FilterSidebar';
import Pagination from '../../components/common/Pagination';
import Button from '../../components/common/Button';
import { FilterIcon } from '../../components/common/Icons';
import './BrowseItems.css';

export const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch all available items from the backend when the page loads
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        setError('');

        const response = await getAllItemsApi();
        setItems(response.items || []);
      } catch (error) {
        setError(error.message || 'Failed to load items.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);


  // Filter state
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all',
    category: searchParams.get('category') || 'all',
    location: '',
    startDate: '',
    endDate: '',
    status: 'all',
    sortBy: 'newest'
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const pageSize = 6;

  // Sync from URL changes
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const catParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    if (typeParam || catParam || searchParam !== null) {
      setFilters(prev => ({
        ...prev,
        type: typeParam || prev.type,
        category: catParam || prev.category
      }));
      if (searchParam !== null) {
        setSearchQuery(searchParam);
      }
    }
  }, [searchParams]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      category: 'all',
      location: '',
      startDate: '',
      endDate: '',
      status: 'all',
      sortBy: 'newest'
    });
    setSearchQuery('');
    setSearchParams({});
    setCurrentPage(1);
  };

  // Filter & Sort Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Type
      if (filters.type !== 'all' && item.type !== filters.type) return false;

      // Category
      if (filters.category !== 'all' && item.category !== filters.category) return false;

      // Status
      if (filters.status !== 'all' && item.status !== filters.status) return false;

      // Location
      if (filters.location.trim()) {
        const loc = filters.location.toLowerCase();
        if (!item.locationName.toLowerCase().includes(loc) && 
            !(item.locationDetails && item.locationDetails.toLowerCase().includes(loc))) {
          return false;
        }
      }

      // Date Range
      if (filters.startDate && new Date(item.eventDate) < new Date(filters.startDate)) return false;
      // Include the entire selected end date
      if (filters.endDate && new Date(item.eventDate) >= new Date(new Date(filters.endDate).getTime() + 24 * 60 * 60 * 1000)) return false;
      
      // Keyword Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(query);
        const inDesc = item.description.toLowerCase().includes(query);
        const inLoc = item.locationName.toLowerCase().includes(query);
        if (!inTitle && !inDesc && !inLoc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (filters.sortBy === 'title_asc') return a.title.localeCompare(b.title);
      if (filters.sortBy === 'title_desc') return b.title.localeCompare(a.title);
      return 0;
    });
  }, [items, filters, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = filteredItems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="browse-page-root section-py">
      <div className="container">
        {/* Page Top Header */}
        <div className="browse-header-row">
          <div>
            <h1 className="browse-title">Browse Lost & Found Belongings</h1>
            <p className="browse-subtitle">
              Discover recently reported lost belongings and found items across the campus.
            </p>
          </div>

          <div className="browse-search-top">
            <SearchBar
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              onSearch={() => setCurrentPage(1)}
              placeholder="Search by keywords, items, or rooms..."
            />
          </div>
        </div>

        {/* Mobile Filter Trigger Bar */}
        <div className="mobile-filter-bar">
          <Button
            variant="outline"
            size="sm"
            icon={<FilterIcon size={16} />}
            onClick={() => setMobileFiltersOpen(true)}
          >
            Filters & Sorting
          </Button>
          <span className="mobile-results-count">
            {filteredItems.length} items found
          </span>
        </div>

        {/* Main Grid + Sidebar Layout */}
        <div className="browse-layout-grid">
          {/* Left Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredItems.length}
            isMobileOpen={mobileFiltersOpen}
            onCloseMobile={() => setMobileFiltersOpen(false)}
          />

          {/* Right Items Grid Area */}
          <div className="browse-results-area">
            <div className="results-meta-bar">
              <span className="results-count-text">
                Showing <strong>{paginatedItems.length}</strong> of <strong>{filteredItems.length}</strong> posts
              </span>
              {(filters.type !== 'all' || filters.category !== 'all' || searchQuery) && (
                <button type="button" className="clear-all-link" onClick={handleResetFilters}>
                  Clear all active filters ✕
                </button>
              )}
            </div>

            {isLoading ? (
              <p>Loading items...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
                <ItemGrid
                  items={paginatedItems}
                  emptyTitle="No matching belongings found"
                  emptyMessage="We couldn't find any lost or found items matching your current filters. Try relaxing your location or search terms."
                  emptyActionText="Reset All Filters"
                  onEmptyAction={handleResetFilters}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseItems;

