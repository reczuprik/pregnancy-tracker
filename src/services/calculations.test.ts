// calculationService.test.ts
import { calculateMeasurement } from './calculations';
import { MeasurementInput } from '../types/measurement';

describe('calculateMeasurement', () => {
  // -----------------------------
  // CRL-based calculation tests
  // -----------------------------
  it('calculates correctly with CRL input', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      crl_mm: 50
    };

    const result = calculateMeasurement(input);

    expect(result).not.toBeNull();
    expect(result!.gestationalWeek).toBeGreaterThan(0);
    expect(result!.gestationalDay).toBeGreaterThanOrEqual(0);
    expect(result!.estimatedDueDate).toBeDefined();
    expect(typeof result!.estimatedDueDate).toBe('string');
    expect(result!.basedOn).toBe('CRL');
  });

  it('returns null for invalid CRL input', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      crl_mm: -5
    };

    const result = calculateMeasurement(input);
    expect(result).toBeNull();
  });

  it('handles extremely large CRL gracefully', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      crl_mm: 200
    };

    const result = calculateMeasurement(input);
    expect(result).not.toBeNull();
  });

  // -----------------------------
  // Hadlock (multi-parameter) tests
  // -----------------------------
  it('calculates with multiple biometric inputs', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      bpd_mm: 50,
      hc_mm: 180,
      ac_mm: 150,
      fl_mm: 30
    };

    const result = calculateMeasurement(input);
    expect(result).not.toBeNull();
    expect(result!.gestationalWeek).toBeGreaterThan(10);
    expect(result!.basedOn).toBe('Hadlock');
  });

  it('returns null if no usable biometric data is provided', () => {
    const input: MeasurementInput = {
      date: '2024-01-15'
    };

    const result = calculateMeasurement(input);
    expect(result).toBeNull();
  });

  it('can calculate with only one biometric measurement (BPD)', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      bpd_mm: 55
    };

    const result = calculateMeasurement(input);
    expect(result).not.toBeNull();
    expect(result!.basedOn).toBe('Hadlock');
  });

  // -----------------------------
  // Date & EDD tests
  // -----------------------------
  it('calculates a valid estimated due date', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      crl_mm: 45
    };

    const result = calculateMeasurement(input);
    expect(result!.estimatedDueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('returns null for invalid date input', () => {
    const input: MeasurementInput = {
      date: 'not-a-date',
      crl_mm: 45
    };

    const result = calculateMeasurement(input);
    expect(result).toBeNull();
  });

  // -----------------------------
  // Percentile tests
  // -----------------------------
  it('calculates CRL percentile correctly', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      crl_mm: 45
    };

    const result = calculateMeasurement(input);

    expect(result?.percentiles).toBeDefined();
    const crlPercentile = result?.percentiles?.find(p => p.parameter === 'CRL');
    expect(crlPercentile).toBeDefined();
    expect(crlPercentile!.percentile).toBeGreaterThanOrEqual(1);
    expect(crlPercentile!.percentile).toBeLessThanOrEqual(99);
    expect(Number.isInteger(crlPercentile!.percentile)).toBe(true);
  });

  it('returns multiple percentile results when several measurements provided', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      bpd_mm: 45,
      hc_mm: 175,
      ac_mm: 150,
      fl_mm: 35
    };

    const result = calculateMeasurement(input);

    expect(result?.percentiles).toBeDefined();
    expect(result?.percentiles?.length).toBeGreaterThan(1);
  });

  it('skips percentiles if week is out of range for reference charts', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      crl_mm: 5 // ~ week 6, often out of reference tables
    };

    const result = calculateMeasurement(input);
    expect(result?.percentiles).toBeUndefined();
  });

  // -----------------------------
  // Consistency & edge case tests
  // -----------------------------
  it('rounds gestational days correctly', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      crl_mm: 33.7
    };

    const result = calculateMeasurement(input);
    expect(result?.gestationalDay).toBeGreaterThanOrEqual(0);
    expect(result?.gestationalDay).toBeLessThan(7);
  });

  it('produces consistent results for the same input', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      bpd_mm: 45,
      hc_mm: 175
    };

    const result1 = calculateMeasurement(input);
    const result2 = calculateMeasurement(input);

    expect(result1).toEqual(result2);
  });

  it('handles decimal input values gracefully', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      fl_mm: 32.4
    };

    const result = calculateMeasurement(input);
    expect(result).not.toBeNull();
    expect(result!.gestationalWeek).toBeGreaterThan(0);
  });

  // -----------------------------
  // Cross-checks
  // -----------------------------
  it('prefers CRL calculation if both CRL and Hadlock data are provided', () => {
    const input: MeasurementInput = {
      date: '2024-01-15',
      crl_mm: 40,
      bpd_mm: 50,
      hc_mm: 180
    };

    const result = calculateMeasurement(input);
    expect(result!.basedOn).toBe('CRL');
  });

  it('produces later gestational age for larger CRL', () => {
    const inputSmall: MeasurementInput = {
      date: '2024-01-15',
      crl_mm: 20
    };
    const inputLarge: MeasurementInput = {
      date: '2024-01-15',
      crl_mm: 60
    };

    const resultSmall = calculateMeasurement(inputSmall)!;
    const resultLarge = calculateMeasurement(inputLarge)!;

    const ageSmall = resultSmall.gestationalWeek * 7 + resultSmall.gestationalDay;
    const ageLarge = resultLarge.gestationalWeek * 7 + resultLarge.gestationalDay;

    expect(ageLarge).toBeGreaterThan(ageSmall);
  });
});
