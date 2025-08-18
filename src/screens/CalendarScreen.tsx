// src/screens/CalendarScreen.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
// Fix: Check if CalendarEvent type exists in your database service
// import { MeasurementService, CalendarEvent } from '../services/database';

// Temporary interface until you implement CalendarEvent in database
interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'appointment' | 'milestone' | 'note';
}

const CalendarScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    // Fix: Add mock data or implement getEventsForDate in your service
    if (selectedDay) {
      // Temporarily use mock data until you implement the service method
      const mockEvents: CalendarEvent[] = [
        // Example events - replace with actual data fetching
        // { id: '1', title: 'Doctor Appointment', date: selectedDay, type: 'appointment' }
      ];
      setEvents(mockEvents);
      
      // When ready, uncomment this:
      // MeasurementService.getEventsForDate(selectedDay).then(setEvents);
    }
  }, [selectedDay]);

  const footer = selectedDay 
    ? <p>You selected {format(selectedDay, 'PPP')}.</p>
    : <p>Please pick a day.</p>;

  return (
    <div className="calendar-screen">
      <div className="calendar-container">
        <DayPicker
          mode="single"
          selected={selectedDay}
          onSelect={setSelectedDay}
          footer={footer}
          showOutsideDays
          fixedWeeks
        />
      </div>
      <div className="event-list">
        <h3>Events for {selectedDay ? format(selectedDay, 'MMM dd') : '...'}</h3>
        {events.length > 0 ? (
          <ul>
            {events.map(event => (
              <li key={event.id}>{event.title}</li>
            ))}
          </ul>
        ) : (
          <p>No events for this day.</p>
        )}
      </div>
      {/* Add Event button will go here later */}
    </div>
  );
};

export default CalendarScreen;