/**
 * @fileoverview Utility module for storage
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(`dean-${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Storage Error (get ${key}):`, error);
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`dean-${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Storage Error (set ${key}):`, error);
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`dean-${key}`);
  }
};

export const getOfflineQueue = <T = any>(): T[] => {
  return storage.get<T[]>('offline-queue', []);
};

export const addToQueue = <T = any>(item: T): void => {
  const queue = getOfflineQueue<T>();
  queue.push({ ...item, queued_at: Date.now() } as any);
  storage.set('offline-queue', queue);
};

export const clearQueue = (): void => {
  storage.remove('offline-queue');
};

export const getQueueLength = (): number => {
  return getOfflineQueue().length;
};
