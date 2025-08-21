import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock i18next to avoid initialization issues in tests
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

// Mock the database service
vi.mock('./services/database', () => ({
  MeasurementService: {
    getAllMeasurements: () => Promise.resolve([]),
    getOfficialMeasurement: () => Promise.resolve(undefined),
  },
}));

describe('App Component', () => {
  it('renders without crashing', async () => {
    render(<App />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('common.loading')).not.toBeInTheDocument();
    });
    
    // Should render the app structure
    expect(document.querySelector('.app')).toBeInTheDocument();
  });
  
  it('shows empty state when no measurements exist', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('dashboard.welcome')).toBeInTheDocument();
    });
  });
});
