
type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
};

interface DebounceOptions {
  leading?: boolean;
  trailing?: boolean;
}

// Delays execution until no calls occur within the given time
// @param fn - The function to debounce
// @param delay - The delay in milliseconds
// @param options - Optional configuration for leading and trailing execution
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 200,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  const { leading = false, trailing = true } = options;

  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let hasLeadingCalled = false;

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;

    if (leading && !timeout && !hasLeadingCalled) {
      fn(...args);
      hasLeadingCalled = true;
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;

      if (trailing && lastArgs) {
        fn(...lastArgs);
      }

      hasLeadingCalled = false;
      lastArgs = null;
    }, delay);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    lastArgs = null;
    hasLeadingCalled = false;
  };

  debounced.flush = () => {
    if (timeout && lastArgs) {
      clearTimeout(timeout);
      fn(...lastArgs);
      timeout = null;
      lastArgs = null;
      hasLeadingCalled = false;
    }
  };

  return debounced;
}
