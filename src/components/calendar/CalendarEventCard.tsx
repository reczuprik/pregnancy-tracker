// src/components/calendar/CalendarEventCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarEvent } from '../../services/database';
import { format, parseISO, differenceInDays, isToday, isTomorrow, isYesterday } from 'date-fns';
import { enUS, hu } from 'date-fns/locale';

// Icons
const AppointmentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
  </svg>
);

const MedicationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3 3 5.015 3 7.5v4.5c0 2.485 2.099 4.5 4.688 4.5 1.935 0 3.597-1.126 4.312-2.733.715 1.607 2.377 2.733 4.313 2.733C18.9 13.5 21 11.485 21 9V7.5Z" />
  </svg>
);

const MilestoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M15.75 4.5c0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5Z" />
  </svg>
);

const ChevronIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width="18" height="18">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.71c-1.123 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

interface CalendarEventCardProps {
  event: CalendarEvent;
  isExpanded: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
}

const CalendarEventCard: React.FC<CalendarEventCardProps> = ({ event, isExpanded, onClick, onDelete }) => {
  const { t, i18n } = useTranslation();
  const eventDate = parseISO(event.date);
  const today = new Date();
  const daysDiff = differenceInDays(eventDate, today);

  // Get locale for date-fns
  const getLocale = () => {
    switch (i18n.language) {
      case 'hu': return hu;
      default: return enUS;
    }
  };

  // Get appropriate icon for event type
  const getEventIcon = () => {
    switch (event.type) {
      case 'appointment': return <AppointmentIcon />;
      case 'medication': return <MedicationIcon />;
      case 'milestone': return <MilestoneIcon />;
      default: return <AppointmentIcon />;
    }
  };

  // Get event type label
  const getEventTypeLabel = () => {
    return t(`calendar.types.${event.type}`);
  };

  // Get relative date description
  const getRelativeDate = () => {
    if (isToday(eventDate)) return t('calendar.today');
    if (isTomorrow(eventDate)) return t('calendar.tomorrow'); 
    if (isYesterday(eventDate)) return t('calendar.yesterday');
    if (daysDiff > 0) return t('calendar.daysAway', { count: daysDiff });
    if (daysDiff < 0) return t('calendar.daysAgo', { count: Math.abs(daysDiff) });
    return format(eventDate, 'MMM dd', { locale: getLocale() });
  };

  // Get urgency class
  const getUrgencyClass = () => {
    if (daysDiff <= 0) return 'overdue';
    if (daysDiff <= 1) return 'urgent';
    if (daysDiff <= 3) return 'soon';
    return 'future';
  };

  const handleActionClick = (e: React.MouseEvent, handler: (e: React.MouseEvent, id: number) => void) => {
    e.stopPropagation();
    if (event.id) handler(e, event.id);
  };

  return (
    <div className={`calendar-event-card ${isExpanded ? 'expanded' : ''} ${getUrgencyClass()}`} onClick={onClick}>
      <div className="card-header-collapsed">
        <div className="event-icon">
          {getEventIcon()}
        </div>
        
        <div className="collapsed-info">
          <div className="card-title">{event.title}</div>
          <div className="card-meta">
            <span className="event-type">{getEventTypeLabel()}</span>
            <span className="event-date">{getRelativeDate()}</span>
          </div>
        </div>

        <div className="card-actions">
          <div className={`chevron-indicator ${isExpanded ? 'rotated' : ''}`}>
            <ChevronIcon />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="card-content-expanded">
          <div className="event-details">
            <div className="detail-row">
              <span className="detail-label">{t('calendar.date')}</span>
              <span className="detail-value">{format(eventDate, 'EEEE, MMMM dd, yyyy', { locale: getLocale() })}</span>
            </div>
            
            {event.time && (
              <div className="detail-row">
                <span className="detail-label">{t('calendar.time')}</span>
                <span className="detail-value">{event.time}</span>
              </div>
            )}
            
            <div className="detail-row">
              <span className="detail-label">{t('calendar.type')}</span>
              <span className="detail-value">{getEventTypeLabel()}</span>
            </div>
            
            {event.notes && (
              <div className="detail-row">
                <span className="detail-label">{t('calendar.notes')}</span>
                <span className="detail-value notes-text">{event.notes}</span>
              </div>
            )}
          </div>

          <div className="card-expanded-actions">
            <button 
              className="icon-button danger" 
              onClick={(e) => handleActionClick(e, onDelete)}
              title={t('common.delete')}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarEventCard;