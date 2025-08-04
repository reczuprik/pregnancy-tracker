// src/App.tsx (Final Strategy-Aligned Version)

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import './App.css';

import Header from './components/common/Header';
import Navigation from './components/common/Navigation';
import LoadingSpinner from './components/common/LoadingSpinner';
import OfficialStatus from './components/common/OfficialStatus'; // <-- Import new component
import MeasurementForm from './components/measurements/MeasurementForm';
import HistoryView from './components/history/HistoryView';
import { MeasurementService } from './services/database';
import { Measurement, AppState } from './types/measurement';

// A new helper component to manage what's shown on the main page
const MainPage: React.FC<{
    officialMeasurement?: Measurement;
    mode: 'crl' | 'hadlock';
    onModeChange: (mode: 'crl' | 'hadlock') => void;
    onMeasurementSaved: () => void;
}> = ({ officialMeasurement, mode, onModeChange, onMeasurementSaved }) => {
    
    // If an official measurement exists, show the dashboard.
    // If not, show the form for the first measurement.
    return (
        <>
            {officialMeasurement && <OfficialStatus officialMeasurement={officialMeasurement} />}
            <MeasurementForm 
                mode={mode} 
                onModeChange={onModeChange} 
                onMeasurementSaved={onMeasurementSaved} 
            />
        </>
    );
};


function App() {
  const { t, i18n } = useTranslation();
  
  // Add state for the official measurement
  const [officialMeasurement, setOfficialMeasurement] = useState<Measurement | undefined>();

  const [appState, setAppState] = useState<Omit<AppState, 'selectedMeasurement'>>({
    measurements: [],
    isLoading: true,
    error: undefined,
    language: 'hu',
    mode: 'crl',
  });

  // This function now loads ALL data, including the official measurement
  const loadAllData = async () => {
    try {
        const measurements = await MeasurementService.getAllMeasurements();
        const officialScan = await MeasurementService.getOfficialMeasurement();
        const savedLanguage = (localStorage.getItem('pregnancy-tracker-language') as 'en' | 'hu') || 'hu';
        const savedMode = (localStorage.getItem('pregnancy-tracker-mode') as 'crl' | 'hadlock') || 'crl';
        
        i18n.changeLanguage(savedLanguage);
        setAppState(prev => ({ ...prev, measurements, language: savedLanguage, mode: savedMode, isLoading: false }));
        setOfficialMeasurement(officialScan);
    } catch (error) {
        console.error('Error loading data:', error);
        setAppState(prev => ({ ...prev, isLoading: false, error: 'Failed to load data' }));
    }
  }

  useEffect(() => {
    setAppState(prev => ({ ...prev, isLoading: true }));
    loadAllData();
  }, [i18n]);

  const handleLanguageChange = (language: 'en' | 'hu') => {
    i18n.changeLanguage(language);
    localStorage.setItem('pregnancy-tracker-language', language);
    setAppState(prev => ({ ...prev, language }));
  };

  const handleModeChange = (mode: 'crl' | 'hadlock') => {
    localStorage.setItem('pregnancy-tracker-mode', mode);
    setAppState(prev => ({ ...prev, mode }));
  };

  if (appState.isLoading) {
    return <div className="app-loading"><LoadingSpinner /><p>{t('common.loading')}</p></div>;
  }

  return (
    <Router>
      <div className="app">
        <Header language={appState.language} onLanguageChange={handleLanguageChange} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={
                <MainPage 
                    officialMeasurement={officialMeasurement}
                    mode={appState.mode}
                    onModeChange={handleModeChange}
                    onMeasurementSaved={loadAllData} // Refresh ALL data after save
                />
            } />
            <Route path="/history" element={
                <HistoryView 
                    measurements={appState.measurements} 
                    onMeasurementsChange={loadAllData} // Refresh ALL data after change
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