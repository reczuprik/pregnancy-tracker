// src/components/dashboard/DailyTipCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const DailyTipCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="daily-tip-card">
      <div className="tip-icon">💡</div>
      {t('dashboard.dailyTip')}
    </div>
  );
};

export default DailyTipCard;