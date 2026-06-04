import { Product, ShopSettings } from './types';

export const defaultSettings: ShopSettings = {
  shopNameEn: 'N. Shetty & Co.',
  shopNameKn: 'ಎನ್. ಶೆಟ್ಟಿ & ಕಂ.',
  addressLine1: 'ಸರ್ಕಲ್, ಬಡೇರಿಹೊಬಳಿ',
  addressLine2: 'ಎನ್ ಹೆಚ್ 77, ಕುಂದಾಪುರ – 576201',
  phone1: '9449824554',
  phone2: '8431798200',
  gstin: '29AIVPN6346B1ZT',
  email: 'nshettycosmg@gmail.com',
  altEmail: 'distsmg@gmail.com',
  bankName: 'Bank of Baroda',
  accountNo: '82020200000101',
  ifscCode: 'BARBOVJKUNP',
  branch: 'Kundapura, Karnataka',
  declaration: 'We declare that this invoice shows the actual price of Karnataka India',
  pan: '',
  logoBase64: '',
  signatureBase64: '',
  defaultLanguage: 'both',
  gstOnByDefault: true,
  defaultGstRate: 5,
  showHsnTable: true,
  showBankDetails: true,
  showDeclaration: true,
  billNumberPrefix: '',
  paperSize: 'A4',
};

export const defaultProducts: Product[] = [
  // ── CATEGORY 1: ಹಗ್ಗ / Ropes & Strings ──
  { id: 'p01', nameKn: 'ಅತ್ತರ ತಟ್ಟೆ 6\'x4\' ಪೀಠ', nameEn: 'Attar Tatte 6x4 Peetha', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'piece', price: 850, gstRate: 0, active: true },
  { id: 'p02', nameKn: '4 ಎಳೆಯ ದಪ್ಪ ಮಣಿಹಪು ಹಗ್ಗ (10ಫೀ ಉದ್ದ, 4ಸ್ಮೀ ಸುತ್ತಳತೆ)', nameEn: '4-ply Thick Rope 10ft', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'piece', price: 35, gstRate: 5, active: true },
  { id: 'p03', nameKn: '½" ದಪ್ಪ ಮಣಿಹಪು ಹಗ್ಗ', nameEn: 'Half-inch Rope', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'piece', price: 21, gstRate: 5, active: true },
  { id: 'p04', nameKn: 'ಹುರಿ ಹಗ್ಗ (ಕಟ್ಟು)', nameEn: 'Huri Hagga (Bundle)', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'bundle', price: 21, gstRate: 5, active: true },
  { id: 'p05', nameKn: '1" ದಪ್ಪ ಬಾವಿ ಹಗ್ಗ (90ಫೀಟ್ ಉದ್ದ)', nameEn: '1 inch Well Rope 90ft', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'piece', price: 950, gstRate: 5, active: true },
  { id: 'p06', nameKn: '1½" ದಪ್ಪ ಬಾವಿ ಹಗ್ಗ (40ಫೀಟ್ ಉದ್ದ)', nameEn: '1.5 inch Well Rope 40ft', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'piece', price: 2200, gstRate: 5, active: true },
  { id: 'p07', nameKn: '1½" ದಪ್ಪ x 30ಫೀಟ್ ಉದ್ದ ಮಣಿಹಿನ ಬಾವಿ ಹಗ್ಗ', nameEn: '1.5 inch x 30ft Rope', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'piece', price: 3400, gstRate: 5, active: true },
  { id: 'p08', nameKn: '2" ದಪ್ಪ ಬಾವಿ ಹಗ್ಗ (90ಫೀಟ್ ಉದ್ದ)', nameEn: '2 inch Well Rope 90ft', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'piece', price: 3800, gstRate: 5, active: true },
  { id: 'p09', nameKn: 'ಕೆಂಪು ಪಟ್ಟಿ ನೂಲು – ದಪ್ಪ (1ಕೆ.ಜಿ)', nameEn: 'Red Strip Thread Thick 1kg', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'kg', price: 450, gstRate: 5, active: true },
  { id: 'p10', nameKn: 'ಕೆಂಪು ಪಟ್ಟಿ ನೂಲು – ಸಪೂರ (1ಕೆ.ಜಿ)', nameEn: 'Red Strip Thread Thin 1kg', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'kg', price: 470, gstRate: 5, active: true },
  { id: 'p11', nameKn: 'ಬಕ್ಕು ನೂಲು', nameEn: 'Bakku Thread', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'kg', price: 219, gstRate: 5, active: true },
  { id: 'p12', nameKn: 'ನೈಲಾನ್ ದಡಿಹಗ್ಗ (ದೊಡ್ಡದು)', nameEn: 'Nylon Rope Large', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'piece', price: 110, gstRate: 5, active: true },
  { id: 'p13', nameKn: 'ನೈಲಾನ್ ದಡಿಹಗ್ಗ (ಸಣ್ಣದು)', nameEn: 'Nylon Rope Small', category: 'ಹಗ್ಗ / Ropes & Strings', unit: 'piece', price: 100, gstRate: 5, active: true },

  // ── CATEGORY 2: ಹೆಡಿಗೆ / Baskets & Mats ──
  { id: 'p14', nameKn: 'ದನ ಕಟ್ಟುವ ಟಚ್ರೂಪ್ – 12ಎಂ.ಎಂ ದಪ್ಪ, 16ಎಂ.ಎಂ ದಪ್ಪ', nameEn: 'Animal Tie Rope 12mm/16mm', category: 'ಹೆಡಿಗೆ / Baskets & Mats', unit: 'kg', price: 370, gstRate: 5, active: true },
  { id: 'p15', nameKn: '1 ಮುಡಿ ಹೆಡಿಗೆ (38 ಕೆ.ಜಿ)', nameEn: '1 Mudi Hedige 38kg', category: 'ಹೆಡಿಗೆ / Baskets & Mats', unit: 'piece', price: 920, gstRate: 5, active: true },
  { id: 'p16', nameKn: 'ಪ್ಲಾಸ್ಟಿಕ್ ಹೆಡಿಗೆ ಮೀಡಿಯಂ ನಂ 555', nameEn: 'Plastic Basket Medium 555', category: 'ಹೆಡಿಗೆ / Baskets & Mats', unit: 'piece', price: 170, gstRate: 5, active: true },
  { id: 'p17', nameKn: 'ಪ್ಲಾಸ್ಟಿಕ್ ಹೆಡಿಗೆ ದೊಡ್ಡದು ನಂ 1000', nameEn: 'Plastic Basket Large 1000', category: 'ಹೆಡಿಗೆ / Baskets & Mats', unit: 'piece', price: 330, gstRate: 5, active: true },
  { id: 'p18', nameKn: 'ಹುಲ್ಲಿನ ಚಾಪೆ 4x6', nameEn: 'Grass Mat 4x6', category: 'ಹೆಡಿಗೆ / Baskets & Mats', unit: 'piece', price: 150, gstRate: 5, active: true },
  { id: 'p19', nameKn: 'ಪ್ಲಾಸ್ಟಿಕ್ ಚಾಪೆ 4x6 (ಮೀಡಿಯಂ)', nameEn: 'Plastic Mat 4x6 Medium', category: 'ಹೆಡಿಗೆ / Baskets & Mats', unit: 'piece', price: 190, gstRate: 5, active: true },
  { id: 'p20', nameKn: 'ಫೈಬರ್ ಕ್ರೇಚ್ – 2x1½x1', nameEn: 'Fibre Crate 2x1.5x1', category: 'ಹೆಡಿಗೆ / Baskets & Mats', unit: 'piece', price: 1300, gstRate: 5, active: true },
  { id: 'p21', nameKn: 'ಡೋರ್ ಮ್ಯಾಟ್ – 16x24 – ಹುರಿ', nameEn: 'Door Mat 16x24 Rope', category: 'ಹೆಡಿಗೆ / Baskets & Mats', unit: 'piece', price: 160, gstRate: 5, active: true },
  { id: 'p22', nameKn: 'ಡೋರ್ ಮ್ಯಾಟ್ – 16x24 – ರಬ್ಬರ್', nameEn: 'Door Mat 16x24 Rubber', category: 'ಹೆಡಿಗೆ / Baskets & Mats', unit: 'piece', price: 190, gstRate: 5, active: true },
  { id: 'p23', nameKn: 'ಡೋರ್ ಮ್ಯಾಟ್ – 16x24 – ಬಟ್ಟೆ', nameEn: 'Door Mat 16x24 Cloth', category: 'ಹೆಡಿಗೆ / Baskets & Mats', unit: 'piece', price: 120, gstRate: 5, active: true },

  // ── CATEGORY 3: ಬೆತ್ತ / Cane Products ──
  { id: 'p24', nameKn: 'ಬೆತ್ತದ ಬುಟ್ಟಿ', nameEn: 'Cane Basket', category: 'ಬೆತ್ತ / Cane Products', unit: 'piece', price: 700, gstRate: 5, active: true },
  { id: 'p25', nameKn: 'ಬೆತ್ತದ ಹೂ ಬುಟ್ಟಿ', nameEn: 'Cane Flower Basket', category: 'ಬೆತ್ತ / Cane Products', unit: 'piece', price: 280, gstRate: 5, active: true },
  { id: 'p26', nameKn: 'ಬೆತ್ತದ ಕನ್ನಡ ಬುಟ್ಟಿ', nameEn: 'Cane Kannada Basket', category: 'ಬೆತ್ತ / Cane Products', unit: 'piece', price: 740, gstRate: 5, active: true },

  // ── CATEGORY 4: ಸ್ಟೀಲ್ / Steel Products ──
  { id: 'p27', nameKn: 'ಸ್ಟೀಲ್ ಕ್ಕಿ ಪಾಟಿ (1.5 ಲೀಟರ್) (2 ಪೀಸ್)', nameEn: 'Steel Key Pot 1.5L 2pc', category: 'ಸ್ಟೀಲ್ / Steel Products', unit: 'set', price: 676, gstRate: 5, active: true },
  { id: 'p28', nameKn: 'ಸ್ಟೀಲ್ ಕ್ಕಿ ಮರಿಕೆ (2 ಪೀಸ್)', nameEn: 'Steel Key Marike 2pc', category: 'ಸ್ಟೀಲ್ / Steel Products', unit: 'set', price: 809, gstRate: 5, active: true },
  { id: 'p29', nameKn: 'ಸ್ಟೀಲ್ 4 ಇನ್ 1 ಪಾತ್ರೆ (2 ಪೀಸ್)', nameEn: 'Steel 4-in-1 Vessel 2pc', category: 'ಸ್ಟೀಲ್ / Steel Products', unit: 'set', price: 1619, gstRate: 5, active: true },
  { id: 'p30', nameKn: 'ಸ್ಟೀಲ್ ಬಾಲ್ಡಿ ಸಣ್ಣದು – 1.000 ಗ್ರಂ ತೂಕದ್ದು', nameEn: 'Steel Bucket Small 1kg', category: 'ಸ್ಟೀಲ್ / Steel Products', unit: 'kg', price: 560, gstRate: 5, active: true },
  { id: 'p31', nameKn: 'ಸ್ಟೀಲ್ ಬಾಲ್ಡಿ ದೊಡ್ಡದು – 1.400 ಗ್ರಂ ತೂಕದ್ದು', nameEn: 'Steel Bucket Large 1.4kg', category: 'ಸ್ಟೀಲ್ / Steel Products', unit: 'kg', price: 560, gstRate: 5, active: true },
  { id: 'p32', nameKn: 'ಸ್ಟೀಲ್ 4 ಇನ್ 1 ಪಾತ್ರೆ', nameEn: 'Steel 4-in-1 Vessel', category: 'ಸ್ಟೀಲ್ / Steel Products', unit: 'kg', price: 1700, gstRate: 5, active: true },
  { id: 'p33', nameKn: 'ಸ್ಟೀಲ್ ಕ್ರೆಪಾಟಿ (1½ ಲೀಟರ್)', nameEn: 'Steel Krepati 1.5L', category: 'ಸ್ಟೀಲ್ / Steel Products', unit: 'kg', price: 710, gstRate: 5, active: true },
  { id: 'p34', nameKn: 'ಸ್ಟೀಲ್ ಕ್ರೆಮರಿಗೆ', nameEn: 'Steel Kremarige', category: 'ಸ್ಟೀಲ್ / Steel Products', unit: 'kg', price: 850, gstRate: 5, active: true },

  // ── CATEGORY 5: ಅಲ್ಯೂಮಿನಿಯಂ / Aluminium ──
  { id: 'p35', nameKn: 'ಅಲ್ಯೂಮಿನಿಯಂ ಸೇರು 1 ಕೆ.ಜಿ', nameEn: 'Aluminium Measure 1kg', category: 'ಅಲ್ಯೂಮಿನಿಯಂ / Aluminium', unit: 'kg', price: 628, gstRate: 5, active: true },
  { id: 'p36', nameKn: 'ಅಲ್ಯೂಮಿನಿಯಂ ಬಾಲ್ಡಿ ಸಣ್ಣದು – 800 ಗ್ರಂ ತೂಕ', nameEn: 'Aluminium Bucket Small', category: 'ಅಲ್ಯೂಮಿನಿಯಂ / Aluminium', unit: 'kg', price: 665, gstRate: 5, active: true },
  { id: 'p37', nameKn: 'ಅಲ್ಯೂಮಿನಿಯಂ ಬಾಲ್ಡಿ ದೊಡ್ಡದು – 1.030 ಗ್ರಂ', nameEn: 'Aluminium Bucket Large', category: 'ಅಲ್ಯೂಮಿನಿಯಂ / Aluminium', unit: 'kg', price: 665, gstRate: 5, active: true },
  { id: 'p38', nameKn: 'ಅಲ್ಯೂಮಿನಿಯಂ ಬಾಲ್ಡಿ ಸ್ಣಾನದ ಸಣ್ಣದು (10ಪೀಸ್)', nameEn: 'Aluminium Bath Bucket 10pc', category: 'ಅಲ್ಯೂಮಿನಿಯಂ / Aluminium', unit: 'grams', price: 633, gstRate: 5, active: true },

  // ── CATEGORY 6: ಪ್ಲಾಸ್ಟಿಕ್ / Plastic Goods ──
  { id: 'p39', nameKn: 'ಪ್ಲಾಸ್ಟಿಕ್ ಬಕೆಟ್ ಪ್ರಥಮ ದರ್ಜೆ – 9 ಲೀಟರ್', nameEn: 'Plastic Bucket Grade1 9L', category: 'ಪ್ಲಾಸ್ಟಿಕ್ / Plastic Goods', unit: 'piece', price: 140, gstRate: 5, active: true },
  { id: 'p40', nameKn: 'ಪ್ಲಾಸ್ಟಿಕ್ ಮಗ್ಗು (ಸಣ್ಣದು) – 1ಲೀ', nameEn: 'Plastic Mug Small 1L', category: 'ಪ್ಲಾಸ್ಟಿಕ್ / Plastic Goods', unit: 'piece', price: 30, gstRate: 5, active: true },
  { id: 'p41', nameKn: 'ಪ್ಲಾಸ್ಟಿಕ್ ಟಬ್ಬು ದೊಡ್ಡದು – ಪ್ರಥಮ ದರ್ಜೆ 10ಲೀ', nameEn: 'Plastic Tub Large 10L', category: 'ಪ್ಲಾಸ್ಟಿಕ್ / Plastic Goods', unit: 'piece', price: 310, gstRate: 5, active: true },
  { id: 'p42', nameKn: 'ಪ್ಲಾಸ್ಟಿಕ್ ಟಬ್ಬು ಸಣ್ಣದು – ಪ್ರಥಮ ದರ್ಜೆ 5ಲೀ', nameEn: 'Plastic Tub Small 5L', category: 'ಪ್ಲಾಸ್ಟಿಕ್ / Plastic Goods', unit: 'piece', price: 170, gstRate: 5, active: true },
  { id: 'p43', nameKn: 'ಪ್ಲಾಸ್ಟಿಕ್ ಕ್ಕಿ ಬ್ರಶ್', nameEn: 'Plastic Key Brush', category: 'ಪ್ಲಾಸ್ಟಿಕ್ / Plastic Goods', unit: 'piece', price: 180, gstRate: 5, active: true },
  { id: 'p44', nameKn: 'ಪ್ಲಾಸ್ಟಿಕ್ ಡಸ್ಟ್ ಪ್ಯಾನ್', nameEn: 'Plastic Dust Pan', category: 'ಪ್ಲಾಸ್ಟಿಕ್ / Plastic Goods', unit: 'piece', price: 120, gstRate: 5, active: true },
  { id: 'p45', nameKn: 'ಹುಲ್ಲಿನ ಹಿಡಿಸೂಡಿ', nameEn: 'Grass Broom', category: 'ಪ್ಲಾಸ್ಟಿಕ್ / Plastic Goods', unit: 'piece', price: 35, gstRate: 5, active: true },

  // ── CATEGORY 7: ಬ್ರಶ್ & ಸ್ವಚ್ಛತೆ / Brushes & Cleaning ──
  { id: 'p46', nameKn: 'ಲ್ಯಾಟಿನ್ ಬ್ರಶ್', nameEn: 'Latin Brush', category: 'ಬ್ರಶ್ & ಸ್ವಚ್ಛತೆ / Brushes & Cleaning', unit: 'piece', price: 150, gstRate: 5, active: true },
  { id: 'p47', nameKn: 'ಲ್ಯಾಟಿನ್ ಬ್ರಶ್ ಪ್ಲಾಸ್ಟಿಕ್ ಹಿಡಿ', nameEn: 'Latin Brush Plastic Handle', category: 'ಬ್ರಶ್ & ಸ್ವಚ್ಛತೆ / Brushes & Cleaning', unit: 'piece', price: 140, gstRate: 5, active: true },
  { id: 'p48', nameKn: 'ವಾಷ್ ಬೇಸಿನ್ ಬ್ರಶ್ ಪ್ಲಾಸ್ಟಿಕ್ ಹಿಡಿ', nameEn: 'Washbasin Brush Plastic', category: 'ಬ್ರಶ್ & ಸ್ವಚ್ಛತೆ / Brushes & Cleaning', unit: 'piece', price: 65, gstRate: 5, active: true },
  { id: 'p49', nameKn: 'ಮರದ ಬ್ರಶ್ (ತಾಳಚಿಮ ಬುಶ್)', nameEn: 'Wooden Brush Talachima', category: 'ಬ್ರಶ್ & ಸ್ವಚ್ಛತೆ / Brushes & Cleaning', unit: 'piece', price: 150, gstRate: 5, active: true },
  { id: 'p50', nameKn: 'ಮರದ ಹಿಡಿಯ ತೆಂಗಿನನಾರಿನ ಬ್ರಶ್ – ದೊಡ್ಡದು', nameEn: 'Coir Brush Wooden L', category: 'ಬ್ರಶ್ & ಸ್ವಚ್ಛತೆ / Brushes & Cleaning', unit: 'piece', price: 150, gstRate: 5, active: true },
  { id: 'p51', nameKn: 'ಮರದ ಹಿಡಿಯ ತೆಂಗಿನನಾರಿನ ಬ್ರಶ್ – ಸಣ್ಣದು', nameEn: 'Coir Brush Wooden S', category: 'ಬ್ರಶ್ & ಸ್ವಚ್ಛತೆ / Brushes & Cleaning', unit: 'piece', price: 140, gstRate: 5, active: true },
  { id: 'p52', nameKn: 'ಮರದ ಹಿಡಿಯ ನೆಲೊಲುಜ್ಜುವ ಬ್ರಶ್', nameEn: 'Floor Scrub Brush Wooden', category: 'ಬ್ರಶ್ & ಸ್ವಚ್ಛತೆ / Brushes & Cleaning', unit: 'piece', price: 140, gstRate: 5, active: true },

  // ── CATEGORY 8: ಕಬ್ಬಿಣ / Iron Products ──
  { id: 'p53', nameKn: 'ಕಬ್ಬಿಣದ ಬಾಣಲೆ ಸಣ್ಣದು – 1½ ಫೀಟ್', nameEn: 'Iron Pan Small 1.5ft', category: 'ಕಬ್ಬಿಣ / Iron Products', unit: 'kg', price: 1900, gstRate: 5, active: true },
  { id: 'p54', nameKn: 'ಕಬ್ಬಿಣದ ಬಾಣಲೆ ದೊಡ್ಡದು – 2ಫೀಟ್', nameEn: 'Iron Pan Large 2ft', category: 'ಕಬ್ಬಿಣ / Iron Products', unit: 'kg', price: 2250, gstRate: 5, active: true },
  { id: 'p55', nameKn: 'ಕಬ್ಬಿಣದ ಸಟ್ಟುಗ – 6ಫೀಟ್', nameEn: 'Iron Ladle 6ft', category: 'ಕಬ್ಬಿಣ / Iron Products', unit: 'piece', price: 0, gstRate: 5, active: true },
  { id: 'p56', nameKn: 'ಮರದ ಹಿಡಿಯ ಸ್ಟೀಲ್ ಶವಲ್', nameEn: 'Steel Shovel Wooden Handle', category: 'ಕಬ್ಬಿಣ / Iron Products', unit: 'piece', price: 3850, gstRate: 5, active: true },
  { id: 'p57', nameKn: '1 ಕಳಸೆ ಹೆಡಿಗೆ', nameEn: '1 Kalase Hedige', category: 'ಕಬ್ಬಿಣ / Iron Products', unit: 'piece', price: 430, gstRate: 5, active: true },
  { id: 'p58', nameKn: '2 ಕಳಸೆ ಹೆಡಿಗೆ', nameEn: '2 Kalase Hedige', category: 'ಕಬ್ಬಿಣ / Iron Products', unit: 'piece', price: 670, gstRate: 5, active: true },

  // ── CATEGORY 9: ವಿವಿಧ / Miscellaneous ──
  { id: 'p59', nameKn: 'ಡಸ್ಟ್ ಬಿನ್', nameEn: 'Dust Bin', category: 'ವಿವಿಧ / Miscellaneous', unit: 'piece', price: 160, gstRate: 5, active: true },
  { id: 'p60', nameKn: 'ವೇಪರ್ (ಇನ್ನೋವಾ)', nameEn: 'Vapour Innova', category: 'ವಿವಿಧ / Miscellaneous', unit: 'piece', price: 250, gstRate: 5, active: true },
  { id: 'p61', nameKn: 'ಸಚಿತೂರ್ ಹ್ಯಾಂಡ್ ವಾಶ್ – 200 ಎಂ.ಎಲ್', nameEn: 'Sachitoor Handwash 200ml', category: 'ವಿವಿಧ / Miscellaneous', unit: 'piece', price: 90, gstRate: 5, active: true },
  { id: 'p62', nameKn: 'ಮೋಪ್ (ಎಸ್ ಎಲ್ ಎಂ)', nameEn: 'Mop SLM', category: 'ವಿವಿಧ / Miscellaneous', unit: 'piece', price: 142, gstRate: 5, active: true },
  { id: 'p63', nameKn: 'ಬಲೆ ತೆಗೆಯುವ ಕೋಲು', nameEn: 'Web Removal Stick', category: 'ವಿವಿಧ / Miscellaneous', unit: 'piece', price: 150, gstRate: 5, active: true },
  { id: 'p64', nameKn: 'ಟಿಶ್ಯು ಪೇಪರ್', nameEn: 'Tissue Paper', category: 'ವಿವಿಧ / Miscellaneous', unit: 'packet', price: 60, gstRate: 5, active: true },
  { id: 'p65', nameKn: 'ಹಿಟ್ ಸ್ಪ್ರೇ', nameEn: 'Hit Spray', category: 'ವಿವಿಧ / Miscellaneous', unit: 'piece', price: 380, gstRate: 5, active: true },
  { id: 'p66', nameKn: 'ನ್ಯಾಪ್ಲೀನ್ ಗೋಲಿ', nameEn: 'Naphthalene Balls', category: 'ವಿವಿಧ / Miscellaneous', unit: 'packet', price: 190, gstRate: 5, active: true },
  { id: 'p67', nameKn: 'ಒಡೋನಿಲ್', nameEn: 'Odonil', category: 'ವಿವಿಧ / Miscellaneous', unit: 'packet', price: 0, gstRate: 5, active: true },
  { id: 'p68', nameKn: 'ರೂಂ ಫ್ರೆಶ್ನರ್', nameEn: 'Room Freshener', category: 'ವಿವಿಧ / Miscellaneous', unit: 'piece', price: 190, gstRate: 5, active: true },
];
