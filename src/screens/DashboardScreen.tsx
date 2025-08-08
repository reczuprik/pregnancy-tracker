// src/screens/DashboardScreen.tsx (FINAL Corrected Hierarchy)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInDays, format } from 'date-fns';
import { Measurement } from '../types/measurement';
import ProgressRing from '../components/dashboard/ProgressRing';
import { SIZE_COMPARISONS } from '../services/calculations';

interface DashboardScreenProps {
  officialMeasurement: Measurement;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ officialMeasurement }) => {
  const { t } = useTranslation();

  // This calculation logic is correct.
  const today = new Date();
  const measurementDate = new Date(officialMeasurement.date);
  const daysSinceMeasurement = differenceInDays(today, measurementDate);
  const officialAgeInDays = (officialMeasurement.gestationalWeek * 7) + officialMeasurement.gestationalDay;
  const currentGestationalAgeInDays = Math.min(280, officialAgeInDays + daysSinceMeasurement);
  const currentWeek = Math.floor(currentGestationalAgeInDays / 7);
  const currentDay = currentGestationalAgeInDays % 7;
  const progressPercentage = Math.round((currentGestationalAgeInDays / 280) * 100);
  const sizeComparisonKey = SIZE_COMPARISONS[currentWeek] || '...';
  
  const weekText = t('results.weeks');
  const dayText = t('results.days');

  return (
    <div className="dashboard-screen">
      {/* SVG Gradient Definition for the Progress Ring (This part is correct) */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-accent-hover-start)" />
            <stop offset="100%" stopColor="var(--color-accent-end)" />
          </linearGradient>
        </defs>
      </svg>

      {/* ✨ NEW, CORRECT HIERARCHICAL LAYOUT ✨ */}

      {/* 1. The Official Due Date (Top and Most Prominent) */}
      <div className="dashboard-due-date">
        {format(new Date(officialMeasurement.estimatedDueDate), 'yyyy. MMM dd.')}
      </div>

      {/* 2. The Progress Ring with the Illustration INSIDE */}
      <ProgressRing progress={progressPercentage}>
        <div className="dashboard-illustration">
            <span>🍌</span> {/* The banana placeholder */}
        </div>
      </ProgressRing>

      {/* 3. The Current Gestational Age (Below the Ring, Secondary) */}
      <div className="dashboard-current-age">
        {`${currentWeek}. ${weekText} ${currentDay}${dayText}`}
      </div>

      {/* 4. The Action Cards (at the bottom) */}
      <div className="dashboard-actions">
        <div className="daily-tip-card">💡 {t('dashboard.dailyTip')}</div>
      </div>
    </div>
  );
};

export default DashboardScreen;