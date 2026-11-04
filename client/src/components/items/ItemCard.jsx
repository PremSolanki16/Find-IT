import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { MapPinIcon, CalendarIcon, GiftIcon } from '../common/Icons';
import { formatDate, getCategoryLabel, getCategoryIcon } from '../../utils/formatters';
import './ItemCard.css';

export const ItemCard = ({ item, showActions = true }) => {
  if (!item) return null;

  const displayImage = (item.imageUrls && item.imageUrls.length > 0)
    ? item.imageUrls[0]
    : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="item-card card card-interactive">
      {/* Thumbnail Header */}
      <div className="item-card-image-wrap">
        <img 
          src={displayImage} 
          alt={item.title} 
          className="item-card-image"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="item-card-badges-top">
          <StatusBadge type={item.type} size="sm" />
          <StatusBadge status={item.status} size="sm" />
        </div>

        {item.isRewardOffered && (
          <div className="item-card-reward-badge" title={item.rewardDetails || "Reward offered"}>
            <GiftIcon size={12} color="#ffffff" />
            <span>Reward</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="item-card-body">
        <div className="item-card-category">
          <span>{getCategoryIcon(item.category)}</span>
          <span>{getCategoryLabel(item.category)}</span>
        </div>

        <h3 className="item-card-title">
          <Link to={`/items/${item._id}`}>{item.title}</Link>
        </h3>

        <p className="item-card-desc">
          {item.description}
        </p>

        {/* Metadata */}
        <div className="item-card-meta">
          <div className="meta-row location">
            <MapPinIcon size={14} color="var(--color-text-muted)" />
            <span title={item.locationName}>{item.locationName}</span>
          </div>
          <div className="meta-row date">
            <CalendarIcon size={14} color="var(--color-text-muted)" />
            <span>{formatDate(item.eventDate)}</span>
          </div>
        </div>

        {/* Card Footer Action */}
        {showActions && (
          <div className="item-card-footer">
            <Link to={`/items/${item._id}`} className="item-card-action-btn">
              {item.type === 'found' && item.status === 'open' ? 'View & Claim Item' : 'View Details'}
              <span className="action-arrow">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;

