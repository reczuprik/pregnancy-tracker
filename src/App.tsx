// src/App.tsx - FIXED VERSION with Background Blobs

import React, { useEffect, useReducer, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/common/Header';
import DashboardScreen from './screens/DashboardScreen';
import FloatingActionButton from './components/common/FloatingActionButton';
import LoadingSpinner from './components/common/LoadingSpinner';
import ResultsCard from './components/common/ResultsCard';
import MeasurementForm from './components/measurements/MeasurementForm';
import { MeasurementService } from './services/database';
import { Measurement, CalculationResult, MeasurementInput } from './types/measurement';

// Lazy load heavy components
const GrowthJourneyView = lazy(() => import('./components/history/GrowthJourneyView'));
const HistoryScreen = lazy(() => import('./screens/HistoryScreen'));

// SIMPLIFIED STATE INTERFACE (removed currentView - let React Router handle routing)
interface AppState {
  measurements: Measurement[];
  officialMeasurement?: Measurement;
  lastSavedResult?: CalculationResult;
  isLoading: boolean;
  error?: string;
  language: 'en' | 'hu';
  mode: 'crl' | 'hadlock';
  showResultsModal: boolean; // NEW: Separate modal state from routing
  theme: 'light' | 'dark';

}

// UPDATED STATE ACTIONS
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_DATA'; payload: { measurements: Measurement[]; officialMeasurement?: Measurement } }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'hu' }
  | { type: 'SET_MODE'; payload: 'crl' | 'hadlock' }
  | { type: 'SHOW_RESULTS_MODAL'; payload: CalculationResult }
  | { type: 'HIDE_RESULTS_MODAL' }
  | { type: 'CLEAR_LAST_RESULT' };

// FIXED REDUCER - Simplified logic, no view management
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
      
    case 'SET_DATA':
      return {
        ...state,
        measurements: action.payload.measurements,
        officialMeasurement: action.payload.officialMeasurement,
        isLoading: false,
        error: undefined
      };
      
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
      
    case 'SET_MODE':
      return { ...state, mode: action.payload };
      
    case 'SHOW_RESULTS_MODAL':
      return { 
        ...state, 
        lastSavedResult: action.payload,
        showResultsModal: true 
      };
      
    case 'HIDE_RESULTS_MODAL':
      return { 
        ...state, 
        showResultsModal: false 
      };
      
    case 'CLEAR_LAST_RESULT':
      return {
        ...state,
        lastSavedResult: undefined,
        showResultsModal: false
      };
      
    default:
      return state;
  }
}

const initialState: AppState = {
  measurements: [],
  isLoading: true,
  language: 'hu',
  mode: 'crl',
  showResultsModal: false,
  theme: 'light'
};

// MAIN APP COMPONENT
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
const savedTheme = localStorage.getItem('pregnancy-tracker-theme') || 'light';


// SEPARATE CONTENT COMPONENT TO USE ROUTER HOOKS
function AppContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(appReducer, initialState);

  // FIXED: Data loading function
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

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // FIXED: Handle form save completion
  const handleSaveComplete = async (result: CalculationResult) => {
    try {
      // 1. Reload data to get the latest state
      await loadAllData();
      
      // 2. Show results modal
      dispatch({ type: 'SHOW_RESULTS_MODAL', payload: result });
      
      // 3. Navigate to dashboard if we have official measurement, or stay if not
      if (state.measurements.length > 0) {
        navigate('/', { replace: true });
      }
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save measurement' });
    }
  };

  // FIXED: Handle FAB click - always navigate to form
  const handleFABClick = () => {
    dispatch({ type: 'CLEAR_LAST_RESULT' }); // Clear any existing results
    navigate('/form');
  };

  // Handle modal close
  const handleResultsModalClose = () => {
    dispatch({ type: 'HIDE_RESULTS_MODAL' });
  };

  // Language and mode handlers
  const handleLanguageChange = (lang: 'en' | 'hu') => {
    localStorage.setItem('pregnancy-tracker-language', lang);
    i18n.changeLanguage(lang);
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  const handleModeChange = (mode: 'crl' | 'hadlock') => {
    localStorage.setItem('pregnancy-tracker-mode', mode);
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  // Loading state
  if (state.isLoading) {
    return (
      <div className="app-loading">
        <LoadingSpinner />
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <>
      {/* ✨ NEW: Background Blobs - Added here! */}
      <div className="background-blobs">
        <div className="blob blob-warm-1"></div>
        <div className="blob blob-vibrant-1"></div>
        <div className="blob blob-vibrant-2"></div>
        <div className="blob blob-vibrant-3"></div>
      </div>

      <div className="app">
        <Header language={state.language} onLanguageChange={handleLanguageChange} />
        
        <main className="app-main">
          <ErrorBoundary>
            {/* ✨ NEW: SVG Gradient Definitions */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#FFB627" />
                </linearGradient>
              </defs>
            </svg>

            <Routes>
              {/* DASHBOARD ROUTE */}
              <Route path="/" element={
                <DashboardView 
                  measurements={state.measurements}
                  officialMeasurement={state.officialMeasurement}
                  onNavigateToForm={handleFABClick}
                />
              } />
              
              {/* DEDICATED FORM ROUTE */}
              <Route path="/form" element={
                <MeasurementForm
                  mode={state.mode}
                  onModeChange={handleModeChange}
                  onSaveComplete={handleSaveComplete}
                />
              } />
              
              {/* HISTORY ROUTE */}
              <Route path="/history" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <HistoryScreen
                    measurements={state.measurements}
                    officialMeasurement={state.officialMeasurement}
                    onMeasurementsChange={loadAllData}
                  />
                </Suspense>
              } />
              
              {/* JOURNEY/CHART ROUTE */}
              <Route path="/journey" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ErrorBoundary fallback={<div>Chart loading failed</div>}>
                    <GrowthJourneyView 
                      measurements={state.measurements} 
                      officialMeasurement={state.officialMeasurement} 
                    />
                  </ErrorBoundary>
                </Suspense>
              } />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* FIXED: FAB only shows on non-form routes */}
        {location.pathname !== '/form' && (
          <FloatingActionButton onClick={handleFABClick} />
        )}

        {/* RESULTS MODAL - Shows regardless of route */}
        {state.showResultsModal && state.lastSavedResult && (
          <div className="modal-overlay" onClick={handleResultsModalClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <ResultsCard 
                result={state.lastSavedResult} 
                officialMeasurement={state.officialMeasurement}
                showTechnicalDetails={true}
              />
              <div className="btn-group">
                <button 
                  onClick={handleResultsModalClose} 
                  className="btn btn-primary btn-full"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ERROR DISPLAY */}
        {state.error && (
          <div className="app-error">
            <p>{state.error}</p>
            <button onClick={() => dispatch({ type: 'SET_ERROR', payload: undefined })}>
              {t('common.close')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// DASHBOARD VIEW COMPONENT - Decides what to show on dashboard
interface DashboardViewProps {
  measurements: Measurement[];
  officialMeasurement?: Measurement;
  onNavigateToForm: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ 
  measurements, 
  officialMeasurement, 
  onNavigateToForm 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // If we have an official measurement, show the dashboard
  if (officialMeasurement) {
    return <DashboardScreen officialMeasurement={officialMeasurement} />;
  }

  // If we have measurements but no official one, prompt to set one
  if (measurements.length > 0) {
    return (
      <div className="empty-dashboard">
        <div className="empty-dashboard-icon">🗓️</div>
        <h2 className="empty-dashboard-title">{t('dashboard.setOfficialTitle')}</h2>
        <p className="empty-dashboard-text">{t('dashboard.setOfficialText')}</p>
        <div className="btn-group">
          <button 
            onClick={() => navigate('/history')} 
            className="btn btn-primary btn-full"
          >
            {t('dashboard.goToLog')}
          </button>
        </div>
      </div>
    );
  }

  // No measurements at all, show welcome state
  return (
    <div className="empty-dashboard">
      <div className="empty-dashboard-icon">🤱</div>
      <h2 className="empty-dashboard-title">{t('dashboard.welcomeTitle')}</h2>
      <p className="empty-dashboard-text">{t('dashboard.welcomeText')}</p>
      <div className="btn-group">
        <button 
          onClick={onNavigateToForm} 
          className="btn btn-primary btn-full"
        >
          {t('measurement.form.startFirstMeasurement')}
        </button>
      </div>
    </div>
  );
};

export default App;