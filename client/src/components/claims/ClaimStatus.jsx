import React from 'react';
import StatusBadge from '../common/StatusBadge';
import './ClaimStatus.css';

export const ClaimStatus = ({ status = 'pending' }) => {
  const steps = [
    { key: 'pending', label: 'Submitted' },
    { key: 'review', label: 'Under Review' },
    { key: 'accepted', label: 'Approved' },
    { key: 'completed', label: 'Returned' }
  ];

  const getStepState = (stepKey) => {
    if (status === 'rejected') {
      return stepKey === 'pending' ? 'done' : 'rejected';
    }
    if (status === 'cancelled') {
      return stepKey === 'pending' ? 'done' : 'cancelled';
    }

    if (status === 'pending') {
      if (stepKey === 'pending') return 'active';
      return 'upcoming';
    }
    if (status === 'accepted') {
      if (stepKey === 'pending' || stepKey === 'review') return 'done';
      if (stepKey === 'accepted') return 'active';
      return 'upcoming';
    }
    if (status === 'completed') {
      return 'done';
    }
    return 'upcoming';
  };

  return (
    <div className="claim-status-timeline-wrap">
      <div className="claim-status-header">
        <span className="timeline-title">Claim Progress</span>
        <StatusBadge status={status} size="sm" />
      </div>

      <div className="claim-timeline">
        {steps.map((step, idx) => {
          const state = getStepState(step.key);
          return (
            <div key={step.key} className={`timeline-step ${state}`}>
              <div className="step-circle">
                {state === 'done' ? '✓' : idx + 1}
              </div>
              <span className="step-label">{step.label}</span>
              {idx < steps.length - 1 && <div className="step-connector" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClaimStatus;

