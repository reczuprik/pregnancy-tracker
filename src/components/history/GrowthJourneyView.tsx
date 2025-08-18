// Updated GrowthJourneyView.tsx with better grouped controls

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Measurement } from '../../types/measurement';
import GrowthChart from './GrowthChart';

interface GrowthJourneyViewProps {
  measurements: Measurement[];
  officialMeasurement?: Measurement;
}

type ChartableParameter = 'crl_mm' | 'fl_mm' | 'bpd_mm' | 'hc_mm' | 'ac_mm';

const GrowthJourneyView: React.FC<GrowthJourneyViewProps> = ({ measurements, officialMeasurement }) => {
  const { t } = useTranslation();
  const [activeChart, setActiveChart] = useState<ChartableParameter>('crl_mm');

  return (
    <div className="growth-journey-view">
      <div className="view-header">
        <NavLink to="/history" className="btn btn-secondary btn-full">
          &lt; {t('history.actions.hideChart')}
        </NavLink>
      </div>
      
      <div className="chart-analytics-area">
        <div className="chart-controls">
          {/* Early Pregnancy Group */}
          <div className="measurement-group early-pregnancy">
            <span className="group-label">Early Pregnancy</span>
            <div className="group-buttons">
              <button 
                onClick={() => setActiveChart('crl_mm')} 
                className={`btn-tertiary ${activeChart === 'crl_mm' ? 'active' : ''}`}
              >
                CRL
              </button>
            </div>
          </div>

          {/* Later Pregnancy Group */}
          <div className="measurement-group later-pregnancy">
            <span className="group-label">Biometric Parameters</span>
            <div className="group-buttons">
              <button 
                onClick={() => setActiveChart('bpd_mm')} 
                className={`btn-tertiary ${activeChart === 'bpd_mm' ? 'active' : ''}`}
              >
                BPD
              </button>
              <button 
                onClick={() => setActiveChart('hc_mm')} 
                className={`btn-tertiary ${activeChart === 'hc_mm' ? 'active' : ''}`}
              >
                HC
              </button>
              <button 
                onClick={() => setActiveChart('ac_mm')} 
                className={`btn-tertiary ${activeChart === 'ac_mm' ? 'active' : ''}`}
              >
                AC
              </button>
              <button 
                onClick={() => setActiveChart('fl_mm')} 
                className={`btn-tertiary ${activeChart === 'fl_mm' ? 'active' : ''}`}
              >
                FL
              </button>
            </div>
          </div>
        </div>
        
        <GrowthChart 
          measurements={measurements} 
          parameter={activeChart} 
          officialMeasurement={officialMeasurement} 
        />
      </div>
    </div>
  );
};

export default GrowthJourneyView;