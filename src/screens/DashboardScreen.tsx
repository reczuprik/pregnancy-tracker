// src/screens/DashboardScreen.tsx (FINAL Corrected Hierarchy)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInDays, format } from 'date-fns';
import { Measurement } from '../types/measurement';
import ProgressRing from '../components/dashboard/ProgressRing';
import { SIZE_COMPARISONS } from '../services/calculations';
import { enUS, hu, de, fr } from 'date-fns/locale';

import { formatDate } from '../services/formatDate';



import StrawberryIllustration from '@/assets/illustrations/strawberry';


interface DashboardScreenProps {
  officialMeasurement: Measurement;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ officialMeasurement }) => {
  const { t,i18n  } = useTranslation();



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
      {/* ✨ NEW HIERARCHY: Due Date and Current Age are now outside/above the ring */}
      <div className="dashboard-due-date">
        {formatDate(officialMeasurement.estimatedDueDate)}
      </div>
      <div className="dashboard-current-age">
        {`${currentWeek}. ${weekText} ${currentDay}. ${dayText}`}
      </div>

      <ProgressRing progress={progressPercentage}>
        <div className="dashboard-illustration">
            {/* ✨ FIXED: Replaced the placeholder with our new component */}
            <StrawberryIllustration />
        </div>
      </ProgressRing>

      <div className="dashboard-actions">
        <div className="daily-tip-card">💡 {t('dashboard.dailyTip')}</div>
      </div>
    </div>
  );
};

export default DashboardScreen;