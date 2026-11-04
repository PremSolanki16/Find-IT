import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon } from './Icons';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer-root">
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand">
              <div className="brand-logo-mark small">
                <span className="logo-letter">F</span>
              </div>
              <span className="brand-name">Find<span>It</span></span>
            </Link>
            <p className="footer-desc">
              The trusted campus and community Lost & Found platform. Connecting finders with rightful owners safely, swiftly, and privately.
            </p>
            <div className="footer-trust-badge">
              <ShieldCheckIcon size={18} color="var(--color-success)" />
              <span>Verified Campus Handover Protocol</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/browse">Browse All Items</Link></li>
              <li><Link to="/browse?type=lost">Lost Items</Link></li>
              <li><Link to="/browse?type=found">Found Items</Link></li>
              <li><Link to="/report/lost">Report Lost Item</Link></li>
              <li><Link to="/report/found">Report Found Item</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/browse?category=electronics">Electronics</Link></li>
              <li><Link to="/browse?category=bags">Bags & Backpacks</Link></li>
              <li><Link to="/browse?category=accessories">Wallets & Jewelry</Link></li>
              <li><Link to="/browse?category=keys">Keys & Fobs</Link></li>
              <li><Link to="/browse?category=documents">Documents & Books</Link></li>
            </ul>
          </div>

          {/* Safety & Guidelines */}
          <div className="footer-col">
            <h4 className="footer-heading">Safety & Support</h4>
            <ul className="footer-links">
              <li><a href="#how-it-works">How FindIt Works</a></li>
              <li><span className="footer-text-link">Safe Handover Guidelines</span></li>
              <li><span className="footer-text-link">Privacy Protection</span></li>
              <li><span className="footer-text-link">Report Suspicious Activity</span></li>
            </ul>
            <div className="safety-note">
              <strong>Tip:</strong> Always meet in open public campus areas such as the library reception or student union.
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} FindIt – Lost & Found Platform. All rights reserved.
          </p>
          <div className="footer-bottom-badges">
            <span className="architecture-tag">Frontend Engine v1.0 • Ready for MongoDB Integration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

