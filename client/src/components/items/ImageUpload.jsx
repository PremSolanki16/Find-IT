import React, { useRef } from 'react';
import { UploadIcon, XIcon } from '../common/Icons';
import './ImageUpload.css';

export const ImageUpload = ({
  images = [],
  onChange,
  maxImages = 3,
  label = 'Upload Photograph(s)',
  hint = 'High-resolution image showing the item clearly. (Max 5MB)'
}) => {
  const fileInputRef = useRef(null);

  const samplePresets = [
    { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
    { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80' },
    { label: 'Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
    { label: 'Keys', url: 'https://images.unsplash.com/photo-1589824783837-6169889fa20f?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.slice(0, maxImages - images.length).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange([...images, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (indexToRemove) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSelectPreset = (url) => {
    if (images.length < maxImages && !images.includes(url)) {
      onChange([...images, url]);
    }
  };

  return (
    <div className="image-upload-wrapper">
      <div className="image-upload-header">
        <label className="image-upload-label">{label}</label>
        <span className="image-count-indicator">
          {images.length} / {maxImages} uploaded
        </span>
      </div>

      {/* Dropzone */}
      {images.length < maxImages && (
        <div 
          className="image-dropzone"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon size={28} color="var(--color-primary)" />
          <div className="dropzone-text">
            <span className="dropzone-prompt">Click to browse or drag file here</span>
            <span className="dropzone-sub">{hint}</span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Preset Pickers for Quick Demo */}
      <div className="image-presets-row">
        <span className="preset-label">Quick sample photos:</span>
        <div className="preset-chips">
          {samplePresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="preset-chip-btn"
              onClick={() => handleSelectPreset(preset.url)}
              disabled={images.length >= maxImages}
            >
              + {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Previews Grid */}
      {images.length > 0 && (
        <div className="image-previews-grid">
          {images.map((imgUrl, index) => (
            <div key={index} className="image-preview-card">
              <img src={imgUrl} alt={`Upload preview ${index + 1}`} className="preview-img" />
              <button
                type="button"
                className="remove-preview-btn"
                onClick={() => handleRemove(index)}
                aria-label="Remove image"
              >
                <XIcon size={14} />
              </button>
              {index === 0 && <span className="primary-photo-tag">Cover Photo</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

