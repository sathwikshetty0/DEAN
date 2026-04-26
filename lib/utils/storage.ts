const QUEUE_KEY = 'dean-offline-queue';

export const getOfflineQueue = (): any[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const addToQueue = (item: any): void => {
  if (typeof window === 'undefined') return;
  const queue = getOfflineQueue();
  queue.push({ ...item, queued_at: Date.now() });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const clearQueue = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(QUEUE_KEY);
};

export const getQueueLength = (): number => {
  return getOfflineQueue().length;
};
