// src/components/common/OfficialStatus.tsx

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

  // --- Calculate Current Status based on the Official Measurement ---
  const today = new Date();
  const measurementDate = new Date(officialMeasurement.date);
  
  // How many days have passed since the official measurement was taken?
  const daysSinceMeasurement = differenceInDays(today, measurementDate);

  // Calculate the current gestational age in days
  const officialGestationalAgeInDays = (officialMeasurement.gestationalWeek * 7) + officialMeasurement.gestationalDay;
  const currentGestationalAgeInDays = officialGestationalAgeInDays + daysSinceMeasurement;

  const currentWeek = Math.floor(currentGestationalAgeInDays / 7);
  const currentDay = currentGestationalAgeInDays % 7;

  // Calculate remaining days
  const remainingDays = 280 - currentGestationalAgeInDays;

  const sizeComparison = SIZE_COMPARISONS[currentWeek] || '...';

  return (
    <div className="status-dashboard">
      <div className="status-item">
        <div className="status-value">{`${currentWeek}w ${currentDay}d`}</div>
        <div className="status-label">{t('results.gestationalAge')}</div>
      </div>
      <div className="status-item-main">
        <div className="status-value-main">{format(new Date(officialMeasurement.estimatedDueDate), 'yyyy. MMM dd.')}</div>
        <div className="status-label-main">{t('results.dueDate')}</div>
        <div className="status-countdown">{remainingDays > 0 ? `${remainingDays} ${t('results.days')} to go` : t('common.congratulations')}</div>
      </div>
      <div className="status-item">
        <div className="status-value">{t(`sizes.${sizeComparison}`)}</div>
        <div className="status-label">{t('results.sizeComparison', { comparison: '' }).trim()}</div>
      </div>
    </div>
  );
};

export default OfficialStatus;