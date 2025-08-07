// src/components/common/OfficialStatus.tsx (FINAL Corrected Layout)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInDays, format } from 'date-fns'; 
import { Measurement } from '../../types/measurement';
import { SIZE_COMPARISONS } from '../../services/calculations';

interface OfficialStatusProps {
  officialMeasurement: Measurement;
}

const OfficialStatus: React.FC<OfficialStatusProps> = ({ officialMeasurement }) => {
  const { t } = useTranslation();

  // --- Dynamic Counter Calculation (This logic is correct) ---
  const today = new Date();
  const measurementDate = new Date(officialMeasurement.date);
  const daysSinceMeasurement = differenceInDays(today, measurementDate);
  const officialGestationalAgeInDays = (officialMeasurement.gestationalWeek * 7) + officialMeasurement.gestationalDay;
  const currentGestationalAgeInDays = Math.min(280, officialGestationalAgeInDays + daysSinceMeasurement);
  const currentWeek = Math.floor(currentGestationalAgeInDays / 7);
  const currentDay = currentGestationalAgeInDays % 7;
  const remainingDays = 280 - currentGestationalAgeInDays;
  const sizeComparison = SIZE_COMPARISONS[currentWeek] || '...';
  const progressPercentage = Math.round((currentGestationalAgeInDays / 280) * 100);
  const weekAbbreviation = t('results.weeks')[0]; // "h" in Hungarian, "w" in English
  const dayAbbreviation = t('results.days')[0];   // "n" in Hungarian, "d" in English

  return (
    // The entire component is a single flex column
    <div className="status-dashboard">
      
      {/* 1. Header Section */}
      <div className="dashboard-header">
        <div className="status-item">
             <div className="status-value">{`${currentWeek}${weekAbbreviation} ${currentDay}${dayAbbreviation}`}</div>
          <div className="status-label">{t('results.gestationalAge')}</div>
        </div>
        <div className="status-item-main">
          <div className="status-value-main">{format(new Date(officialMeasurement.estimatedDueDate), 'yyyy. MMM dd.')}</div>
          <div className="status-label-main">{t('results.dueDate')}</div>
        </div>

        <div className="status-item">
          <div className="status-value">{remainingDays > 0 ? remainingDays : '✓'}</div>
          <div className="status-label">
            {remainingDays > 0 
              ? t('results.daysLeft_unit') 
              : t('common.congratulations')
            }
          </div>
        </div>
      </div>

      {/* 2. Body Section: Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="progress-bar-labels">
          <span>0w</span>
          <span>40w</span>
        </div>
      </div>

      {/* 3. Footer Section: Size Comparison */}
      <div className="size-comparison">
        {t('results.sizeComparison', { comparison: t(`sizes.${sizeComparison}`) })}
      </div>

    </div>
  );
};

export default OfficialStatus;