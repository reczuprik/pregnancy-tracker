// src/screens/HistoryScreen.tsx (FINAL Rebuilt Version)

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Measurement } from '../types/measurement';
import { MeasurementService } from '../services/database';
import AccordionMeasurementCard from '../components/history/AccordionMeasurementCard';

interface HistoryScreenProps {
  measurements: Measurement[];
  
  officialMeasurement?: Measurement;
  onMeasurementsChange: () => void;
}


const HistoryScreen: React.FC<HistoryScreenProps> = ({ measurements, officialMeasurement,onMeasurementsChange }) => {
  const { t } = useTranslation();
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // NOTE: State for modals and charts is removed, simplifying the component.

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    // This handler is now passed down to each card
    e.stopPropagation();
    if (window.confirm(t('history.confirmDelete'))) {
      await MeasurementService.deleteMeasurement(id);
      onMeasurementsChange();
    }
  };

  const handleSetOfficial = async (e: React.MouseEvent, id: string) => {
    // This handler is also passed down
    e.stopPropagation();
    await MeasurementService.setOfficialMeasurement(id);
    onMeasurementsChange();
  };
  
  // ✨ NEW: Click handler that manages which card is open
  const handleCardClick = (cardId: string) => {
    setExpandedCardId(prevId => (prevId === cardId ? null : cardId)); // Toggle or switch
  };
  if (measurements.length === 0) {
    // The empty state remains the same, but we will add an illustration later in Phase 3
    return (
      <div className="history-view-container">
        <p className="no-data-message">{t('history.noData')}</p>
      </div>
    );
  }

   return (
    <div className="history-view-container">
      <div className="btn-group">
        <Link to="/journey" className="btn btn-secondary btn-full">
          {t('history.actions.chart')}
        </Link>
      </div>

      <div className="timeline-container">
        {measurements.map((m) => (
          <AccordionMeasurementCard
            key={m.id}
            measurement={m}
            // ✨ NEW: Pass the official measurement down for comparison
            officialMeasurement={officialMeasurement || undefined}
            isExpanded={expandedCardId === m.id}
            onClick={() => handleCardClick(m.id)}
            onSetOfficial={handleSetOfficial}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoryScreen;