// ──────────────────────────────────────────
// localStorage Keys
// ──────────────────────────────────────────

export const STORAGE_KEYS = {
  SETTINGS: 'nsc_settings',
  PRODUCTS: 'nsc_products',
  BILLS: 'nsc_bills',
  COUNTER: 'nsc_counter',
  CATEGORIES: 'nsc_categories',
} as const;

export const GST_RATES = [0, 5, 12, 18] as const;

export const UNITS = ['piece', 'kg', 'grams', 'packet', 'bundle', 'set', 'dozen'] as const;

export const CATEGORIES = [
  'ಹಗ್ಗ / Ropes & Strings',
  'ಹೆಡಿಗೆ / Baskets & Mats',
  'ಬೆತ್ತ / Cane Products',
  'ಸ್ಟೀಲ್ / Steel Products',
  'ಅಲ್ಯೂಮಿನಿಯಂ / Aluminium',
  'ಪ್ಲಾಸ್ಟಿಕ್ / Plastic Goods',
  'ಬ್ರಶ್ & ಸ್ವಚ್ಛತೆ / Brushes & Cleaning',
  'ಕಬ್ಬಿಣ / Iron Products',
  'ವಿವಿಧ / Miscellaneous',
] as const;
