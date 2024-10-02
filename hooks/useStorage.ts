import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(initialValue: [boolean, T | null] = [true, null]): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: any | null) {
  if (Platform.OS === 'web') {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value)); // Stringify value
      }
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, JSON.stringify(value)); // Stringify value
    }
  }
}

export function useStorageState(key: string): UseStateHook<string | null> {
  // Public
  const [state, setState] = useAsyncState<string | null>();

  // Get
  useEffect(() => {
    const fetchValue = async () => {
      if (Platform.OS === 'web') {
        try {
          const item = localStorage.getItem(key);
          setState(item ? JSON.parse(item) : null); // Parse value
        } catch (e) {
          console.error('Local storage is unavailable:', e);
        }
      } else {
        try {
          const value = await SecureStore.getItemAsync(key);
          setState(value ? JSON.parse(value) : null); // Parse value
        } catch (error) {
          console.error('Error retrieving from SecureStore:', error);
        }
      }
    };
    
    fetchValue();
  }, [key]);

  // Set
  const setValue = useCallback(
    (value: any | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
