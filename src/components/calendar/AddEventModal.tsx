// src/components/calendar/AddEventModal.tsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { CalendarEvent } from '../../services/database';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => Promise<void>;
  selectedDate: Date;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onSave, selectedDate }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'appointment' | 'medication' | 'milestone'>('appointment');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setType('appointment');
      setNotes('');
      setTime('');
      setDate(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [isOpen, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return; // Simple validation

    const newEvent: CalendarEvent = {
      title: title.trim(),
      type,
      notes: notes.trim() || undefined,
      date,
      time: time || undefined,
    };
    
    try {
      await onSave(newEvent);
      // Form is reset by useEffect when modal reopens
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h3 className="modal-title">{t('calendar.addEventTitle')}</h3>
          
          <div className="form-group">
            <label htmlFor="event-title" className="form-label">{t('calendar.eventTitleLabel')}</label>
            <input
              type="text"
              id="event-title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="event-date" className="form-label">{t('calendar.date')}</label>
            <input
              type="date"
              id="event-date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="event-time" className="form-label">{t('calendar.time')} ({t('common.optional')})</label>
            <input
              type="time"
              id="event-time"
              className="form-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="event-type" className="form-label">{t('calendar.eventTypeLabel')}</label>
            <select
              id="event-type"
              className="form-input"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
            >
              <option value="appointment">{t('calendar.types.appointment')}</option>
              <option value="medication">{t('calendar.types.medication')}</option>
              <option value="milestone">{t('calendar.types.milestone')}</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="event-notes" className="form-label">{t('calendar.notesLabel')}</label>
            <textarea
              id="event-notes"
              className="form-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('calendar.notesPlaceholder')}
            ></textarea>
          </div>
          
          <div className="btn-group">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;