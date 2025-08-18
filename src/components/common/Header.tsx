// src/components/common/Header.tsx - Updated with Logo

import React from 'react';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  language: 'en' | 'hu';
  onLanguageChange: (language: 'en' | 'hu') => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

// Navigation Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

// Theme Toggle Icons
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  </svg>
);

// Emberly Logo Component - using actual image
const EmberlyLogo = () => (
  <img 
    src="/src/assets/emberly-logo.png" 
    alt="Emberly" 
    width="40" 
    height="40"
    style={{ userSelect: 'none', pointerEvents: 'none' }}
    draggable={false}
  />
);

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, theme, onThemeToggle }) => {
  return (
    <header className="header">
      <div className="header-content">
        {/* Navigation */}
        <div className="header-nav">
          <NavLink to="/" end className={({isActive}) => `header-nav-button ${isActive ? 'active' : ''}`} aria-label="Dashboard">
            <HomeIcon />
          </NavLink>
          <NavLink to="/history" className={({isActive}) => `header-nav-button ${isActive ? 'active' : ''}`} aria-label="History Log">
            <HistoryIcon />
          </NavLink>
          <NavLink to="/calendar" className={({isActive}) => `header-nav-button ${isActive ? 'active' : ''}`} aria-label="Calendar">
            <CalendarIcon />
          </NavLink>
        </div>
        
        {/* Logo - Center */}
        <div className="header-logo">
          <EmberlyLogo />
        </div>
        
        {/* Controls: Theme Toggle + Language */}
        <div className="header-controls">
          {/* Theme Toggle Button */}
          <button 
            className="theme-toggle-button"
            onClick={onThemeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          
          {/* Language Switcher */}
          <div className="header-language">
            <button 
              className={language === 'hu' ? 'active' : ''} 
              onClick={() => onLanguageChange('hu')}
              aria-label="Switch to Hungarian"
            >
              HU
            </button>
            <button 
              className={language === 'en' ? 'active' : ''} 
              onClick={() => onLanguageChange('en')}
              aria-label="Switch to English"
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;