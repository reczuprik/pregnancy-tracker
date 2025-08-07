// src/App.tsx - FINAL, CLEANED, AND CORRECTED

import React, { useEffect, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route,NavLink  } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
//styles
import './styles/base.css';
import './styles/layout.css'
import './styles/components.css';
import './styles/views.css'

import Header from './components/common/Header';
import LoadingSpinner from './components/common/LoadingSpinner';
import OfficialStatus from './components/common/OfficialStatus';
import ResultsCard from './components/common/ResultsCard';
import MeasurementForm from './components/measurements/MeasurementForm';
import HistoryView from './components/history/HistoryView';
import { MeasurementService } from './services/database';
import { Measurement, CalculationResult } from './types/measurement';

// UNIFIED STATE INTERFACE - No changes needed
interface AppState {
  measurements: Measurement[];
  officialMeasurement?: Measurement;
  currentView: 'dashboard' | 'form' | 'results';
  lastSavedResult?: CalculationResult;
  isLoading: boolean;
  error?: string;
  language: 'en' | 'hu';
  mode: 'crl' | 'hadlock';
}

// STATE ACTIONS - No changes needed
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_DATA'; payload: { measurements: Measurement[]; officialMeasurement?: Measurement } }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'hu' }
  | { type: 'SET_MODE'; payload: 'crl' | 'hadlock' }
  | { type: 'SHOW_FORM' }
  | { type: 'SHOW_RESULTS'; payload: CalculationResult }
  | { type: 'CLOSE_RESULTS' };

// STATE REDUCER - The logic here is now correct and robust
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_DATA':
      const nextView = state.currentView === 'results'
        ? 'results'
        : action.payload.officialMeasurement ? 'dashboard' : 'form';
      return {
        ...state,
        measurements: action.payload.measurements,
        officialMeasurement: action.payload.officialMeasurement,
        isLoading: false,
        currentView: nextView
      };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SHOW_FORM':
      return { ...state, currentView: 'form', lastSavedResult: undefined };
    case 'SHOW_RESULTS':
      return { ...state, currentView: 'results', lastSavedResult: action.payload };
    case 'CLOSE_RESULTS':
      const hasOfficial = state.measurements.some(m => m.isOfficial);
      return {
        ...state,
        currentView: hasOfficial ? 'dashboard' : 'form',
        lastSavedResult: undefined
      };
    default:
      return state;
  }
}

// INITIAL STATE - No changes needed
const initialState: AppState = {
  measurements: [],
  currentView: 'dashboard',
  isLoading: true,
  language: 'hu',
  mode: 'crl'
};


// ✨ NEW: The top-level Segmented Control for navigation
const SegmentedControl: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="segmented-control">
            {/* ✨ FIXED: Using the new, consistent .btn-secondary class */}
            <NavLink to="/" end className={({isActive}) => `btn-tertiary  ${isActive ? 'active' : ''}`}>
                {t('navigation.dashboard')}
            </NavLink>
            <NavLink to="/history" className={({isActive}) => `btn-tertiary  ${isActive ? 'active' : ''}`}>
                {t('navigation.history')}
            </NavLink>
        </div>
    );
}
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

  // FIX: REMOVED the old, buggy `handleMeasurementSaved` function.
  // This is the ONLY save handler now.
  const handleSaveComplete = async (result: CalculationResult) => {
    // 1. Await the data reload to ensure the state is fresh.
    await loadAllData();
    // 2. NOW, dispatch the action to show the results.
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
    return (
      <div className="app-loading">
        <LoadingSpinner />
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  // This is the content for the main route ('/')
  const MainView = () => {
    switch (state.currentView) {
      case 'results':
        return (
          <div style={{ marginTop: '24px' }}>
            <ResultsCard result={state.lastSavedResult!} />
            <div className="btn-group">
              <button onClick={() => dispatch({ type: 'CLOSE_RESULTS' })} className="btn btn-primary btn-full">
                {t('common.close')}
              </button>
            </div>
          </div>
        );
      case 'form':
        return (
          <MeasurementForm
            mode={state.mode}
            onModeChange={handleModeChange}
            onSaveComplete={handleSaveComplete}
          />
        );
      case 'dashboard':
      default:
        return (
          <>
            {state.officialMeasurement && <OfficialStatus officialMeasurement={state.officialMeasurement} />}
            <div className="btn-group" style={{ marginTop: '24px' }}>
              <button onClick={() => dispatch({ type: 'SHOW_FORM' })} className="btn btn-primary btn-full">
                {t('navigation.measurement')}
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <Router>
      <div className="app">
        <Header language={state.language} onLanguageChange={handleLanguageChange} />
        <main className="app-main">
          {/* ✨ NEW: The Segmented Control is now the primary navigation */}
          <SegmentedControl />
          <Routes>
            <Route path="/" element={<MainView />} />
            <Route
              path="/history"
              element={
                <HistoryView
                  measurements={state.measurements}
                  onMeasurementsChange={loadAllData}
                />
              }
            />
          </Routes>
        </main>
        {state.error && (
          <div className="app-error">
            <p>{state.error}</p>
            <button onClick={() => dispatch({ type: 'SET_ERROR', payload: undefined })}>
              {t('common.close')}
            </button>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;