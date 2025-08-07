// src/components/history/HistoryView.tsx (FINAL Simplified Version)

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Measurement, CalculationResult, MeasurementInput } from '../../types/measurement';
import { MeasurementService } from '../../services/database';
import { calculateMeasurement } from '../../services/calculations';
import ResultsCard from '../common/ResultsCard';
import MeasurementCard from './MeasurementCard';
import GrowthChart from './GrowthChart';

interface HistoryViewProps {
  measurements: Measurement[];
  onMeasurementsChange: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ measurements, onMeasurementsChange }) => {
  const { t } = useTranslation();
  const [selectedResult, setSelectedResult] = useState<CalculationResult | null>(null);
  const [isChartAreaVisible, setIsChartAreaVisible] = useState(false);
  const [activeChart, setActiveChart] = useState<'crl' | 'bpd' | 'hc' | 'fl' | null>(null);
  const officialMeasurement = measurements.find(m => m.isOfficial === 1);


  const handleRowClick = (measurement: Measurement) => {
    const inputForCalc: MeasurementInput = { date: measurement.date, ...measurement.measurements };
    const result = calculateMeasurement(inputForCalc);
    setSelectedResult(result);
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
  
  const handleChartButtonClick = (chart: 'crl' | 'bpd' | 'hc' | 'fl') => {
    setActiveChart(prev => prev === chart ? null : chart);
  }

  if (measurements.length === 0) {
    return (
      <div className="history-view-container">
        <p className="no-data-message">{t('history.noData')}</p>
      </div>
    );
  }
   return (
    <div className="history-view-container">
      {/* The "Show Charts" button now uses the unified .btn-secondary style */}
      <div className="btn-group">
          <button 
            onClick={() => setIsChartAreaVisible(!isChartAreaVisible)}
            className="btn btn-secondary btn-full"
          >
            {isChartAreaVisible ? t('history.actions.hideChart') : t('history.actions.chart')}
          </button>
      </div>

      {isChartAreaVisible && (
        <div className="chart-analytics-area">
          <div className="chart-controls">
            {/* These buttons now correctly call handleChartButtonClick */}
            <button onClick={() => handleChartButtonClick('crl')} className={`btn-tertiary ${activeChart === 'crl' ? 'active' : ''}`}>CRL</button>
            <button onClick={() => handleChartButtonClick('bpd')} className={`btn-tertiary ${activeChart === 'bpd' ? 'active' : ''}`}>BPD</button>
            <button onClick={() => handleChartButtonClick('hc')} className={`btn-tertiary ${activeChart === 'hc' ? 'active' : ''}`}>HC</button>
            <button onClick={() => handleChartButtonClick('fl')} className={`btn-tertiary ${activeChart === 'fl' ? 'active' : ''}`}>FL</button>
          </div>
      
          {activeChart === 'crl' && <GrowthChart measurements={measurements} parameter="crl_mm" officialMeasurement={officialMeasurement} />}
          {activeChart === 'bpd' && <GrowthChart measurements={measurements} parameter="bpd_mm" officialMeasurement={officialMeasurement} />}
          {activeChart === 'hc' && <GrowthChart measurements={measurements} parameter="hc_mm" officialMeasurement={officialMeasurement} />}
          {activeChart === 'fl' && <GrowthChart measurements={measurements} parameter="fl_mm" officialMeasurement={officialMeasurement} />}
        
        </div>
      )}

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
            <ResultsCard result={selectedResult} />
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