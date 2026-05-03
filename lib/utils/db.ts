import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'dean-offline-db';
const STORE_NAME = 'offline-alerts';

export interface OfflineAlert {
  id: string;
  type: string;
  location: { lat: number; lng: number };
  timestamp: string;
  synced: boolean;
  metadata?: any;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
  if (typeof window === 'undefined') return null;
  
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

export const saveOfflineAlert = async (alert: OfflineAlert) => {
  const db = await getDB();
  if (!db) return;
  await db.put(STORE_NAME, alert);
};

export const getUnsyncedAlerts = async (): Promise<OfflineAlert[]> => {
  const db = await getDB();
  if (!db) return [];
  const alerts = await db.getAll(STORE_NAME);
  return alerts.filter(a => !a.synced);
};

export const markAlertAsSynced = async (id: string) => {
  const db = await getDB();
  if (!db) return;
  const alert = await db.get(STORE_NAME, id);
  if (alert) {
    alert.synced = true;
    await db.put(STORE_NAME, alert);
  }
};

export const clearSyncedAlerts = async () => {
  const db = await getDB();
  if (!db) return;
  const alerts = await db.getAll(STORE_NAME);
  for (const alert of alerts) {
    if (alert.synced) {
      await db.delete(STORE_NAME, alert.id);
    }
  }
};
