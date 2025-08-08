import React from 'react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  language: 'en' | 'hu';
  onLanguageChange: (language: 'en' | 'hu') => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          {t('measurement.title')}
        </h1>
        
        <div className="header-language">
          <button
            className={`btn btn-secondary ${language === 'hu' ? 'active' : ''}`}
            onClick={() => onLanguageChange('hu')}
            aria-label="Magyar nyelv"
          >
            HU
          </button>
          <button
            className={`btn btn-secondary ${language === 'en' ? 'active' : ''}`}
            onClick={() => onLanguageChange('en')}
            aria-label="English language"
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;