import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: t('navigation.measurement'),
      icon: '📊'
    },
    {
      path: '/history',
      label: t('navigation.history'),
      icon: '📋'
    }
  ];

  return (
    <nav className="navigation">
      <div className="navigation-content">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-button ${location.pathname === item.path ? 'active' : ''}`}
          >
            <div className="nav-icon">
              {item.icon}
            </div>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation