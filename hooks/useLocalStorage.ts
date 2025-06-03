import { useState, useEffect, Dispatch, SetStateAction, useCallback } from 'react';

function useLocalStorage<T,>(
  key: string,
  initialValue: T,
  onError?: (error: Error) => void // New onError callback
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      if (onError && error instanceof Error) {
        onError(error); 
      }
      return initialValue;
    }
  });

  const stableOnError = useCallback((error: Error) => {
    if (onError) {
      onError(error);
    }
  }, [onError]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const serializedValue = JSON.stringify(storedValue);
        // Basic check for very large strings, though localStorage itself will throw a better error
        if (serializedValue.length > 4.5 * 1024 * 1024) { // Approx 4.5MB, conservative limit
            console.warn(`Valor para a chave "${key}" é muito grande (${(serializedValue.length / 1024 / 1024).toFixed(2)}MB), pode exceder o limite do localStorage.`);
        }
        window.localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
        if (error instanceof Error) { // Ensure it's an Error object
          stableOnError(error); // Call onError for write errors
        } else {
          // Handle cases where error might not be an Error instance
          stableOnError(new Error(String(error)));
        }
      }
    }
  }, [key, storedValue, stableOnError]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;