// ──────────────────────────────────────────
// N. Shetty & Co. — Core Type Definitions
// ──────────────────────────────────────────

export interface Product {
  id: string;
  nameKn: string;
  nameEn: string;
  category: string;
  unit: 'piece' | 'kg' | 'grams' | 'packet' | 'bundle' | 'set' | 'dozen';
  price: number;
  gstRate: number;
  active: boolean;
}

export interface BillItem {
  id: string;
  serialNo: number;
  productId: string | null; // null for custom items
  nameKn: string;
  nameEn: string;
  gstRate: number;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  isCustom: boolean;
}

export interface Consignee {
  name: string;
  address: string;
  city: string;
  pincode: string;
  gstin: string;
  buyerOrderNo: string;
  dated: string;
  dispatchDocNo: string;
  deliveryNoteDate: string;
  dispatchedThrough: string;
  destination: string;
  termsOfDelivery: string;
}

export interface Buyer {
  name: string;
  address: string;
}

export interface Bill {
  id: string;
  billNo: number;
  date: string;
  consignee: Consignee;
  buyer: Buyer;
  items: BillItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  discount: number;
  discountType: 'flat' | 'percentage';
  discountValue: number;
  grandTotal: number;
  notes: string;
  lang: 'en' | 'kn' | 'both';
  gstEnabled: boolean;
  draft: boolean;
  createdAt: string;
  supplierRef: string;
  otherReference: string;
}

export interface ShopSettings {
  shopNameEn: string;
  shopNameKn: string;
  addressLine1: string;
  addressLine2: string;
  phone1: string;
  phone2: string;
  gstin: string;
  email: string;
  altEmail: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  branch: string;
  declaration: string;
  pan: string;
  logoBase64: string;
  signatureBase64: string;
  defaultLanguage: 'en' | 'kn' | 'both';
  gstOnByDefault: boolean;
  defaultGstRate: number;
  showHsnTable: boolean;
  showBankDetails: boolean;
  showDeclaration: boolean;
  billNumberPrefix: string;
  paperSize: 'A4' | 'A5';
}

export type Language = 'en' | 'kn' | 'both';

export interface GSTSummaryRow {
  hsnSac: string;
  taxableValue: number;
  centralTaxRate: number;
  centralTaxAmount: number;
  stateTaxRate: number;
  stateTaxAmount: number;
  totalTaxAmount: number;
}
