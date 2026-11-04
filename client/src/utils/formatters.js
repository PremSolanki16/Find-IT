// Date and text formatters

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return formatDate(dateString);
};

export const CATEGORY_LABELS = {
  electronics: 'Electronics',
  bags: 'Bags & Backpacks',
  clothing: 'Clothing & Apparel',
  documents: 'Documents & Books',
  accessories: 'Accessories & Jewelry',
  keys: 'Keys & Fobs',
  other: 'Other Items'
};

export const CATEGORY_ICONS = {
  electronics: '💻',
  bags: '🎒',
  clothing: '👕',
  documents: '📄',
  accessories: '🕶️',
  keys: '🔑',
  other: '📦'
};

export const getCategoryLabel = (cat) => CATEGORY_LABELS[cat] || 'Other Items';

export const getCategoryIcon = (cat) => CATEGORY_ICONS[cat] || '📦';

