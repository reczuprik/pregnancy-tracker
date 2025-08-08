// src/App.tsx (FINAL, UNIFIED, AND CORRECTED)

import React, { useEffect, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';



import Header from './components/common/Header';
import DashboardScreen from './screens/DashboardScreen'; // New
import FloatingActionButton from './components/common/FloatingActionButton'; // New FAB
import LoadingSpinner from './components/common/LoadingSpinner';
import OfficialStatus from './components/common/OfficialStatus';
import ResultsCard from './components/common/ResultsCard';
import MeasurementForm from './components/measurements/MeasurementForm';
import HistoryView from './components/history/HistoryView';
import GrowthJourneyView from './components/history/GrowthJourneyView';
import { MeasurementService } from './services/database';
import { Measurement, CalculationResult, MeasurementInput } from './types/measurement';

// UNIFIED STATE INTERFACE
interface AppState {
  measurements: Measurement[];
  officialMeasurement?: Measurement;
  lastSavedResult?: CalculationResult;
  currentView: 'dashboard' | 'form' | 'results';
  isLoading: boolean;
  error?: string;
  language: 'en' | 'hu';
  mode: 'crl' | 'hadlock';
}

// STATE ACTIONS
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_DATA'; payload: { measurements: Measurement[]; officialMeasurement?: Measurement } }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'hu' }
  | { type: 'SET_MODE'; payload: 'crl' | 'hadlock' }
  | { type: 'SHOW_FORM' }
  | { type: 'SHOW_RESULTS'; payload: CalculationResult }
  | { type: 'CLOSE_RESULTS' };

// STATE REDUCER - The single source of truth for logic
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_DATA':
      const hasOfficialInData = !!action.payload.officialMeasurement;
      const nextView = state.currentView === 'results'
        ? 'results'
        : hasOfficialInData ? 'dashboard' : 'form';
      return {
        ...state,
        measurements: action.payload.measurements,
        officialMeasurement: action.payload.officialMeasurement,
        isLoading: false,
        currentView: nextView,
      };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SHOW_FORM':
      return { ...state, currentView: 'form' };
    case 'SHOW_RESULTS':
      return { ...state, currentView: 'results', lastSavedResult: action.payload };
    case 'CLOSE_RESULTS':
      const hasOfficial = state.measurements.some(m => m.isOfficial === 1);
      return {
        ...state,
        currentView: hasOfficial ? 'dashboard' : 'form',
        lastSavedResult: undefined,
      };
    default:
      return state;
  }
}

const initialState: AppState = {
  measurements: [],
  currentView: 'form',
  isLoading: true,
  language: 'hu',
  mode: 'crl',
};

function App() {
  const { t, i18n } = useTranslation();
  const [state, dispatch] = useReducer(appReducer, initialState);

  const loadAllData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const measurements = await MeasurementService.getAllMeasurements();
      const officialScan = await MeasurementService.getOfficialMeasurement();
      const savedLanguage = (localStorage.getItem('pregnancy-tracker-language') as 'en' | 'hu') || 'hu';
      const savedMode = (localStorage.getItem('pregnancy-tracker-mode') as 'crl' | 'hadlock') || 'crl';
      
      i18n.changeLanguage(savedLanguage);
      dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
      dispatch({ type: 'SET_MODE', payload: savedMode });
      dispatch({ type: 'SET_DATA', payload: { measurements, officialMeasurement: officialScan } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    }
  }, [i18n]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleSaveComplete = async (result: CalculationResult) => {
    await loadAllData();
    dispatch({ type: 'SHOW_RESULTS', payload: result });
  };

  const handleLanguageChange = (lang: 'en' | 'hu') => {
    localStorage.setItem('pregnancy-tracker-language', lang);
    i18n.changeLanguage(lang);
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  const handleModeChange = (mode: 'crl' | 'hadlock') => {
    localStorage.setItem('pregnancy-tracker-mode', mode);
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  if (state.isLoading) {
    return <div className="app-loading"><LoadingSpinner /><p>{t('common.loading')}</p></div>;
  }

  // This function now cleanly renders the content for the main '/' route
  const renderMainView = () => {
    // Priority 1: If we just saved, show the results card.
    if (state.currentView === 'results' && state.lastSavedResult) {
      return (
        <div style={{ marginTop: '24px' }}>
          <ResultsCard result={state.lastSavedResult} officialMeasurement={state.officialMeasurement} showTechnicalDetails={true} />
          <div className="btn-group">
            <button onClick={() => dispatch({ type: 'CLOSE_RESULTS' })} className="btn btn-primary btn-full">{t('common.close')}</button>
          </div>
        </div>
      );
    }
    

    // Priority 2: If the user explicitly wants to see the form.
    if (state.currentView === 'form') {
      return (
        <MeasurementForm
          mode={state.mode}
          onModeChange={handleModeChange}
          onSaveComplete={handleSaveComplete}
        />
      );
    }

    // Priority 3: If an official measurement exists, the Dashboard is the primary view.
    if (state.currentView === 'dashboard' && state.officialMeasurement) {
      return <DashboardScreen officialMeasurement={state.officialMeasurement} />;
    }

    // Priority 4: If there are measurements but none are official, show the prompt.
    if (state.measurements.length > 0 && !state.officialMeasurement) {
      return (
        <div className="empty-dashboard">
          <div className="empty-dashboard-icon">🗓️</div>
          <h2 className="empty-dashboard-title">{t('dashboard.setOfficialTitle')}</h2>
          <p className="empty-dashboard-text">{t('dashboard.setOfficialText')}</p>
          <div className="btn-group">
            <NavLink to="/history" className="btn btn-primary btn-full">{t('dashboard.goToLog')}</NavLink>
          </div>
        </div>
      );
    }
    
    // Default Fallback: No data at all, show the form.
    return (
      <MeasurementForm
        mode={state.mode}
        onModeChange={handleModeChange}
        onSaveComplete={handleSaveComplete}
      />
    );
  };

  return (
    <Router>
      <div className="app">
        <Header language={state.language} onLanguageChange={handleLanguageChange} />
        {/* Abstract background blobs can be placed here if you wish */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={renderMainView()} />
            <Route
              path="/history"
              element={
                <HistoryView
                  measurements={state.measurements}
                  officialMeasurement={state.officialMeasurement}
                  onMeasurementsChange={loadAllData}
                />
              }
            />
            <Route
              path="/journey"
              element={
                <GrowthJourneyView
                  measurements={state.measurements}
                  officialMeasurement={state.officialMeasurement}
                />
              }
            />
          </Routes>
        </main>

        <FloatingActionButton onClick={() => dispatch({ type: 'SHOW_FORM' })} />

        {state.error && (
          <div className="app-error">
            <p>{state.error}</p>
            <button
              onClick={() =>
                dispatch({ type: 'SET_ERROR', payload: undefined })
              }
            >
              {t('common.close')}
            </button>
          </div>
        )}
     </div>
    </Router>
  );
}

export default App;