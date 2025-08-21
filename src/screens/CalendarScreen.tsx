// src/screens/CalendarScreen.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MeasurementService, CalendarEvent } from '../services/database';
import AddEventModal from '../components/calendar/AddEventModal';
import CalendarEventCard from '../components/calendar/CalendarEventCard';

const CalendarScreen: React.FC = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState<number | null>(null);

  const fetchUpcomingEvents = async () => {
    setIsLoading(true);
    try {
      const upcomingEvents = await MeasurementService.getUpcomingEvents(30);
      // Sort events by date
      const sortedEvents = upcomingEvents.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const handleSaveEvent = async (event: CalendarEvent) => {
    await MeasurementService.addCalendarEvent(event);
    setIsModalOpen(false);
    fetchUpcomingEvents(); // Refresh the events list
  };

  const handleDeleteEvent = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const success = await MeasurementService.deleteCalendarEvent(id);
    if (success) {
      fetchUpcomingEvents(); // Refresh the events list
      if (expandedEventId === id) {
        setExpandedEventId(null); // Collapse if this event was expanded
      }
    }
  };

  const handleEventClick = (eventId: number) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  return (
    <div className="calendar-screen">
      <div className="screen-header">
        <h2>{t('calendar.upcomingEvents')}</h2>
      </div>

      <div className="events-smart-stack">
        {isLoading ? (
          <div className="loading-state">
            <p>{t('common.loading')}</p>
          </div>
        ) : events.length > 0 ? (
          <div className="event-cards-container">
            {events.map(event => (
              <CalendarEventCard
                key={event.id}
                event={event}
                isExpanded={expandedEventId === event.id}
                onClick={() => event.id && handleEventClick(event.id)}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>{t('calendar.noUpcomingEvents')}</p>
            <p className="empty-state-subtitle">{t('calendar.addFirstEvent')}</p>
          </div>
        )}
      </div>

      <div className="btn-group">
        <button className="btn btn-primary btn-full" onClick={() => setIsModalOpen(true)}>
          {t('calendar.addEventButton')}
        </button>
      </div>
      
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        selectedDate={new Date()}
      />
    </div>
  );
};

export default CalendarScreen;