/**
 * @fileoverview Utility module for db
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'dean-offline-db';
const DB_VERSION = 2;
const STORE_NAME = 'offline-alerts';
const LOG_STORE = 'offline-logs';

export interface OfflineAlert {
  id: string;
  type: string;
  location: { lat: number; lng: number };
  timestamp: string;
  synced: 0 | 1;
  metadata?: any;
}

export interface OfflineLog {
  id: string;
  action: string;
  timestamp: string;
  synced: 0 | 1;
  data?: any;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
  if (typeof window === 'undefined') return null;
  
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Handle Alerts Store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('synced', 'synced');
        } else if (oldVersion < 2) {
          const store = transaction.objectStore(STORE_NAME);
          if (!store.indexNames.contains('synced')) {
            store.createIndex('synced', 'synced');
          }
        }

        // Handle Logs Store
        if (!db.objectStoreNames.contains(LOG_STORE)) {
          const logStore = db.createObjectStore(LOG_STORE, { keyPath: 'id' });
          logStore.createIndex('synced', 'synced');
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
  return db.getAllFromIndex(STORE_NAME, 'synced', 0); 
};

export const saveOfflineLog = async (log: OfflineLog) => {
  const db = await getDB();
  if (!db) return;
  await db.put(LOG_STORE, log);
};

export const getUnsyncedLogs = async (): Promise<OfflineLog[]> => {
  const db = await getDB();
  if (!db) return [];
  return db.getAllFromIndex(LOG_STORE, 'synced', 0);
};

export const markAlertAsSynced = async (id: string) => {
  const db = await getDB();
  if (!db) return;
  const alert = await db.get(STORE_NAME, id);
  if (alert) {
    alert.synced = 1;
    await db.put(STORE_NAME, alert);
  }
};

export const clearSyncedAlerts = async () => {
  const db = await getDB();
  if (!db) return;
  const alerts = await db.getAll(STORE_NAME);
  for (const alert of alerts) {
    if (alert.synced === 1) {
      await db.delete(STORE_NAME, alert.id);
    }
  }
};


export const clearAllAlerts = async () => { const db = await getDB(); if (!db) return; await db.clear(STORE_NAME); };