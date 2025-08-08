// src/components/common/Header.tsx (Redesigned)

import React from 'react';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  language: 'en' | 'hu';
  onLanguageChange: (language: 'en' | 'hu') => void;
}

// Icons for header navigation
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="24" height="24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-nav">
          <NavLink to="/" end className={({isActive}) => `header-nav-button ${isActive ? 'active' : ''}`}>
            <HomeIcon />
          </NavLink>
          <NavLink to="/history" className={({isActive}) => `header-nav-button ${isActive ? 'active' : ''}`}>
            <HistoryIcon />
          </NavLink>
        </div>
        
        <div className="header-language">
          <button className={`btn-secondary ${language === 'hu' ? 'active' : ''}`} onClick={() => onLanguageChange('hu')}>HU</button>
          <button className={`btn-secondary ${language === 'en' ? 'active' : ''}`} onClick={() => onLanguageChange('en')}>EN</button>
        </div>
      </div>
    </header>
  );
};

export default Header;