// src/App.tsx (Final Corrected Version)

import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import './App.css';

import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import LoadingSpinner from './components/common/LoadingSpinner';
import OfficialStatus from './components/common/OfficialStatus';
import ResultsCard from './components/common/ResultsCard';
import MeasurementForm from './components/measurements/MeasurementForm';
import HistoryView from './components/history/HistoryView';
import { MeasurementService } from './services/database';
import { Measurement, AppState, CalculationResult } from './types/measurement';

function App() {
  const { t, i18n } = useTranslation();
  
  // All state is now managed at the top level of the App component for consistency
  const [officialMeasurement, setOfficialMeasurement] = useState<Measurement | undefined>();
  const [lastSavedResult, setLastSavedResult] = useState<CalculationResult | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // This will control the form's visibility
  const [appState, setAppState] = useState<Omit<AppState, 'selectedMeasurement'>>({
    measurements: [],
    isLoading: true,
    error: undefined,
    language: 'hu',
    mode: 'crl',
  });

  // This function is the single source of truth for loading all app data
  const loadAllData = useCallback(async () => {
    try {
      const measurements = await MeasurementService.getAllMeasurements();
      const officialScan = await MeasurementService.getOfficialMeasurement();
      const savedLanguage = (localStorage.getItem('pregnancy-tracker-language') as 'en' | 'hu') || 'hu';
      const savedMode = (localStorage.getItem('pregnancy-tracker-mode') as 'crl' | 'hadlock') || 'crl';
      
      i18n.changeLanguage(savedLanguage);
      setAppState(prev => ({ ...prev, measurements, language: savedLanguage, mode: savedMode, isLoading: false }));
      setOfficialMeasurement(officialScan);

      // THE CORE FIX: The form should only be visible by default if there is NO official scan.
      setIsFormVisible(!officialScan);

    } catch (error) {
      console.error('Error loading data:', error);
      setAppState(prev => ({ ...prev, isLoading: false, error: 'Failed to load data' }));
    }
  }, [i18n]);

  useEffect(() => {
    setAppState(prev => ({ ...prev, isLoading: true }));
    loadAllData();
  }, [loadAllData]);

  const handleModeChange = (mode: 'crl' | 'hadlock') => {
    localStorage.setItem('pregnancy-tracker-mode', mode);
    setAppState(prev => ({ ...prev, mode }));
  };
  
  // This function now correctly handles the UI flow after a measurement is saved
  const handleMeasurementSaved = () => {
      loadAllData(); // Reload all data to get the latest official status and history
      // If there was already an official measurement, we can hide the form to return to the dashboard view.
      if (officialMeasurement) { 
          setIsFormVisible(false);
      }
  }

  if (appState.isLoading) {
    return <div className="app-loading"><LoadingSpinner /><p>{t('common.loading')}</p></div>;
  }

  return (
    <Router>
      <div className="app">
        <Header language={appState.language} onLanguageChange={(lang) => i18n.changeLanguage(lang)} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={
              <>
                {/* The Dashboard is now the primary UI element if it exists */}
                {officialMeasurement && <OfficialStatus officialMeasurement={officialMeasurement} />}

                {/* The Results Card appears temporarily after a save */}
                {lastSavedResult ? (
                  <div style={{marginTop: '24px'}}>
                    <ResultsCard result={lastSavedResult} />
                    <div className="btn-group">
                      <button onClick={() => setLastSavedResult(null)} className="btn btn-primary btn-full">
                        {t('common.close')}
                      </button>
                    </div>
                  </div>
                ) : isFormVisible ? (
                  // If the form should be visible (either by default or by user click), show it
                  <MeasurementForm 
                      mode={appState.mode} 
                      onModeChange={handleModeChange} 
                      onMeasurementSaved={handleMeasurementSaved}
                      setLastSavedResult={setLastSavedResult}
                  />
                ) : (
                  // If there's an official date and the form is hidden, show a button to open it
                  <div className="btn-group" style={{marginTop: '24px'}}>
                    <button onClick={() => setIsFormVisible(true)} className="btn btn-secondary btn-full">
                      {t('navigation.measurement')}
                    </button>
                  </div>
                )}
              </>
            } />
            <Route path="/history" element={
                <HistoryView 
                    measurements={appState.measurements} 
                    onMeasurementsChange={loadAllData}
                />
            } />
          </Routes>
        </main>
        <Navigation />
        {appState.error && (
            <div className="app-error">
                <p>{appState.error}</p>
                <button onClick={() => setAppState(prev => ({ ...prev, error: undefined }))}>
                    {t('common.close')}
                </button>
            </div>
        )}
      </div>
    </Router>
  );
}

export default App;