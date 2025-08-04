// src/components/common/ResultsCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalculationResult } from '../../types/measurement';

interface ResultsCardProps {
  result: CalculationResult;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result }) => {
  const { t } = useTranslation();

  return (
    <div className="results-section">
      <h2 className="results-title">{t('results.title')}</h2>
      <div className="results-content">
        <div className="result-item">
          <span className="result-label">{t('results.gestationalAge')}</span>
          <span className="result-value">
            {`${result.gestationalWeek} ${t('results.weeks')} ${result.gestationalDay} ${t('results.days')}`}
          </span>
        </div>
        <div className="result-item">
          <span className="result-label">{t('results.dueDate')}</span>
          <span className="result-value">{result.estimatedDueDate}</span>
        </div>
      </div>
      
      {/* NEW: Dynamically display all calculated percentiles */}
      {result.percentiles && result.percentiles.length > 0 && (
          <div className="percentile-details">
              {result.percentiles.map(p => (
                  <div key={p.parameter} className="result-item">
                      <span className="result-label">{t('results.percentile', { parameter: p.parameter, percentile: p.percentile })}</span>
                      <span className="result-value">{p.value}mm</span>
                  </div>
              ))}
          </div>
      )}

      <div className="size-comparison">
        {t('results.sizeComparison', { comparison: t(`sizes.${result.sizeComparison}`) })}
      </div>
    </div>
  );
};

export default ResultsCard;