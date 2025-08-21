import { useEffect, useRef, useCallback, useState } from 'react';
import { announceToScreenReader, FocusManager, A11yTesting, KeyboardNavigation } from '../utils/accessibility';

/**
 * Hook for managing focus trap in modals/dialogs
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement;
    
    // Set up focus trap
    const cleanup = FocusManager.trapFocus(containerRef.current);

    return () => {
      cleanup();
      // Restore focus to previous element
      FocusManager.restoreFocus(previousActiveElement.current);
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Hook for screen reader announcements
 */
export function useScreenReaderAnnouncement() {
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      announceToScreenReader(message, priority);
    },
    []
  );

  const announceNavigation = useCallback((pageName: string) => {
    announce(`Navigated to ${pageName}`);
  }, [announce]);

  const announceAction = useCallback((action: string) => {
    announce(action, 'assertive');
  }, [announce]);

  return {
    announce,
    announceNavigation,
    announceAction
  };
}

/**
 * Hook for keyboard navigation
 */
export function useKeyboardNavigation(
  items: Array<{ id: string; element?: HTMLElement }>,
  onSelect?: (id: string) => void
) {
  const activeIndex = useRef(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const elements = items
        .map(item => item.element || document.getElementById(item.id))
        .filter((el): el is HTMLElement => el !== null);

      if (elements.length === 0) return;

      const newIndex = KeyboardNavigation.handleArrowKeys(
        e,
        elements,
        activeIndex.current
      );
      
      if (newIndex !== activeIndex.current) {
        activeIndex.current = newIndex;
      }

      // Handle selection
      if ((e.key === 'Enter' || e.key === ' ') && onSelect) {
        e.preventDefault();
        onSelect(items[activeIndex.current].id);
      }
    },
    [items, onSelect]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    activeIndex: activeIndex.current,
    setActiveIndex: (index: number) => {
      activeIndex.current = Math.max(0, Math.min(items.length - 1, index));
    }
  };
}

/**
 * Hook for reduced motion preferences
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for form accessibility
 */
export function useFormAccessibility(fieldId: string) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  const fieldProps = {
    id: fieldId,
    'aria-invalid': touched && error ? 'true' : 'false',
    'aria-describedby': [
      error ? errorId : null,
      descriptionId
    ].filter(Boolean).join(' ') || undefined
  };

  const errorProps = error ? {
    id: errorId,
    role: 'alert',
    'aria-live': 'polite'
  } : {};

  const setFieldError = useCallback((errorMessage: string | null) => {
    setError(errorMessage);
    if (errorMessage) {
      announceToScreenReader(`Error: ${errorMessage}`, 'assertive');
    }
  }, []);

  return {
    fieldProps,
    errorProps,
    error,
    setError: setFieldError,
    touched,
    setTouched,
    errorId,
    descriptionId
  };
}