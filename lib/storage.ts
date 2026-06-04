'use client';

import { STORAGE_KEYS } from './constants';
import { Bill, Product, ShopSettings } from './types';
import { defaultProducts, defaultSettings } from './seedData';
import { CATEGORIES } from './constants';

// ── Generic helpers ──

export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

// ── Settings ──

export function getSettings(): ShopSettings {
  return getItem<ShopSettings>(STORAGE_KEYS.SETTINGS) ?? defaultSettings;
}

export function saveSettings(settings: ShopSettings): void {
  setItem(STORAGE_KEYS.SETTINGS, settings);
}

// ── Products ──

export function getProducts(): Product[] {
  return getItem<Product[]>(STORAGE_KEYS.PRODUCTS) ?? [];
}

export function saveProducts(products: Product[]): void {
  setItem(STORAGE_KEYS.PRODUCTS, products);
}

export function addProduct(product: Product): void {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

export function updateProduct(updated: Product): void {
  const products = getProducts().map((p) =>
    p.id === updated.id ? updated : p
  );
  saveProducts(products);
}

export function deleteProduct(id: string): void {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
}

// ── Bills ──

export function getBills(): Bill[] {
  return getItem<Bill[]>(STORAGE_KEYS.BILLS) ?? [];
}

export function saveBills(bills: Bill[]): void {
  setItem(STORAGE_KEYS.BILLS, bills);
}

export function addBill(bill: Bill): void {
  const bills = getBills();
  bills.unshift(bill); // newest first
  saveBills(bills);
}

export function updateBill(updated: Bill): void {
  const bills = getBills().map((b) =>
    b.id === updated.id ? updated : b
  );
  saveBills(bills);
}

export function deleteBill(id: string): void {
  const bills = getBills().filter((b) => b.id !== id);
  saveBills(bills);
}

export function getBillById(id: string): Bill | null {
  return getBills().find((b) => b.id === id) ?? null;
}

// ── Counter ──

export function getCounter(): number {
  return getItem<number>(STORAGE_KEYS.COUNTER) ?? 0;
}

export function incrementCounter(): number {
  const next = getCounter() + 1;
  setItem(STORAGE_KEYS.COUNTER, next);
  return next;
}

// ── Categories ──

export function getCategories(): string[] {
  return getItem<string[]>(STORAGE_KEYS.CATEGORIES) ?? [...CATEGORIES];
}

export function saveCategories(categories: string[]): void {
  setItem(STORAGE_KEYS.CATEGORIES, categories);
}

export function addCategory(category: string): void {
  const cats = getCategories();
  if (!cats.includes(category)) {
    cats.push(category);
    saveCategories(cats);
  }
}

// ── Seed / Initialize ──

export function initializeStorage(): void {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setItem(STORAGE_KEYS.SETTINGS, defaultSettings);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    setItem(STORAGE_KEYS.PRODUCTS, defaultProducts);
  }
  if (!localStorage.getItem(STORAGE_KEYS.BILLS)) {
    setItem(STORAGE_KEYS.BILLS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUNTER)) {
    setItem(STORAGE_KEYS.COUNTER, 0);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    setItem(STORAGE_KEYS.CATEGORIES, [...CATEGORIES]);
  }
}

// ── Data Management ──

export function exportAllData(): string {
  return JSON.stringify({
    settings: getSettings(),
    products: getProducts(),
    bills: getBills(),
    counter: getCounter(),
    categories: getCategories(),
  }, null, 2);
}

export function importAllData(json: string): void {
  try {
    const data = JSON.parse(json);
    if (data.settings) saveSettings(data.settings);
    if (data.products) saveProducts(data.products);
    if (data.bills) saveBills(data.bills);
    if (data.counter !== undefined) setItem(STORAGE_KEYS.COUNTER, data.counter);
    if (data.categories) saveCategories(data.categories);
  } catch (e) {
    console.error('Import failed:', e);
    throw new Error('Invalid data format');
  }
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => removeItem(key));
}
