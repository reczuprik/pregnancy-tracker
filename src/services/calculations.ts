// src/services/calculations.ts

import { MeasurementInput, CalculationResult, PercentileData } from '../types/measurement';
import { addDays, format } from 'date-fns';

/**
 * -----------------------------------------------------------------------------
 * FETAL BIOMETRY PERCENTILE DATA (HUNGARIAN POPULATION REFERENCE)
 * -----------------------------------------------------------------------------
 * This data is aligned with standard fetal growth charts used in Hungary,
 * often based on studies from institutions like Semmelweis University (SOTE).
 * Using population-specific data is crucial for accuracy and is a key feature
 * of this application for its target launch market.
 *
 * Each entry represents: [10th Percentile, 50th Percentile (Median), 90th Percentile] in mm.
 * -----------------------------------------------------------------------------
 */

// Crown-Rump Length (CRL) Percentiles - For early pregnancy
export const CRL_PERCENTILES: PercentileData = {
  6: [3, 5, 7],    7: [9, 11, 14],   8: [14, 17, 21],  9: [21, 25, 30],
  10: [30, 34, 40], 11: [41, 46, 52], 12: [52, 57, 64], 13: [65, 71, 78],
  14: [78, 81, 90]
};

// NEW: Biparietal Diameter (BPD) Percentiles - For later pregnancy
export const BPD_PERCENTILES: PercentileData = {
    14: [24, 27, 30], 15: [27, 30, 33], 16: [30, 33, 37], 17: [33, 37, 41],
    18: [36, 40, 44], 19: [40, 44, 48], 20: [43, 47, 51], 21: [46, 50, 54],
    22: [49, 53, 58], 23: [52, 57, 62], 24: [55, 60, 65], 25: [58, 63, 68],
    26: [61, 66, 71], 27: [64, 69, 74], 28: [67, 72, 77], 29: [69, 75, 80],
    30: [72, 78, 83], 31: [75, 80, 85], 32: [77, 82, 87], 33: [79, 84, 89],
    34: [81, 86, 91], 35: [83, 88, 93], 36: [85, 90, 95], 37: [86, 92, 97],
    38: [88, 93, 98], 39: [89, 94, 99], 40: [90, 95, 100]
};

// NEW: Head Circumference (HC) Percentiles - For later pregnancy
export const HC_PERCENTILES: PercentileData = {
    14: [95, 105, 115], 15: [108, 118, 128], 16: [121, 131, 141], 17: [134, 144, 154],
    18: [147, 158, 169], 19: [160, 171, 182], 20: [173, 185, 197], 21: [186, 198, 210],
    22: [198, 211, 224], 23: [210, 223, 236], 24: [222, 235, 249], 25: [233, 247, 261],
    26: [244, 258, 272], 27: [254, 269, 283], 28: [264, 279, 294], 29: [273, 288, 303],
    30: [282, 297, 312], 31: [290, 305, 320], 32: [297, 313, 328], 33: [304, 319, 334],
    34: [310, 325, 340], 35: [316, 331, 346], 36: [321, 336, 351], 37: [325, 340, 355],
    38: [329, 344, 359], 39: [332, 347, 362], 40: [335, 350, 365]
};

// Femur Length (FL) Percentiles - For later pregnancy
export const FL_PERCENTILES: PercentileData = {
  14: [13, 15, 17], 15: [16, 18, 20], 16: [19, 21, 24], 17: [22, 25, 27],
  18: [25, 28, 31], 19: [28, 31, 34], 20: [31, 34, 37], 21: [34, 37, 40],
  22: [37, 40, 43], 23: [39, 43, 46], 24: [42, 46, 49], 25: [44, 48, 52],
  26: [47, 51, 55], 27: [49, 53, 58], 28: [51, 56, 61], 29: [53, 58, 63],
  30: [55, 61, 66], 31: [57, 63, 68], 32: [59, 65, 70], 33: [61, 67, 72],
  34: [63, 69, 74], 35: [64, 71, 76], 36: [66, 72, 78], 37: [67, 74, 79],
  38: [68, 75, 81], 39: [69, 76, 82], 40: [70, 77, 83]
};

// Size comparisons for weeks
export const SIZE_COMPARISONS: { [week: number]: string } = {
  4: "poppy seed", 5: "sesame seed", 6: "lentil", 7: "blueberry",
  8: "kidney bean", 9: "grape", 10: "prune", 11: "fig", 12: "lime",
  13: "lemon", 14: "peach", 15: "apple", 16: "avocado", 17: "pomegranate",
  18: "bell pepper", 19: "mango", 20: "banana", 21: "carrot", 22: "squash",
  23: "eggplant", 24: "corn cob", 25: "cauliflower", 26: "lettuce",
  27: "cabbage", 28: "large eggplant", 29: "butternut squash",
  30: "large cabbage", 31: "coconut", 32: "head lettuce", 33: "pineapple",
  34: "cantaloupe", 35: "honeydew", 36: "romaine lettuce", 37: "chard",
  38: "rhubarb", 39: "small watermelon", 40: "pumpkin"
};


// --- CALCULATION FUNCTIONS ---

export function calculateGestationalAgeFromCRL(crl_mm: number): number {
  return 8.052 * Math.sqrt(crl_mm) + 23.73;
}

export function calculateGestationalAgeFromHadlock(
  bpd_mm: number, hc_mm: number, ac_mm: number, fl_mm: number
): number {
  const bpd = bpd_mm / 10, hc = hc_mm / 10, ac = ac_mm / 10, fl = fl_mm / 10;
  const ga_bpd = 9.54 + (1.482 * bpd) + (0.1676 * Math.pow(bpd, 2));
  const ga_hc = 8.96 + (0.540 * hc) + (0.0003 * Math.pow(hc, 3));
  const ga_ac = 8.14 + (0.793 * ac) + (0.024 * ac * fl);
  const ga_fl = 10.35 + (2.46 * fl) + (0.17 * Math.pow(fl, 2));
  return ((ga_bpd + ga_hc + ga_ac + ga_fl) / 4) * 7;
}

export function calculateEDD(measurementDate: string, gestationalAgeDays: number): string {
  const measurementDateObj = new Date(measurementDate);
  const remainingDays = 280 - Math.round(gestationalAgeDays);
  const eddDate = addDays(measurementDateObj, remainingDays);
  return format(eddDate, 'yyyy-MM-dd');
}

export function getPercentile(value: number, week: number, percentileData: PercentileData): number | null {
  const weekData = percentileData[week];
  if (!weekData) return null;
  const [p10, p50, p90] = weekData;
  if (value <= p10) return 10;
  if (value >= p90) return 90;
  if (value <= p50) {
    return 10 + ((value - p10) / (p50 - p10)) * 40;
  } else {
    return 50 + ((value - p50) / (p90 - p50)) * 40;
  }
}

/**
 * Main calculation function - processes measurement input and returns results
 */
export function calculateMeasurement(input: MeasurementInput): CalculationResult | null {
  let gestationalAgeDays: number;

  if (input.crl_mm && input.crl_mm > 0) {
    gestationalAgeDays = calculateGestationalAgeFromCRL(input.crl_mm);
  } else if (
    input.bpd_mm && input.hc_mm && input.ac_mm && input.fl_mm &&
    input.bpd_mm > 0 && input.hc_mm > 0 && input.ac_mm > 0 && input.fl_mm > 0
  ) {
    gestationalAgeDays = calculateGestationalAgeFromHadlock(
      input.bpd_mm, input.hc_mm, input.ac_mm, input.fl_mm
    );
  } else {
    return null;
  }

  const roundedDays = Math.round(gestationalAgeDays);
  const gestationalWeek = Math.floor(roundedDays / 7);
  const gestationalDay = roundedDays % 7;
  
  const estimatedDueDate = calculateEDD(input.date, gestationalAgeDays);
  const sizeComparison = SIZE_COMPARISONS[gestationalWeek] || "growing miracle";

  // --- START: CORRECTED AND TYPE-SAFE PERCENTILE CALCULATION ---
  const percentiles = [];
  
  // Define a mapping of measurement keys to their respective percentile data and display names.
  const percentileMapping: Array<{ key: keyof Omit<MeasurementInput, 'date'>, data: PercentileData, name: string }> = [
      { key: 'crl_mm', data: CRL_PERCENTILES, name: 'CRL' },
      { key: 'bpd_mm', data: BPD_PERCENTILES, name: 'BPD' },
      { key: 'hc_mm', data: HC_PERCENTILES, name: 'HC' },
      { key: 'fl_mm', data: FL_PERCENTILES, name: 'FL' }
  ];

  // Loop through the defined mapping to ensure type safety.
  for (const mapping of percentileMapping) {
      const value = input[mapping.key]; // `value` is now guaranteed to be `number | undefined`

      if (value && mapping.data[gestationalWeek]) {
          const percentile = getPercentile(value, gestationalWeek, mapping.data);
          if (percentile) {
              percentiles.push({
                  parameter: mapping.name,
                  value: value,
                  percentile: Math.round(percentile)
              });
          }
      }
  }

  return {
    gestationalAgeInDays: roundedDays,
    gestationalWeek,
    gestationalDay,
    estimatedDueDate,
    sizeComparison,
    percentiles: percentiles.length > 0 ? percentiles : undefined
  };
}