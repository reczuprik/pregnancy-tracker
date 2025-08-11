// src/components/measurements/MeasurementForm.tsx - FIXED VERSION

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { MeasurementService } from '../../services/database';
import { MeasurementInput, CalculationResult } from '../../types/measurement';
import { calculateMeasurement } from '../../services/calculations';
import LoadingSpinner from '../common/LoadingSpinner';

interface MeasurementFormProps {
  mode: 'crl' | 'hadlock';
  onModeChange: (mode: 'crl' | 'hadlock') => void;
  onSaveComplete: (result: CalculationResult) => void; 
}

const MeasurementForm: React.FC<MeasurementFormProps> = ({ 
  mode, 
  onModeChange, 
  onSaveComplete 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const initialFormState: MeasurementInput = {
    date: new Date().toISOString().split('T')[0],
    crl_mm: undefined, 
    bpd_mm: undefined, 
    hc_mm: undefined, 
    ac_mm: undefined, 
    fl_mm: undefined,
  };

  const [formData, setFormData] = useState<MeasurementInput>(initialFormState);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FIXED: Reset form when component mounts or mode changes
  useEffect(() => {
    setFormData(initialFormState);
    setError(null);
  }, [mode]);

  // FIXED: Clear any stale state when navigating to form
  useEffect(() => {
    if (location.pathname === '/form') {
      setError(null);
      setIsSaving(false);
    }
  }, [location.pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value ? parseFloat(value) : undefined 
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, date: e.target.value }));
  };

  // FIXED: Better form validation
  const validateForm = (): boolean => {
    if (!formData.date) {
      setError(t('measurement.form.errors.dateRequired'));
      return false;
    }

    if (mode === 'crl') {
      if (!formData.crl_mm || formData.crl_mm <= 0) {
        setError(t('measurement.form.errors.crlRequired'));
        return false;
      }
    } else {
      const requiredFields = ['bpd_mm', 'hc_mm', 'ac_mm', 'fl_mm'];
      const missingFields = requiredFields.filter(field => 
        !formData[field as keyof MeasurementInput] || 
        (formData[field as keyof MeasurementInput] as number) <= 0
      );
      
      if (missingFields.length > 0) {
        setError(t('measurement.form.errors.allFieldsRequired'));
        return false;
      }
    }

    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // 1. Calculate the measurement
      const calculation = calculateMeasurement(formData);
      if (!calculation) {
        throw new Error(t('results.error'));
      }

      // 2. Save to database
      const dbResult = await MeasurementService.addMeasurement(formData);
      if (!dbResult) {
        throw new Error(t('results.error'));
      }
      
      // 3. Reset form state
      setFormData(initialFormState);
      
      // 4. Notify parent component (this will trigger data reload and show results)
      onSaveComplete(calculation);

    } catch (err) {
      setError(err instanceof Error ? err.message : t('results.error'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setError(null);
    navigate('/', { replace: true });
  };

  return (
    <div className="measurement-form-container">
      {/* HEADER WITH CANCEL OPTION */}
      <div className="form-header">
        <button 
          onClick={handleCancel}
          className="btn btn-tertiary"
          disabled={isSaving}
        >
          ← {t('common.cancel')}
        </button>
        <h1 className="form-title">{t('measurement.form.title')}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Mode Selection */}
        <div className="form-section">
          <h2 className="form-section-title">{t('measurement.mode.title')}</h2>
          <div className="mode-selector">
            <button 
              type="button" 
              onClick={() => onModeChange('crl')} 
              className={mode === 'crl' ? 'active' : ''}
              disabled={isSaving}
            >
              {t('measurement.mode.crl')}
            </button>
            <button 
              type="button" 
              onClick={() => onModeChange('hadlock')} 
              className={mode === 'hadlock' ? 'active' : ''}
              disabled={isSaving}
            >
              {t('measurement.mode.hadlock')}
            </button>
          </div>
          <p className="mode-description">
            {t(`measurement.mode.${mode}Description`)}
          </p>
        </div>
        
        {/* Form Fields */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              {t('measurement.form.date')} *
            </label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              value={formData.date} 
              onChange={handleDateChange} 
              required 
              disabled={isSaving}
              className="form-input"
              max={new Date().toISOString().split('T')[0]} // Can't select future dates
            />
          </div>

          {/* Conditional Fields Based on Mode */}
          {mode === 'crl' ? (
            <div className="form-group">
              <label htmlFor="crl_mm" className="form-label">
                {t('measurement.form.crl')} ({t('measurement.units.mm')}) *
              </label>
              <input 
                type="number" 
                id="crl_mm" 
                name="crl_mm" 
                value={formData.crl_mm || ''} 
                onChange={handleInputChange} 
                step="0.1" 
                min="0"
                max="200"
                required 
                disabled={isSaving}
                className="form-input" 
                placeholder={t('measurement.placeholders.crl')}
              />
              <small className="form-help">
                {t('measurement.form.crlHelp')}
              </small>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="bpd_mm" className="form-label">
                  {t('measurement.form.bpd')} ({t('measurement.units.mm')}) *
                </label>
                <input 
                  type="number" 
                  id="bpd_mm" 
                  name="bpd_mm" 
                  value={formData.bpd_mm || ''} 
                  onChange={handleInputChange} 
                  step="0.1" 
                  min="0"
                  max="150"
                  required 
                  disabled={isSaving}
                  className="form-input" 
                  placeholder={t('measurement.placeholders.bpd')}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="hc_mm" className="form-label">
                  {t('measurement.form.hc')} ({t('measurement.units.mm')}) *
                </label>
                <input 
                  type="number" 
                  id="hc_mm" 
                  name="hc_mm" 
                  value={formData.hc_mm || ''} 
                  onChange={handleInputChange} 
                  step="0.1" 
                  min="0"
                  max="500"
                  required 
                  disabled={isSaving}
                  className="form-input" 
                  placeholder={t('measurement.placeholders.hc')}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="ac_mm" className="form-label">
                  {t('measurement.form.ac')} ({t('measurement.units.mm')}) *
                </label>
                <input 
                  type="number" 
                  id="ac_mm" 
                  name="ac_mm" 
                  value={formData.ac_mm || ''} 
                  onChange={handleInputChange} 
                  step="0.1" 
                  min="0"
                  max="500"
                  required 
                  disabled={isSaving}
                  className="form-input" 
                  placeholder={t('measurement.placeholders.ac')}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="fl_mm" className="form-label">
                  {t('measurement.form.fl')} ({t('measurement.units.mm')}) *
                </label>
                <input 
                  type="number" 
                  id="fl_mm" 
                  name="fl_mm" 
                  value={formData.fl_mm || ''} 
                  onChange={handleInputChange} 
                  step="0.1" 
                  min="0"
                  max="100"
                  required 
                  disabled={isSaving}
                  className="form-input" 
                  placeholder={t('measurement.placeholders.fl')}
                />
              </div>
            </>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <div className="btn-group">
            <button 
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="btn btn-secondary"
            >
              {t('common.cancel')}
            </button>
            <button 
              type="submit" 
              disabled={isSaving} 
              className="btn btn-primary"
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="small" />
                  {t('common.saving')}
                </>
              ) : (
                t('measurement.form.save')
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="form-error">
          <p>{error}</p>
          <button onClick={() => setError(null)} className="error-close">
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default MeasurementForm;