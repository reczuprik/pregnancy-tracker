
import Dexie, { Table } from 'dexie';
import { Measurement, MeasurementInput } from '../types/measurement';
import { calculateMeasurement } from './calculations';
import { v4 as uuidv4 } from 'uuid';

export class PregnancyDatabase extends Dexie {
  measurements!: Table<Measurement>;

  constructor() {
    super('PregnancyTracker');
    this.version(1).stores({
      measurements: 'id, date, gestationalWeek, isOfficial, createdAt'
    });
  }
}

export const db = new PregnancyDatabase();

export class MeasurementService {
  
  /**
   * Add a new measurement
   */
static async addMeasurement(input: MeasurementInput): Promise<Measurement | null> {
    try {
      const calculationResult = calculateMeasurement(input);
      if (!calculationResult) {
        throw new Error('Invalid measurement data');
      }
      const existingCount = await db.measurements.count();
      const isFirstMeasurement = existingCount === 0;

      const measurement: Measurement = {
        id: uuidv4(),
        date: input.date,
        gestationalWeek: calculationResult.gestationalWeek,
        gestationalDay: calculationResult.gestationalDay,
        measurements: {
          crl_mm: input.crl_mm, bpd_mm: input.bpd_mm, hc_mm: input.hc_mm,
          ac_mm: input.ac_mm, fl_mm: input.fl_mm
        },
        estimatedDueDate: calculationResult.estimatedDueDate,
        isOfficial: isFirstMeasurement ? 1 : 0, // FIX: Save as number 1 or 0
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.measurements.add(measurement);
      return measurement;
    } catch (error) {
      console.error('Error adding measurement:', error);
      return null;
    }
  }

  /**
   * Get all measurements ordered by date
   */
  static async getAllMeasurements(): Promise<Measurement[]> {
    try {
      return await db.measurements.orderBy('date').toArray();
    } catch (error) {
      console.error('Error fetching measurements:', error);
      return [];
    }
  }

  /**
   * Get measurement by ID
   */
  static async getMeasurementById(id: string): Promise<Measurement | undefined> {
    try {
      return await db.measurements.get(id);
    } catch (error) {
      console.error('Error fetching measurement:', error);
      return undefined;
    }
  }

  /**
   * Update existing measurement
   */
  static async updateMeasurement(id: string, input: MeasurementInput): Promise<Measurement | null> {
    try {
      const existingMeasurement = await this.getMeasurementById(id);
      if (!existingMeasurement) {
        throw new Error('Measurement not found');
      }

      // Recalculate with new data
      const calculationResult = calculateMeasurement(input);
      if (!calculationResult) {
        throw new Error('Invalid measurement data');
      }

      // Update measurement
      const updatedMeasurement: Measurement = {
        ...existingMeasurement,
        date: input.date,
        gestationalWeek: calculationResult.gestationalWeek,
        gestationalDay: calculationResult.gestationalDay,
        measurements: {
          crl_mm: input.crl_mm,
          bpd_mm: input.bpd_mm,
          hc_mm: input.hc_mm,
          ac_mm: input.ac_mm,
          fl_mm: input.fl_mm
        },
        estimatedDueDate: calculationResult.estimatedDueDate,
        updatedAt: new Date().toISOString()
      };

      await db.measurements.update(id, updatedMeasurement);
      return updatedMeasurement;
      
    } catch (error) {
      console.error('Error updating measurement:', error);
      return null;
    }
  }

  /**
   * Delete measurement
   */
  static async deleteMeasurement(id: string): Promise<boolean> {
    try {
      await db.measurements.delete(id);
      return true;
    } catch (error) {
      console.error('Error deleting measurement:', error);
      return false;
    }
  }

  /**
   * Set measurement as official (for EDD calculation)
   */
  

  static async setOfficialMeasurement(id: string): Promise<boolean> {
    try {
      // First, unset all other official measurements by finding where isOfficial is TRUE
      await db.measurements.where('isOfficial').equals(1).modify({ isOfficial: 0 });
      
      // Set the selected measurement as official
      await db.measurements.update(id, { isOfficial: 1, updatedAt: new Date().toISOString() });
      return true;
    } catch (error) {
      console.error('Error setting official measurement:', error);
      return false;
    }
  }

  /**
   * Get the official EDD (from official measurement)
   */
  static async getOfficialEDD(): Promise<string | null> {
    try {
      const officialMeasurement = await db.measurements
        .where('isOfficial')
        .equals(1)
        .first();
      
      return officialMeasurement?.estimatedDueDate || null;
    } catch (error) {
      console.error('Error fetching official EDD:', error);
      return null;
    }
  }

  /**
   * Export all data as JSON
   */
  static async exportData(): Promise<string> {
    try {
      const measurements = await this.getAllMeasurements();
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        measurements
      };
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '';
    }
  }

  /**
   * Import data from JSON
   */
  static async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      if (!data.measurements || !Array.isArray(data.measurements)) {
        throw new Error('Invalid data format');
      }

      // Clear existing data (optional - could merge instead)
      await db.measurements.clear();

      // Import measurements
      await db.measurements.bulkAdd(data.measurements);
      return true;
      
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Get measurements for growth chart (with specific parameter)
   */
  // FIX: Updated the parameter type to accept all chartable measurements
  static async getMeasurementsForChart(parameter: 'crl_mm' | 'fl_mm' | 'bpd_mm' | 'hc_mm'): Promise<Array<{week: number, value: number}>> {
    try {
      const measurements = await this.getAllMeasurements();
      return measurements
        .filter(m => m.measurements[parameter] != null)
        .map(m => ({
          week: m.gestationalWeek + (m.gestationalDay / 7),
          value: m.measurements[parameter]!
        }))
        .sort((a, b) => a.week - b.week);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return [];
    }
  }
  /**
   * Get the single official measurement
   */
  static async getOfficialMeasurement(): Promise<Measurement | undefined> {
    try {
      return await db.measurements.where('isOfficial').equals(1).first();
    } catch (error) {
      console.error('Error fetching official measurement:', error);
      return undefined;
    }
  }
}