import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getAllItemsApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import ItemGrid from '../../components/items/ItemGrid';
import SearchBar from '../../components/items/SearchBar';
import CategoryCard from '../../components/items/CategoryCard';
import Button from '../../components/common/Button';
import { 
  PlusIcon, 
  ShieldCheckIcon, 
  MapPinIcon, 
  MessageSquareIcon, 
  ArrowRightIcon 
} from '../../components/common/Icons';
import { CATEGORY_LABELS } from '../../utils/formatters';
import './Home.css';

export const Home = () => {
  const [items, setItems] = useState([]);
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch items from the backend when the home page loads
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAllItemsApi();
        setItems(response.items || []);
      } catch (error) {
        console.error('Failed to load home page items:', error);
      }
    };

    fetchItems();
  }, []);

  // Search submit
  const handleSearch = (query) => {
    navigate(`/browse?search=${encodeURIComponent(query)}`);
  };

  // Recently reported items (newest 6)
  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  // Category counts
  const categoryKeys = Object.keys(CATEGORY_LABELS);
  const getCategoryCount = (cat) => items.filter(i => i.category === cat).length;

  // Platform Statistics
  const totalLost = items.filter(i => i.type === 'lost').length;
  const totalFound = items.filter(i => i.type === 'found').length;
  // Count items successfully returned using backend item data
  const totalCompleted = items.filter(item => item.status === 'returned').length;

  return (
    <div className="home-page-root">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-pulse"></span>
              <span>Trusted Campus Lost & Found Network</span>
            </div>

            <h1 className="hero-title">
              Lost something? Or found an item?<br />
              <span className="text-gradient">We make safe returns effortless.</span>
            </h1>

            <p className="hero-desc">
              FindIt connects people who lost belongings with those who found them. With confidential verification questions and encrypted chat, we ensure items return to their rightful owners.
            </p>

            {/* Main Search Bar */}
            <div className="hero-search-wrapper">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={handleSearch}
                size="lg"
                placeholder="Search lost or found items (e.g. MacBook, keys, wallet, library)..."
              />
            </div>

            {/* Quick Action Buttons */}
            <div className="hero-action-buttons">
              <Link to="/report/lost">
                <Button variant="danger" size="lg" icon={<PlusIcon size={18} />}>
                  Report Lost Item
                </Button>
              </Link>
              <Link to="/report/found">
                <Button variant="primary" size="lg" icon={<PlusIcon size={18} />}>
                  Report Found Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics Section */}
      <section className="stats-strip-section">
        <div className="container">
          <div className="stats-strip-grid">
            <div className="stat-strip-item">
              <span className="stat-strip-num">{totalLost}</span>
              <span className="stat-strip-label">Lost Belongings Reported</span>
            </div>
            <div className="stat-strip-divider" />
            <div className="stat-strip-item">
              <span className="stat-strip-num">{totalFound}</span>
              <span className="stat-strip-label">Found Items Logged</span>
            </div>
            <div className="stat-strip-divider" />
            <div className="stat-strip-item">
              <span className="stat-strip-num">{totalCompleted}</span>
              <span className="stat-strip-label">Successful Returns Completed</span>
            </div>
            <div className="stat-strip-divider" />
            <div className="stat-strip-item">
              <span className="stat-strip-num">Private</span>
              <span className="stat-strip-label">Ownership Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Recently Reported Items Section */}
      <section className="recent-items-section section-py">
        <div className="container">
          <div className="section-header-flex">
            <div>
              <h2 className="section-title-left">Recently Reported Belongings</h2>
              <p className="section-subtitle-left">
                Latest lost and found notices posted across university and public facilities.
              </p>
            </div>
            <Link to="/browse">
              <Button variant="outline" size="md" icon={<ArrowRightIcon size={16} />} iconPosition="right">
                View All {items.length} Items
              </Button>
            </Link>
          </div>

          <ItemGrid items={recentItems} />
        </div>
      </section>

      {/* 4. Browse by Categories Section */}
      <section className="categories-section section-py">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">
            Quickly filter through items by selecting the specific belongings category.
          </p>

          <div className="categories-grid">
            {categoryKeys.map((catKey) => (
              <CategoryCard
                key={catKey}
                categoryKey={catKey}
                count={getCategoryCount(catKey)}
                onClick={() => navigate(`/browse?category=${catKey}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. How FindIt Works Section */}
      <section id="how-it-works" className="how-it-works-section section-py">
        <div className="container">
          <h2 className="section-title">How FindIt Works</h2>
          <p className="section-subtitle">
            A simple, secure 4-step workflow to recover lost belongings safely.
          </p>

          <div className="steps-grid">
            <div className="step-card card">
              <div className="step-number">01</div>
              <div className="step-icon">📢</div>
              <h3 className="step-title">Report or Find</h3>
              <p className="step-desc">
                Post details of what you lost or found. Add photos, approximate location, and date without revealing secret clues.
              </p>
            </div>

            <div className="step-card card">
              <div className="step-number">02</div>
              <div className="step-icon">🔍</div>
              <h3 className="step-title">Search & Claim</h3>
              <p className="step-desc">
                Search campus posts using keywords and filters. Spot your item and submit ownership verification answers.
              </p>
            </div>

            <div className="step-card card">
              <div className="step-number">03</div>
              <div className="step-icon">🛡️</div>
              <h3 className="step-title">Finder Reviews</h3>
              <p className="step-desc">
                The finder compares your proof against confidential features. Once approved, a private chat thread unlocks.
              </p>
            </div>

            <div className="step-card card">
              <div className="step-number">04</div>
              <div className="step-icon">🤝</div>
              <h3 className="step-title">Safe Return</h3>
              <p className="step-desc">
                Coordinate meeting in an open campus location (library or reception). Hand over the item and mark the claim completed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call To Action Section */}
      <section className="cta-section">
        <div className="container cta-container">
          <div className="cta-card">
            <div className="cta-content">
              <h2 className="cta-title">Help Make Your Campus Safer & Kinder</h2>
              <p className="cta-desc">
                Whether you just found a set of keys on a bench or lost your laptop in the library, FindIt gives you the tools to resolve it quickly.
              </p>
              <div className="cta-actions">
                <Link to="/report/lost">
                  <Button variant="danger" size="lg">Report Lost Item</Button>
                </Link>
                <Link to="/report/found">
                  <Button variant="primary" size="lg">Report Found Item</Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/signup">
                    <Button variant="outline" size="lg">Join the Community</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

