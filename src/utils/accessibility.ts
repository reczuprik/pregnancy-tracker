/**
 * Accessibility utilities and helpers
 * Provides functions to improve app accessibility
 */

/**
 * Announces content to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.setAttribute('class', 'sr-only');
  announcer.textContent = message;
  
  document.body.appendChild(announcer);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

/**
 * Manages focus for keyboard navigation
 */
export class FocusManager {
  private static focusableElements = [
    'button',
    'input',
    'select',
    'textarea',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  static getFocusableElements(container: Element): HTMLElement[] {
    return Array.from(
      container.querySelectorAll(this.focusableElements)
    ) as HTMLElement[];
  }

  static trapFocus(container: Element) {
    const focusableElements = this.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        // Allow components to handle escape
        container.dispatchEvent(new CustomEvent('focustrap:escape'));
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  static restoreFocus(previousActiveElement: Element | null) {
    if (previousActiveElement instanceof HTMLElement) {
      previousActiveElement.focus();
    }
  }
}

/**
 * Validates color contrast ratios
 */
export function validateColorContrast(foreground: string, background: string): {
  ratio: number;
  passes: { aa: boolean; aaa: boolean };
} {
  // This is a simplified implementation
  // In a real app, you'd use a proper color contrast library
  const getLuminance = (color: string): number => {
    // Convert hex to RGB and calculate luminance
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const getRGB = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    
    return 0.2126 * getRGB(r) + 0.7152 * getRGB(g) + 0.0722 * getRGB(b);
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio,
    passes: {
      aa: ratio >= 4.5,
      aaa: ratio >= 7
    }
  };
}

/**
 * Keyboard navigation helpers
 */
export const KeyboardNavigation = {
  /**
   * Handle arrow key navigation in lists/grids
   */
  handleArrowKeys: (e: KeyboardEvent, items: HTMLElement[], currentIndex: number) => {
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowDown':
        newIndex = Math.min(items.length - 1, currentIndex + 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(0, currentIndex - 1);
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = items.length - 1;
        break;
      default:
        return currentIndex;
    }
    
    e.preventDefault();
    items[newIndex]?.focus();
    return newIndex;
  },

  /**
   * Handle enter/space activation
   */
  handleActivation: (e: KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  }
};

/**
 * Screen reader utilities
 */
export const ScreenReader = {
  /**
   * Create descriptive text for screen readers
   */
  describeMeasurement: (measurement: {
    parameter: string;
    value: number;
    unit: string;
    percentile?: number;
  }) => {
    let description = `${measurement.parameter}: ${measurement.value} ${measurement.unit}`;
    
    if (measurement.percentile) {
      description += `, which is in the ${measurement.percentile}th percentile`;
    }
    
    return description;
  },

  /**
   * Create progress announcements
   */
  announceProgress: (current: number, total: number, itemType: string) => {
    return `${itemType} ${current} of ${total}`;
  },

  /**
   * Create status announcements
   */
  announceStatus: (status: 'loading' | 'success' | 'error', context?: string) => {
    const messages = {
      loading: `Loading${context ? ` ${context}` : ''}...`,
      success: `Successfully ${context || 'completed'}`,
      error: `Error ${context ? `with ${context}` : 'occurred'}`
    };
    
    return messages[status];
  }
};

/**
 * ARIA attributes helpers
 */
export const ARIA = {
  /**
   * Generate ARIA attributes for expandable content
   */
  expandable: (id: string, expanded: boolean) => ({
    'aria-expanded': expanded,
    'aria-controls': id,
    'aria-describedby': `${id}-desc`
  }),

  /**
   * Generate ARIA attributes for form validation
   */
  validation: (fieldId: string, hasError: boolean, errorId?: string) => ({
    'aria-invalid': hasError,
    'aria-describedby': hasError && errorId ? errorId : undefined
  }),

  /**
   * Generate ARIA attributes for live regions
   */
  liveRegion: (politeness: 'polite' | 'assertive' = 'polite') => ({
    'aria-live': politeness,
    'aria-atomic': true
  })
};

/**
 * Accessibility testing helpers for development
 */
export const A11yTesting = {
  /**
   * Check for missing alt text on images
   */
  checkImageAltText: () => {
    if (process.env.NODE_ENV === 'development') {
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (!img.alt && !img.getAttribute('aria-hidden')) {
          console.warn(`Image ${index} missing alt text:`, img);
        }
      });
    }
  },

  /**
   * Check for proper heading hierarchy
   */
  checkHeadingHierarchy: () => {
    if (process.env.NODE_ENV === 'development') {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let previousLevel = 0;
      
      headings.forEach((heading) => {
        const currentLevel = parseInt(heading.tagName.charAt(1));
        if (currentLevel > previousLevel + 1) {
          console.warn(`Heading hierarchy skip detected: ${heading.tagName}`, heading);
        }
        previousLevel = currentLevel;
      });
    }
  },

  /**
   * Check for keyboard-only navigation issues
   */
  simulateKeyboardNavigation: () => {
    if (process.env.NODE_ENV === 'development') {
      const focusableElements = FocusManager.getFocusableElements(document.body);
      console.log(`Found ${focusableElements.length} focusable elements:`, focusableElements);
    }
  }
};
