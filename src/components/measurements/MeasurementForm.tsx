// src/components/measurements/MeasurementForm.tsx (Final Corrected Version)

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MeasurementService } from '../../services/database';
import { MeasurementInput, CalculationResult } from '../../types/measurement';
import { calculateMeasurement } from '../../services/calculations';
import LoadingSpinner from '../common/LoadingSpinner';

// This interface now matches exactly what the new App.tsx provides.
interface MeasurementFormProps {
  mode: 'crl' | 'hadlock';
  onModeChange: (mode: 'crl' | 'hadlock') => void;
  onMeasurementSaved: () => void;
  setLastSavedResult: (result: CalculationResult) => void;
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ mode, onModeChange, onMeasurementSaved, setLastSavedResult }) => {
  const { t } = useTranslation();
  
  const initialFormState: MeasurementInput = {
    date: new Date().toISOString().split('T')[0],
    crl_mm: undefined, bpd_mm: undefined, hc_mm: undefined, ac_mm: undefined, fl_mm: undefined,
  };

  const [formData, setFormData] = useState<MeasurementInput>(initialFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value ? parseFloat(value) : undefined }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, date: e.target.value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const calculation = calculateMeasurement(formData);
    if (!calculation) {
        setError(t('results.error'));
        setIsSaving(false);
        return;
    }

    const dbResult = await MeasurementService.addMeasurement(formData);

    setIsSaving(false);
    if (dbResult) {
      // Correct Logic:
      // 1. Tell the parent App to reload all its data.
      onMeasurementSaved();
      // 2. Pass the calculated result UP to the parent to be displayed.
      setLastSavedResult(calculation);
    } else {
      setError(t('results.error'));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{marginTop: '24px'}}>
      <div className="form-section">
        <h2 className="form-section-title">{t('measurement.mode.title')}</h2>
        <div className="mode-selector">
          <button type="button" onClick={() => onModeChange('crl')} className={mode === 'crl' ? 'active' : ''}>
            {t('measurement.mode.crl')}
          </button>
          <button type="button" onClick={() => onModeChange('hadlock')} className={mode === 'hadlock' ? 'active' : ''}>
            {t('measurement.mode.hadlock')}
          </button>
        </div>
      </div>
      
      <div className="form-section">
        <div className="form-group">
          <label htmlFor="date" className="form-label">{t('measurement.form.date')}</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleDateChange} required className="form-input" />
        </div>

        {mode === 'crl' ? (
          <div className="form-group">
            <label htmlFor="crl_mm" className="form-label">{t('measurement.form.crl')} ({t('measurement.units.mm')})</label>
            <input type="number" id="crl_mm" name="crl_mm" value={formData.crl_mm || ''} onChange={handleInputChange} step="0.1" required className="form-input" />
          </div>
        ) : (
          <>
            <div className="form-group"><label htmlFor="bpd_mm" className="form-label">{t('measurement.form.bpd')} ({t('measurement.units.mm')})</label><input type="number" id="bpd_mm" name="bpd_mm" value={formData.bpd_mm || ''} onChange={handleInputChange} step="0.1" required className="form-input" /></div>
            <div className="form-group"><label htmlFor="hc_mm" className="form-label">{t('measurement.form.hc')} ({t('measurement.units.mm')})</label><input type="number" id="hc_mm" name="hc_mm" value={formData.hc_mm || ''} onChange={handleInputChange} step="0.1" required className="form-input" /></div>
            <div className="form-group"><label htmlFor="ac_mm" className="form-label">{t('measurement.form.ac')} ({t('measurement.units.mm')})</label><input type="number" id="ac_mm" name="ac_mm" value={formData.ac_mm || ''} onChange={handleInputChange} step="0.1" required className="form-input" /></div>
            <div className="form-group"><label htmlFor="fl_mm" className="form-label">{t('measurement.form.fl')} ({t('measurement.units.mm')})</label><input type="number" id="fl_mm" name="fl_mm" value={formData.fl_mm || ''} onChange={handleInputChange} step="0.1" required className="form-input" /></div>
          </>
        )}
      </div>

      <div className="btn-group">
        <button type="submit" disabled={isSaving} className="btn btn-primary btn-full">
          {isSaving ? <LoadingSpinner /> : t('measurement.form.save')}
        </button>
      </div>

      {error && <p style={{color: 'red', textAlign: 'center', marginTop: '1rem'}}>{error}</p>}
    </form>
  );
};

export default MeasurementForm;