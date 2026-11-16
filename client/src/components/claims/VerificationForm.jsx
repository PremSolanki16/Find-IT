
import React, { useState } from 'react';
import Button from '../common/Button';
import FormField from '../common/FormField';
import { ShieldCheckIcon } from '../common/Icons';
import './VerificationForm.css';

export const VerificationForm = ({
  item,
  questions = [],
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  const handleAnswerChange = (index, value) => {
    setAnswers(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const validate = () => {
    const errs = {};

    questions.forEach((question, index) => {
      const questionKey = question.index ?? index;

      if (!answers[questionKey]?.trim()) {
        errs[questionKey] = 'Please provide an answer to this question.';
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const submittedAnswers = questions.map((question, index) => {
      const questionKey = question.index ?? index;

      return {
        question: question.question,
        answer: answers[questionKey].trim()
      };
    });

    onSubmit({
      itemId: item._id,
      answers: submittedAnswers
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

      {questions.map((question, index) => {
        const questionKey = question.index ?? index;

        return (
          <FormField
            key={questionKey}
            label={`${index + 1}. ${question.question}`}
            htmlFor={`answer-${questionKey}`}
            required
            error={errors[questionKey]}
          >
            <textarea
              id={`answer-${questionKey}`}
              rows={3}
              className={`form-textarea ${errors[questionKey] ? 'has-error' : ''}`}
              placeholder="Enter your answer..."
              value={answers[questionKey] || ''}
              onChange={(e) =>
                handleAnswerChange(questionKey, e.target.value)
              }
            />
          </FormField>
        );
      })}

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
