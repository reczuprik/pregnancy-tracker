// src/components/history/HistoryView.tsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { Measurement, CalculationResult, MeasurementInput } from '../../types/measurement';
import { MeasurementService } from '../../services/database';
import { calculateMeasurement } from '../../services/calculations';
import ResultsCard from '../common/ResultsCard';
import MeasurementCard from './MeasurementCard';

interface HistoryViewProps {
  measurements: Measurement[];
  officialMeasurement?: Measurement; // <-- Add this
  onMeasurementsChange: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ measurements, officialMeasurement, onMeasurementsChange }) => {
  const { t } = useTranslation();
  const [selectedResult, setSelectedResult] = useState<CalculationResult | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const handleRowClick = (measurement: Measurement) => {
    const inputForCalc: MeasurementInput = { date: measurement.date, ...measurement.measurements };
    const result = calculateMeasurement(inputForCalc);
    setSelectedResult(result);
    // ✨ NEW: Always reset to hidden when opening a new modal

    setIsDetailsVisible(false); 

  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm(t('history.confirmDelete'))) {
      await MeasurementService.deleteMeasurement(id);
      onMeasurementsChange();
    }
  };

  const handleSetOfficial = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await MeasurementService.setOfficialMeasurement(id);
    onMeasurementsChange();
  };
  
  if (measurements.length === 0) {
    return (
      <div className="history-view-container">
        <p className="no-data-message">{t('history.noData')}</p>
      </div>
    );
  }

  return (
    <div className="history-view-container">
      <div className="btn-group">
        <Link to="/journey" className="btn btn-secondary btn-full">
          {t('history.actions.chart')}
        </Link>
      </div>

      <div className="timeline-container">
        {measurements.map((m, index) => (
          <MeasurementCard
            key={m.id}
            measurement={m}
            index={index}
            onClick={handleRowClick}
            onSetOfficial={handleSetOfficial}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {selectedResult && (
        <div className="modal-overlay" onClick={() => setSelectedResult(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ResultsCard 
              result={selectedResult} 
              officialMeasurement={officialMeasurement}
              // ✨ NEW: Pass the state down to the card
              showTechnicalDetails={isDetailsVisible} 
            />
                        {/* ✨ NEW: The toggle button for showing/hiding details */}
            <button 
              className="details-toggle-link" 
              onClick={() => setIsDetailsVisible(!isDetailsVisible)}
            >
              {isDetailsVisible ? t('results.hideDetails') : t('results.showDetails')}
            </button>
            <button onClick={() => setSelectedResult(null)} className="btn btn-secondary" style={{width: '100%', marginTop: '1rem'}}>
              {t('common.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;