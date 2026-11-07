
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

  // Read selected files and create previews while retaining the actual files
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const availableSlots = maxImages - images.length;
    const selectedFiles = files.slice(0, availableSlots);

    const newImages = await Promise.all(
      selectedFiles.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            resolve({
              file,
              preview: reader.result
            });
          };

          reader.onerror = () => reject(new Error('Failed to read image.'));
          reader.readAsDataURL(file);
        });
      })
    );

    onChange([...images, ...newImages]);

    // Allow selecting the same file again
    e.target.value = '';
  };

  // Remove the selected image from the form
  const handleRemove = (indexToRemove) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
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
            <span className="dropzone-prompt">
              Click to browse or drag file here
            </span>
            <span className="dropzone-sub">{hint}</span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="image-previews-grid">
          {images.map((image, index) => (
            <div key={index} className="image-preview-card">
              <img
                src={typeof image === 'string' ? image : image.preview}
                alt={`Upload preview ${index + 1}`}
                className="preview-img"
              />
              <button
                type="button"
                className="remove-preview-btn"
                onClick={() => handleRemove(index)}
                aria-label="Remove image"
              >
                <XIcon size={14} />
              </button>
              {index === 0 && (
                <span className="primary-photo-tag">Cover Photo</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
