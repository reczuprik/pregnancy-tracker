// Core measurement types
export interface Measurement {
  id: string;
  date: string;
  gestationalWeek: number;
  gestationalDay: number;
  measurements: {
    crl_mm?: number;
    bpd_mm?: number;
    hc_mm?: number;
    ac_mm?: number;
    fl_mm?: number;
  };
  estimatedDueDate: string;
  isOfficial: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MeasurementInput {
  date: string;
  crl_mm?: number;
  bpd_mm?: number;
  hc_mm?: number;
  ac_mm?: number;
  fl_mm?: number;
}

export interface CalculationResult {
  gestationalAgeInDays: number;
  gestationalWeek: number;
  gestationalDay: number;
  estimatedDueDate: string;
  sizeComparison: string;
  percentiles?: {
    parameter: string;
    value: number;
    percentile: number;
  }[];
}

export interface PercentileData {
  [week: number]: [number, number, number]; // [10th, 50th, 90th percentile]
}

export type MeasurementMode = 'crl' | 'hadlock';

export interface AppState {
  measurements: Measurement[];
  selectedMeasurement?: Measurement;
  isLoading: boolean;
  error?: string;
  language: 'en' | 'hu';
  mode: MeasurementMode;
}