import React, { useState } from 'react';
import Button from '../common/Button';
import FormField from '../common/FormField';
import { ShieldCheckIcon } from '../common/Icons';
import './VerificationForm.css';

export const VerificationForm = ({
  item,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!q1.trim()) errs.q1 = 'Please describe the brand, model, color or shape.';
    if (!q2.trim()) errs.q2 = 'Please provide unique markings, contents, or serial numbers.';
    if (!q3.trim()) errs.q3 = 'Please explain where and approximately when you misplaced it.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const answers = [
      {
        question: 'What is the exact brand, model, exterior color or distinct physical shape?',
        answer: q1.trim()
      },
      {
        question: 'Are there any hidden identifying marks, personal contents, scratches or serial identifiers?',
        answer: q2.trim()
      },
      {
        question: 'When and where did you last have this item before misplacing it?',
        answer: q3.trim()
      }
    ];

    onSubmit({
      itemId: item._id,
      answers
    });
  };

  return (
    <form className="verification-form" onSubmit={handleSubmit}>
      <div className="verification-notice-banner">
        <ShieldCheckIcon size={20} color="var(--color-primary)" />
        <div className="notice-content">
          <h4 className="notice-title">Proof of Ownership Verification</h4>
          <p className="notice-desc">
            To prevent fraudulent claims, the finder will review your responses before accepting. Provide specific details only the genuine owner would know.
          </p>
        </div>
      </div>

      <FormField
        label="1. Brand, Model & Exact Physical Appearance"
        htmlFor="q1"
        required
        error={errors.q1}
        hint="e.g. Exact shade, case style, material finish, logos, stickers"
      >
        <textarea
          id="q1"
          rows={3}
          className={`form-textarea ${errors.q1 ? 'has-error' : ''}`}
          placeholder="Describe the exterior appearance in detail..."
          value={q1}
          onChange={(e) => setQ1(e.target.value)}
        />
      </FormField>

      <FormField
        label="2. Hidden Details, Inner Contents or Serial Markings"
        htmlFor="q2"
        required
        error={errors.q2}
        hint="e.g. Scratches, initials, cards inside, lockscreen background, unique tags"
      >
        <textarea
          id="q2"
          rows={3}
          className={`form-textarea ${errors.q2 ? 'has-error' : ''}`}
          placeholder="Describe distinctive internal or subtle features..."
          value={q2}
          onChange={(e) => setQ2(e.target.value)}
        />
      </FormField>

      <FormField
        label="3. Circumstances of Loss (Date, Time, Exact Location)"
        htmlFor="q3"
        required
        error={errors.q3}
        hint="Helps confirm your timeline aligns with when and where the item was discovered."
      >
        <textarea
          id="q3"
          rows={2}
          className={`form-textarea ${errors.q3 ? 'has-error' : ''}`}
          placeholder="e.g. Misplaced on Tuesday afternoon around 2 PM near table 4..."
          value={q3}
          onChange={(e) => setQ3(e.target.value)}
        />
      </FormField>

      <div className="verification-form-actions">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Submit Ownership Claim
        </Button>
      </div>
    </form>
  );
};

export default VerificationForm;

