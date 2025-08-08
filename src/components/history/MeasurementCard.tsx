// src/components/history/MeasurementCard.tsx (FINAL Version with Heart Icon)

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Measurement } from '../../types/measurement';

// ✨ NEW: Replaced the StarIcon with a HeartIcon
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.71c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;

interface MeasurementCardProps {
  measurement: Measurement;
  index: number;
  onSetOfficial: (e: React.MouseEvent, id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  onClick: (measurement: Measurement) => void;
}

const MeasurementCard: React.FC<MeasurementCardProps> = ({ measurement, index, onSetOfficial, onDelete, onClick }) => {
  const { t } = useTranslation();
  const { date, gestationalWeek, gestationalDay, measurements, isOfficial, id } = measurement;

  const validMeasurements = Object.entries(measurements).filter(([key, value]) => value != null);

  return (
    <div 
      className="measurement-card" 
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={() => onClick(measurement)}
    >
      {isOfficial === 1 && (
        <div className="official-badge">{t('common.official')}</div>
      )}
      <div className="card-content">
        <div className="card-header">
          <div className="card-title">{date}</div>
        </div>
        
        <div className="card-body">
          {validMeasurements.map(([key, value]) => (
            <div className="measurement-item" key={key}>
              <span>{t(`measurement.form.${key.replace('_mm', '')}`)}</span>
              <span>{value}mm</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card-actions">
        {isOfficial !== 1 && (
          <button className="icon-button" onClick={(e) => onSetOfficial(e, id)} aria-label={t('history.actions.setOfficial')}>
            <HeartIcon />
          </button>
        )}
        <button className="icon-button danger" onClick={(e) => onDelete(e, id)} aria-label={t('history.actions.delete')}>
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default MeasurementCard;