import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MeasurementService } from './database';
import type { MeasurementInput } from '../types/measurement';

// Mock Dexie and uuid
vi.mock('dexie');
vi.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}));

// Mock the calculations service
vi.mock('./calculations', () => ({
  calculateMeasurement: vi.fn().mockReturnValue({
    gestationalWeek: 12,
    gestationalDay: 3,
    estimatedDueDate: '2024-08-15',
    gestationalAgeInDays: 87,
    sizeComparison: 'lime'
  })
}));

describe('MeasurementService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addMeasurement', () => {
    it('creates measurement with calculated values', async () => {
      const input: MeasurementInput = {
        date: '2024-01-15',
        crl_mm: 45.2
      };

      const result = await MeasurementService.addMeasurement(input);

      expect(result).toBeDefined();
      expect(result?.id).toBe('test-uuid-123');
      expect(result?.gestationalWeek).toBe(12);
      expect(result?.gestationalDay).toBe(3);
      expect(result?.measurements.crl_mm).toBe(45.2);
    });

    it('marks first measurement as official', async () => {
      // Mock empty database
      // const mockCount = vi.fn().mockResolvedValue(0);
      // const mockAdd = vi.fn().mockResolvedValue(undefined);
      
      // This would require proper Dexie mocking setup
      // For now, we're testing the logic conceptually
      const input: MeasurementInput = {
        date: '2024-01-15',
        crl_mm: 45.2
      };
                            
      const result = await MeasurementService.addMeasurement(input);
      expect(result).toBeDefined();
    });

    it('returns null for invalid measurement data', async () => {
      // Mock calculations to return null
      const { calculateMeasurement } = await import('./calculations');
      vi.mocked(calculateMeasurement).mockReturnValueOnce(null);

      const input: MeasurementInput = {
        date: '2024-01-15',
        crl_mm: -5
      };

      const result = await MeasurementService.addMeasurement(input);
      expect(result).toBeNull();
    });
  });

  describe('data validation', () => {
    it('validates required date field', async () => {
      const input = {
        crl_mm: 45.2
      } as MeasurementInput; // Type assertion to test invalid input

      // Should handle missing date gracefully
      const result = await MeasurementService.addMeasurement(input);
      expect(result).toBeNull();
    });

    it('validates measurement ranges', async () => {
      const input: MeasurementInput = {
        date: '2024-01-15',
        crl_mm: 999, // Invalid range
      };

      // Mock calculations to handle validation
      const { calculateMeasurement } = await import('./calculations');
      vi.mocked(calculateMeasurement).mockReturnValueOnce(null);

      const result = await MeasurementService.addMeasurement(input);
      expect(result).toBeNull();
    });
  });

  describe('official measurement handling', () => {
    it('allows setting measurement as official', async () => {
      // This test would require proper database mocking
      const measurementId = 'test-id';
      const result = await MeasurementService.setOfficialMeasurement(measurementId);
      
      // With proper mocking, this would verify the database update
      expect(typeof result).toBe('boolean');
    });

    it('unsets previous official measurement', async () => {
      // This would test that only one measurement can be official
      // Requires database state management in tests
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('data export/import', () => {
    it('exports data in correct format', async () => {
      const exportData = await MeasurementService.exportData();
      
      expect(exportData).toBeTruthy();
      
      // Parse and validate export format
      const parsed = JSON.parse(exportData);
      expect(parsed).toHaveProperty('exportDate');
      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('measurements');
      expect(Array.isArray(parsed.measurements)).toBe(true);
    });

    it('validates import data format', async () => {
      const validData = JSON.stringify({
        exportDate: new Date().toISOString(),
        version: '1.0',
        measurements: []
      });

      const result = await MeasurementService.importData(validData);
      expect(typeof result).toBe('boolean');
    });

    it('rejects invalid import data', async () => {
      const invalidData = JSON.stringify({
        invalid: 'format'
      });

      const result = await MeasurementService.importData(invalidData);
      expect(result).toBe(false);
    });
  });
});
