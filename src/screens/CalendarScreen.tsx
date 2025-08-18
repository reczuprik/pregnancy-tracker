// src/screens/CalendarScreen.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Import the default styles
import { format } from 'date-fns';
import { MeasurementService, CalendarEvent } from '../services/database';

const CalendarScreen: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    if (selectedDay) {
      MeasurementService.getEventsForDate(selectedDay).then(setEvents);
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
            {events.map(event => <li key={event.id}>{event.title}</li>)}
          </ul>
        ) : (
          <p>No events for this day.</p>
        )}
      </div>
      {/* We will add the "Add Event" button here later */}
    </div>
  );
};

export default CalendarScreen;