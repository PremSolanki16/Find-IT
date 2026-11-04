import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertCircleIcon } from './Icons';
import './ConfirmationDialog.css';

export const ConfirmationDialog = ({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="confirm-dialog-content">
        <div className={`confirm-icon-wrapper confirm-${confirmVariant}`}>
          <AlertCircleIcon size={24} />
        </div>
        <p className="confirm-message">{message}</p>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;

