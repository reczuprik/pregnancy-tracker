// src/App.tsx - FIXED VERSION with Theme Management

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

// State interface with theme
interface AppState {
  measurements: Measurement[];
  officialMeasurement?: Measurement;
  lastSavedResult?: CalculationResult;
  isLoading: boolean;
  error?: string;
  language: 'en' | 'hu';
  mode: 'crl' | 'hadlock';
  showResultsModal: boolean;
  theme: 'light' | 'dark';
}

// Updated state actions with SET_THEME
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined }
  | { type: 'SET_DATA'; payload: { measurements: Measurement[]; officialMeasurement?: Measurement } }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'hu' }
  | { type: 'SET_MODE'; payload: 'crl' | 'hadlock' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SHOW_RESULTS_MODAL'; payload: CalculationResult }
  | { type: 'HIDE_RESULTS_MODAL' }
  | { type: 'CLEAR_LAST_RESULT' };

// Reducer with theme handling
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
      
    case 'SET_THEME':
      // Persist theme preference
      localStorage.setItem('pregnancy-tracker-theme', action.payload);
      return { ...state, theme: action.payload };
      
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

// Initialize theme from localStorage or default to light
const getInitialTheme = (): 'light' | 'dark' => {
  const savedTheme = localStorage.getItem('pregnancy-tracker-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }
  // Optional: Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const initialState: AppState = {
  measurements: [],
  isLoading: true,
  language: 'hu',
  mode: 'crl',
  showResultsModal: false,
  theme: getInitialTheme()
};

// Main App component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

// Separate content component to use router hooks
function AppContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Data loading function
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

  // Handle form save completion
  const handleSaveComplete = async (result: CalculationResult) => {
    try {
      await loadAllData();
      dispatch({ type: 'SHOW_RESULTS_MODAL', payload: result });
      
      if (state.measurements.length > 0) {
        navigate('/', { replace: true });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save measurement' });
    }
  };

  // Handle FAB click
  const handleFABClick = () => {
    dispatch({ type: 'CLEAR_LAST_RESULT' });
    navigate('/form');
  };

  // Handle modal close
  const handleResultsModalClose = () => {
    dispatch({ type: 'HIDE_RESULTS_MODAL' });
  };

  // Language handler
  const handleLanguageChange = (lang: 'en' | 'hu') => {
    localStorage.setItem('pregnancy-tracker-language', lang);
    i18n.changeLanguage(lang);
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
  };

  // Mode handler
  const handleModeChange = (mode: 'crl' | 'hadlock') => {
    localStorage.setItem('pregnancy-tracker-mode', mode);
    dispatch({ type: 'SET_MODE', payload: mode });
  };

  // Theme toggle handler
  const handleThemeToggle = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', payload: newTheme });
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
      {/* Background Blobs */}
      <div className="background-blobs">
        <div className="blob blob-warm-1"></div>
        <div className="blob blob-vibrant-1"></div>
        <div className="blob blob-vibrant-2"></div>
        <div className="blob blob-vibrant-3"></div>
      </div>

      <div className="app">
        <Header 
          language={state.language} 
          onLanguageChange={handleLanguageChange}
          theme={state.theme}
          onThemeToggle={handleThemeToggle}
        />
        
        <main className="app-main">
          <ErrorBoundary>
            {/* SVG Gradient Definitions */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="100%" stopColor="#FFB627" />
                </linearGradient>
              </defs>
            </svg>

            <Routes>
              {/* Dashboard Route */}
              <Route path="/" element={
                <DashboardView 
                  measurements={state.measurements}
                  officialMeasurement={state.officialMeasurement}
                  onNavigateToForm={handleFABClick}
                />
              } />
              
              {/* Form Route */}
              <Route path="/form" element={
                <div className="form-container">
                  <MeasurementForm 
                    mode={state.mode}
                    onModeChange={handleModeChange}
                    onSaveComplete={handleSaveComplete}
                  />
                </div>
              } />
              
              {/* History Route */}
              <Route path="/history" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <HistoryScreen 
                    measurements={state.measurements}
                    officialMeasurement={state.officialMeasurement}
                    onMeasurementsChange={loadAllData}
                  />
                </Suspense>
              } />
              
              {/* Growth Journey Route */}
              <Route path="/journey" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <GrowthJourneyView 
                    measurements={state.measurements}
                    officialMeasurement={state.officialMeasurement}
                  />
                </Suspense>
              } />
            </Routes>
          </ErrorBoundary>
        </main>

        {/* FAB - Show on dashboard and history */}
        {(location.pathname === '/' || location.pathname === '/history') && (
          <FloatingActionButton onClick={handleFABClick} />
        )}

        {/* Results Modal */}
        {state.showResultsModal && state.lastSavedResult && (
          <div className="modal-overlay" onClick={handleResultsModalClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <ResultsCard 
                result={state.lastSavedResult}
                showTechnicalDetails={true}
                officialMeasurement={state.officialMeasurement}
              />
              <button 
                onClick={handleResultsModalClose} 
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {t('common.close')}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Dashboard View Component
const DashboardView: React.FC<{
  measurements: Measurement[];
  officialMeasurement?: Measurement;
  onNavigateToForm: () => void;
}> = ({ measurements, officialMeasurement, onNavigateToForm }) => {
  const { t } = useTranslation();
  
  // If no measurements or no official measurement, show empty state
  if (measurements.length === 0 || !officialMeasurement) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">👶</div>
        <h2 className="empty-state-title">{t('dashboard.welcome')}</h2>
        <p className="empty-state-message">{t('dashboard.getStarted')}</p>
        <button onClick={onNavigateToForm} className="btn btn-primary">
          {t('dashboard.addFirstMeasurement')}
        </button>
      </div>
    );
  }

  return (
    <DashboardScreen 
      officialMeasurement={officialMeasurement}
    />
  );
};

export default App;