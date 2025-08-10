// src/components/history/AccordionMeasurementCard.tsx (FINAL Polished Version)
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Measurement, CalculationResult } from '../../types/measurement'; // Assuming you might need CalculationResult for percentile logic
import { calculateMeasurement } from '../../services/calculations'; // For getting percentiles
import { differenceInDays } from 'date-fns'; 

const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.71c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;
const ChevronIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>;
const roundPercentile = (p: number) => Math.round(p / 5) * 5;

interface AccordionMeasurementCardProps {
  measurement: Measurement;
  isExpanded: boolean;
  officialMeasurement?: Measurement; // Now accepts this for comparison
  onClick: () => void;
  onSetOfficial: (e: React.MouseEvent, id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

const AccordionMeasurementCard: React.FC<AccordionMeasurementCardProps> = ({ measurement, isExpanded, officialMeasurement, onClick, onSetOfficial, onDelete }) => {
  const { t } = useTranslation();
  const { date, gestationalWeek, gestationalDay, measurements, isOfficial, id } = measurement;
  
  // Perform calculation to get percentile data for this card
  const calculation = calculateMeasurement({ date, ...measurements });
    // --- ✨ FINAL, CORRECT Re-Dating Logic for Display ---
  let displayWeek = measurement.gestationalWeek;
  let displayDay = measurement.gestationalDay;
  if (officialMeasurement) {
    const officialAgeInDays = (officialMeasurement.gestationalWeek * 7) + officialMeasurement.gestationalDay;
    const dateOfOfficialScan = new Date(officialMeasurement.date);
    const dateOfCurrentScan = new Date(measurement.date);
    const dayDifference = differenceInDays(dateOfCurrentScan, dateOfOfficialScan);
    const reDatedGestationalAgeInDays = officialAgeInDays + dayDifference;
    displayWeek = Math.floor(reDatedGestationalAgeInDays / 7);
    displayDay = reDatedGestationalAgeInDays % 7;
  }

  const handleActionClick = (e: React.MouseEvent, handler: (e: React.MouseEvent, id: string) => void) => {
    e.stopPropagation();
    handler(e, id);
  };
  return (
    <div className={`accordion-measurement-card ${isExpanded ? 'expanded' : ''} ${isOfficial === 1 ? 'official' : ''}`} onClick={onClick}>
      <div className="card-header-collapsed">
        <div className="collapsed-info">
          <div className="card-title">{date}</div>
        </div>
        <div className="collapsed-age">
          {/* ✨ FIX: ALWAYS displays the "true" (re-dated) age. No more confusing labels. */}
          <div className="age-value">{`${displayWeek}${t('results.weeks')} ${displayDay}${t('results.days')}`}</div>
        </div>
        <div className="chevron-container"><ChevronIcon /></div>
      </div>

      <div className="card-details-wrapper">
        <div className="card-details-content">
          <div className="details-section">
            <div className="details-section-title">{t('history.measurementDataTitle')}</div>
            <div className="card-body">
    
              {Object.entries(measurements).map(([key, value]) => {
                // Only render the item if it has a valid value
                if (value == null) return null;
                
                return (
                  <div className="measurement-item" key={key}>
                    <span>{t(`measurement.form.${key.replace('_mm', '')}`)}</span>
                    <span>{value}mm</span>
                  </div>
                );
              })}
            
            </div>
          </div>
          
          {calculation?.percentiles && calculation.percentiles.length > 0 && (
            <div className="details-section">
              <div className="details-section-title">{t('history.growthAnalysisTitle')}</div>
              <div className="card-body">
                {calculation.percentiles.map(p => (
                  <div className="measurement-item" key={p.parameter}>
                    {/* ✨ FIX: Using a simpler, correct translation key */}
                    <span>{t('history.growthRateLabel', { parameter: p.parameter })}</span>
                    <span className="reassurance-text">
                      {/* ✨ FIX: Rounding the percentile */}
                      ~{roundPercentile(p.percentile)}th ({t('history.reassuranceText')})
                    </span>
                  </div>
                ))}
                {isOfficial !== 1 && (
                  <div className="measurement-item-deemphasized">
                    <span>{t('history.estimatedAgeFromSize')}</span>
                    <span>{`${calculation.gestationalWeek}w ${calculation.gestationalDay}d`}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="card-actions">
            {isOfficial !== 1 && (
              <button className="icon-button" onClick={(e) => handleActionClick(e, onSetOfficial)}><HeartIcon /></button>
            )}
            <button className="icon-button danger" onClick={(e) => handleActionClick(e, onDelete)}><TrashIcon /></button>
          </div>
        </div>
      </div>
      <div className="official-strip"></div>
    </div>
  );
};

export default AccordionMeasurementCard;
