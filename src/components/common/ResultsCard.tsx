// src/components/common/ResultsCard.tsx (FINAL Corrected Localization)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInDays } from 'date-fns';
import { CalculationResult, Measurement } from '../../types/measurement';

interface ResultsCardProps {
  result: CalculationResult;
  showTechnicalDetails: boolean;
  officialMeasurement?: Measurement;
}

const ResultsCard: React.FC<ResultsCardProps> = ({ result, showTechnicalDetails, officialMeasurement }) => {
  const { t } = useTranslation();

  // --- Re-Dating Logic (This is correct) ---
  let displayWeek = result.gestationalWeek;
  let displayDay = result.gestationalDay;

  if (officialMeasurement) {
    const officialAgeInDays = (officialMeasurement.gestationalWeek * 7) + officialMeasurement.gestationalDay;
    const dateOfOfficialScan = new Date(officialMeasurement.date);
    const dateOfCurrentScan = new Date(result.date);
    const dayDifference = differenceInDays(dateOfCurrentScan, dateOfOfficialScan);
    const reDatedGestationalAgeInDays = officialAgeInDays + dayDifference;
    displayWeek = Math.floor(reDatedGestationalAgeInDays / 7);
    displayDay = reDatedGestationalAgeInDays % 7;
  }
  
  // Get the localized abbreviations once
  const weekAbbreviation = t('results.weeks'); // "h" in Hungarian, "w" in English
  const dayAbbreviation = t('results.days');   // "n" in Hungarian, "d" in English

  return (
    <div className="results-section">
      <h2 className="results-title">{t('results.title')}</h2>
      
      <div className="results-content">
        <div className="result-item">
          <span className="result-label">{t('results.gestationalAgeTrue')}</span>
          <span className="result-value">
            {`${displayWeek} ${weekAbbreviation} ${displayDay} ${dayAbbreviation}`}
          </span>
        </div>
        
        {result.percentiles && result.percentiles.length > 0 && (
          <div className="percentile-details">
            {result.percentiles.map(p => (
              <div key={p.parameter} className="result-item">
                <span className="result-label">{t(`measurement.form.${p.parameter.toLowerCase()}`)}</span>
                <span className="result-value">{p.value}mm</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showTechnicalDetails && (
        <div className="technical-details">
          <div className="result-item estimated-age">
            <span className="result-label">{t('results.gestationalAgeEstimated')}</span>
            {/* ✨ FIXED: Now uses the correct localized abbreviations */}
            <span className="result-value">
              {`${result.gestationalWeek} ${weekAbbreviation} ${result.gestationalDay} ${dayAbbreviation}`}
            </span>
          </div>
          <div className="result-item">
            <span className="result-label">{t('results.dueDate')}</span>
            <span className="result-value">{result.estimatedDueDate}</span>
          </div>
        </div>
      )}

      <div className="size-comparison">
        {t('results.sizeComparison', { comparison: t(`sizes.${result.sizeComparison}`) })}
      </div>
    </div>
  );
};

export default ResultsCard;