// src/screens/CalendarScreen.tsx

import React, { useState, useEffect } from 'react';
// src/screens/CalendarScreen.tsx (FINAL Interactive Version)


import { useTranslation } from 'react-i18next';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { MeasurementService, CalendarEvent } from '../services/database';
import AddEventModal from '../components/calendar/AddEventModal'; // <-- Import the new component

const CalendarScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // <-- NEW state for modal

  const fetchEvents = (day: Date) => {
    setIsLoading(true);
    MeasurementService.getEventsForDate(day)
      .then(setEvents)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (selectedDay) {
      fetchEvents(selectedDay);
    }
  }, [selectedDay]);

  // ✨ NEW: Handler for saving the event from the modal
  const handleSaveEvent = async (event: CalendarEvent) => {
    await MeasurementService.addCalendarEvent(event);
    setIsModalOpen(false); // Close the modal
    if (selectedDay) {
      fetchEvents(selectedDay); // Refresh the event list for the selected day
    }
  };

  return (
    <div className="calendar-screen">
      <div className="calendar-container">
        <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={setSelectedDay}
          showOutsideDays
          fixedWeeks
          className="glassmorphism"
        />
      </div>

      <div className="event-list">
        <h3>{t('calendar.eventsFor')} {selectedDay ? format(selectedDay, 'MMM dd') : '...'}</h3>
        {isLoading ? (
          <p>{t('common.loading')}</p>
        ) : events.length > 0 ? (
          <ul>
            {events.map(event => <li key={event.id}>{event.title}</li>)}
          </ul>
        ) : (
          <p>{t('calendar.noEvents')}</p>
        )}
      </div>

      {/* ✨ NEW: The "Add Event" button */}
      <div className="btn-group">
        <button className="btn btn-primary btn-full" onClick={() => setIsModalOpen(true)}>
          {t('calendar.addEventButton')}
        </button>
      </div>
      
      {/* ✨ NEW: The Modal component */}
      {selectedDay && (
        <AddEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          selectedDate={selectedDay}
        />
      )}
    </div>
  );
};

export default CalendarScreen;