import React from 'react';

import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom'; 


const Navigation: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: t('navigation.measurement'), icon: '📊' },
    { path: '/history', label: t('navigation.history'), icon: '📋' }
  ];

  return (
    <nav className="navigation">
      <div className="navigation-content">
        {navItems.map((item) => (
          // The `nav-link` class is now used from your App.css
          // NavLink automatically adds an 'active' class when the path matches.
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <div className="nav-icon">{item.icon}</div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
export default Navigation;
