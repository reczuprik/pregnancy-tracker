import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Header from './Header';

// Wrapper for components that need Router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Header Component', () => {
  const defaultProps = {
    language: 'en' as const,
    onLanguageChange: vi.fn(),
    theme: 'light' as const,
    onThemeToggle: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links', () => {
    render(
      <RouterWrapper>
        <Header {...defaultProps} />
      </RouterWrapper>
    );

    expect(screen.getByLabelText('Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('History Log')).toBeInTheDocument();
    expect(screen.getByLabelText('Calendar')).toBeInTheDocument();
  });

  it('renders language switcher with current language highlighted', () => {
    render(
      <RouterWrapper>
        <Header {...defaultProps} language="hu" />
      </RouterWrapper>
    );

    const huButton = screen.getByText('HU');
    const enButton = screen.getByText('EN');
    
    expect(huButton).toHaveClass('active');
    expect(enButton).not.toHaveClass('active');
  });

  it('calls onLanguageChange when language button is clicked', () => {
    const mockLanguageChange = vi.fn();
    
    render(
      <RouterWrapper>
        <Header {...defaultProps} onLanguageChange={mockLanguageChange} />
      </RouterWrapper>
    );

    fireEvent.click(screen.getByText('HU'));
    expect(mockLanguageChange).toHaveBeenCalledWith('hu');
  });

  it('renders theme toggle button', () => {
    render(
      <RouterWrapper>
        <Header {...defaultProps} />
      </RouterWrapper>
    );

    const themeButton = screen.getByLabelText('Switch to dark mode');
    expect(themeButton).toBeInTheDocument();
  });

  it('calls onThemeToggle when theme button is clicked', () => {
    const mockThemeToggle = vi.fn();
    
    render(
      <RouterWrapper>
        <Header {...defaultProps} onThemeToggle={mockThemeToggle} />
      </RouterWrapper>
    );

    const themeButton = screen.getByLabelText('Switch to dark mode');
    fireEvent.click(themeButton);
    
    expect(mockThemeToggle).toHaveBeenCalled();
  });
});