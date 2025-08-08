// src/services/constants.ts - NEW: Extract magic numbers
export const PREGNANCY_CONSTANTS = {
  TOTAL_PREGNANCY_DAYS: 280,
  TOTAL_PREGNANCY_WEEKS: 40,
  DAYS_PER_WEEK: 7,
  
  // Chart configuration
  CHART_ANIMATION_DURATION: 800,
  TOOLTIP_DELAY: 200,
  
  // UI constants
  CARD_ANIMATION_DELAY: 80, // milliseconds per card
  MOBILE_BREAKPOINT: 768,
  
  // Database constants
  DB_VERSION: 1,
  DB_NAME: 'PregnancyTracker'
} as const;