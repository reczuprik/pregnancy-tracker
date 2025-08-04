// src/components/history/HistoryView.tsx (Corrected and Complete)

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Measurement, CalculationResult, MeasurementInput } from '../../types/measurement';
import { MeasurementService } from '../../services/database';
import { calculateMeasurement } from '../../services/calculations';
import GrowthChart from './GrowthChart';
import ResultsCard from '../common/ResultsCard'; // Your reusable ResultsCard

interface HistoryViewProps {
  measurements: Measurement[];
  onMeasurementsChange: () => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ measurements, onMeasurementsChange }) => {
  const { t } = useTranslation();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showChart, setShowChart] = useState<'crl' | 'bpd' | 'hc' | 'fl' | null>(null);
  const [selectedResult, setSelectedResult] = useState<CalculationResult | null>(null);

  const handleRowClick = (measurement: Measurement) => {
    // FIX: Construct a valid MeasurementInput object with the date
    const inputForCalc: MeasurementInput = {
      date: measurement.date,
      ...measurement.measurements
    };
    const result = calculateMeasurement(inputForCalc);
    setSelectedResult(result);
  };

  // FIX: Added event parameter to stop propagation
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevents the row's click event from firing
    if (window.confirm(t('history.confirmDelete'))) {
      setLoadingAction(id + '_delete');
      await MeasurementService.deleteMeasurement(id);
      onMeasurementsChange();
      setLoadingAction(null);
    }
  };

  // FIX: Added event parameter to stop propagation
  const handleSetOfficial = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevents the row's click event from firing
    setLoadingAction(id + '_official');
    await MeasurementService.setOfficialMeasurement(id);
    onMeasurementsChange();
    setLoadingAction(null);
  };

  if (measurements.length === 0) {
    return (
      <div className="history-view-container">
        <h2>{t('history.title')}</h2>
        <p className="no-data-message">{t('history.noData')}</p>
      </div>
    );
  }

  return (
    <div className="history-view-container">
      <h2>{t('history.title')}</h2>

      <div className="chart-controls btn-group">
        <button onClick={() => setShowChart(showChart === 'crl' ? null : 'crl')} className={`btn btn-secondary ${showChart === 'crl' ? 'active' : ''}`}>CRL</button>
        <button onClick={() => setShowChart(showChart === 'bpd' ? null : 'bpd')} className={`btn btn-secondary ${showChart === 'bpd' ? 'active' : ''}`}>BPD</button>
        <button onClick={() => setShowChart(showChart === 'hc' ? null : 'hc')} className={`btn btn-secondary ${showChart === 'hc' ? 'active' : ''}`}>HC</button>
        <button onClick={() => setShowChart(showChart === 'fl' ? null : 'fl')} className={`btn btn-secondary ${showChart === 'fl' ? 'active' : ''}`}>FL</button>
      </div>
      
      {showChart === 'crl' && <GrowthChart measurements={measurements} parameter="crl_mm" title="CRL Growth Chart" />}
        {showChart === 'bpd' && <GrowthChart measurements={measurements} parameter="bpd_mm" title="BPD Growth Chart" />}
        {showChart === 'hc' && <GrowthChart measurements={measurements} parameter="hc_mm" title="HC Growth Chart" />}
        {showChart === 'fl' && <GrowthChart measurements={measurements} parameter="fl_mm" title="FL Growth Chart" />}

      <div className="history-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{t('history.columns.date')}</th>
              <th>{t('history.columns.age')}</th>
              <th>{t('history.columns.crl')}</th>
              <th>{t('history.columns.bpd')}</th>
              <th>{t('history.columns.hc')}</th>
              <th>{t('history.columns.fl')}</th>
              <th style={{ textAlign: 'center' }}>{t('common.official')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((m) => (
              // FIX: Added onClick handler and clickable-row class
              <tr key={m.id} className={`clickable-row ${m.isOfficial ? 'official-row' : ''}`} onClick={() => handleRowClick(m)}>
                <td>{m.date}</td>
                <td>{`${m.gestationalWeek}${t('results.weeks')[0]} ${m.gestationalDay}${t('results.days')[0]}`}</td>
                <td>{m.measurements.crl_mm || '-'}</td>
                <td>{m.measurements.bpd_mm || '-'}</td>
                <td>{m.measurements.hc_mm || '-'}</td>
                <td>{m.measurements.fl_mm || '-'}</td>
                <td style={{ textAlign: 'center' }}>
                  {m.isOfficial ? (
                    <span className="official-badge" title={t('common.official') as string}>✓</span>
                  ) : (
                    <button className="action-button" onClick={(e) => handleSetOfficial(e, m.id)} disabled={loadingAction === m.id + '_official'}>
                      {loadingAction === m.id + '_official' ? '...' : t('history.actions.setOfficial')}
                    </button>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="action-button danger" onClick={(e) => handleDelete(e, m.id)} disabled={loadingAction === m.id + '_delete'}>
                    {loadingAction === m.id + '_delete' ? '...' : t('history.actions.delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NEW: This is the missing modal implementation */}
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