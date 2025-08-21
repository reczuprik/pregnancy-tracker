import { describe, it, expect } from 'vitest';
import { calculateMeasurement } from './calculations';
import type { MeasurementInput } from '../types/measurement';

describe('calculateMeasurement', () => {
  describe('CRL-based calculations', () => {
    it('calculates gestational age correctly for valid CRL', () => {
      const input: MeasurementInput = {
        date: '2024-01-15',
        crl_mm: 45.2
      };

      const result = calculateMeasurement(input);

      expect(result).toBeDefined();
      expect(result?.gestationalWeek).toBeGreaterThan(0);
      expect(result?.gestationalDay).toBeGreaterThanOrEqual(0);
      expect(result?.gestationalDay).toBeLessThan(7);
      expect(result?.estimatedDueDate).toBeTruthy();
    });

    it('returns null for invalid CRL values', () => {
      const input: MeasurementInput = {
        date: '2024-01-15',
        crl_mm: -5
      };

      const result = calculateMeasurement(input);
      expect(result).toBeNull();
    });

    it('handles extremely large CRL values by returning calculated result', () => {
      const input: MeasurementInput = {
        date: '2024-01-15',
        crl_mm: 200
      };

      const result = calculateMeasurement(input);
      expect(result).toBeDefined();
      // Large CRL should result in high gestational age
      expect(result?.gestationalWeek).toBeGreaterThan(15);
    });
  });

  describe('Hadlock-based calculations', () => {
    it('calculates gestational age with multiple measurements', () => {
      const input: MeasurementInput = {
        date: '2024-01-15',
        bpd_mm: 45.1,
        hc_mm: 175.0,
        ac_mm: 150.5,
        fl_mm: 35.2
      };

      const result = calculateMeasurement(input);

      expect(result).toBeDefined();
      expect(result?.gestationalWeek).toBeGreaterThan(10);
      expect(result?.gestationalDay).toBeGreaterThanOrEqual(0);
      expect(result?.gestationalDay).toBeLessThan(7);
    });

    it('works with partial Hadlock measurements', () => {
      const input: MeasurementInput = {
        date: '2024-01-15',
        bpd_mm: 45.1,
        fl_mm: 35.2
      };

      const result = calculateMeasurement(input);
      expect(result).toBeDefined();
    });

    it('returns null when no valid measurements provided', () => {
      const input: MeasurementInput = {
        date: '2024-01-15'
      };

      const result = calculateMeasurement(input);
      expect(result).toBeNull();
    });
  });

  describe('Date calculations', () => {
    it('calculates due date correctly', () => {
      const input: MeasurementInput = {
        date: '2024-01-15',
        crl_mm: 20
      };

      const result = calculateMeasurement(input);
      
      expect(result).toBeDefined();
      expect(result?.estimatedDueDate).toBeTruthy();
      
      // Due date should be in the future from measurement date
      const measurementDate = new Date('2024-01-15');
      const dueDate = new Date(result!.estimatedDueDate);
      expect(dueDate.getTime()).toBeGreaterThan(measurementDate.getTime());
    });

    it('provides consistent size comparison', () => {
      const input: MeasurementInput = {
        date: '2024-01-15',
        crl_mm: 30
      };

      const result = calculateMeasurement(input);
      
      expect(result).toBeDefined();
      expect(result?.sizeComparison).toBeTruthy();
      expect(typeof result?.sizeComparison).toBe('string');
    });
  });

  describe('Edge cases', () => {
    it('handles invalid date format by throwing error', () => {
      const input: MeasurementInput = {
        date: 'invalid-date',
        crl_mm: 30
      };

      // The function will throw when trying to calculate EDD with invalid date
      expect(() => calculateMeasurement(input)).toThrow();
    });

    it('handles decimal precision correctly', () => {
      const input: MeasurementInput = {
        date: '2024-01-15',
        crl_mm: 45.999999
      };

      const result = calculateMeasurement(input);
      expect(result).toBeDefined();
      expect(Number.isInteger(result?.gestationalWeek)).toBe(true);
      expect(Number.isInteger(result?.gestationalDay)).toBe(true);
    });
  });
});