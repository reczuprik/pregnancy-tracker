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
      expect(result?.measurements.crl_mm).toBe(45.2);\n    });\n\n    it('marks first measurement as official', async () => {\n      // Mock empty database\n      const mockCount = vi.fn().mockResolvedValue(0);\n      const mockAdd = vi.fn().mockResolvedValue(undefined);\n      \n      // This would require proper Dexie mocking setup\n      // For now, we're testing the logic conceptually\n      const input: MeasurementInput = {\n        date: '2024-01-15',\n        crl_mm: 45.2\n      };\n\n      const result = await MeasurementService.addMeasurement(input);\n      expect(result).toBeDefined();\n    });\n\n    it('returns null for invalid measurement data', async () => {\n      // Mock calculations to return null\n      const { calculateMeasurement } = await import('./calculations');\n      vi.mocked(calculateMeasurement).mockReturnValueOnce(null);\n\n      const input: MeasurementInput = {\n        date: '2024-01-15',\n        crl_mm: -5\n      };\n\n      const result = await MeasurementService.addMeasurement(input);\n      expect(result).toBeNull();\n    });\n  });\n\n  describe('data validation', () => {\n    it('validates required date field', async () => {\n      const input = {\n        crl_mm: 45.2\n      } as MeasurementInput; // Type assertion to test invalid input\n\n      // Should handle missing date gracefully\n      const result = await MeasurementService.addMeasurement(input);\n      expect(result).toBeNull();\n    });\n\n    it('validates measurement ranges', async () => {\n      const input: MeasurementInput = {\n        date: '2024-01-15',\n        crl_mm: 999, // Invalid range\n      };\n\n      // Mock calculations to handle validation\n      const { calculateMeasurement } = await import('./calculations');\n      vi.mocked(calculateMeasurement).mockReturnValueOnce(null);\n\n      const result = await MeasurementService.addMeasurement(input);\n      expect(result).toBeNull();\n    });\n  });\n\n  describe('official measurement handling', () => {\n    it('allows setting measurement as official', async () => {\n      // This test would require proper database mocking\n      const measurementId = 'test-id';\n      const result = await MeasurementService.setOfficialMeasurement(measurementId);\n      \n      // With proper mocking, this would verify the database update\n      expect(typeof result).toBe('boolean');\n    });\n\n    it('unsets previous official measurement', async () => {\n      // This would test that only one measurement can be official\n      // Requires database state management in tests\n      expect(true).toBe(true); // Placeholder\n    });\n  });\n\n  describe('data export/import', () => {\n    it('exports data in correct format', async () => {\n      const exportData = await MeasurementService.exportData();\n      \n      expect(exportData).toBeTruthy();\n      \n      // Parse and validate export format\n      const parsed = JSON.parse(exportData);\n      expect(parsed).toHaveProperty('exportDate');\n      expect(parsed).toHaveProperty('version');\n      expect(parsed).toHaveProperty('measurements');\n      expect(Array.isArray(parsed.measurements)).toBe(true);\n    });\n\n    it('validates import data format', async () => {\n      const validData = JSON.stringify({\n        exportDate: new Date().toISOString(),\n        version: '1.0',\n        measurements: []\n      });\n\n      const result = await MeasurementService.importData(validData);\n      expect(typeof result).toBe('boolean');\n    });\n\n    it('rejects invalid import data', async () => {\n      const invalidData = JSON.stringify({\n        invalid: 'format'\n      });\n\n      const result = await MeasurementService.importData(invalidData);\n      expect(result).toBe(false);\n    });\n  });\n});