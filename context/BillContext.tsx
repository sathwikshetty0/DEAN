'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Bill, BillItem, Consignee, Buyer } from '@/lib/types';
import { getSettings } from '@/lib/storage';

type BillState = Omit<Bill, 'id' | 'billNo' | 'createdAt'>;

type BillAction =
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'kn' | 'both' }
  | { type: 'SET_GST_ENABLED'; payload: boolean }
  | { type: 'UPDATE_CONSIGNEE'; payload: Partial<Consignee> }
  | { type: 'UPDATE_BUYER'; payload: Partial<Buyer> }
  | { type: 'ADD_ITEM'; payload: BillItem }
  | { type: 'UPDATE_ITEM'; payload: { id: string; item: Partial<BillItem> } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'SET_DISCOUNT'; payload: { type: 'flat' | 'percentage'; value: number } }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_REFERENCES'; payload: { supplierRef?: string; otherReference?: string } }
  | { type: 'SET_DATE'; payload: string }
  | { type: 'RESET_BILL'; payload?: Partial<BillState> };

interface BillContextType {
  state: BillState;
  dispatch: React.Dispatch<BillAction>;
  calculateTotals: () => { subtotal: number; cgst: number; sgst: number; discount: number; grandTotal: number };
}

// Default consignee: Katil Temple
const defaultConsignee: Consignee = {
  name: 'ಶ್ರೀ ದುರ್ಗಾನಾರಾಯಣೇಶ್ವರಿ ದೇವಸ್ಥಾನ ಕೂಟೇಲು',
  address: 'ಕೇರಳ ಅಂಚೆ, ಮಂಗಲ್, ಕಾಸರಗೋಡ',
  city: '',
  pincode: '574148',
  gstin: '',
  buyerOrderNo: '',
  dated: new Date().toISOString().split('T')[0],
  dispatchDocNo: '',
  deliveryNoteDate: '',
  dispatchedThrough: '',
  destination: '',
  termsOfDelivery: '',
};

const defaultBuyer: Buyer = {
  name: '',
  address: '',
};

const initialState: BillState = {
  date: new Date().toISOString().split('T')[0],
  consignee: defaultConsignee,
  buyer: defaultBuyer,
  items: [],
  subtotal: 0,
  cgst: 0,
  sgst: 0,
  discount: 0,
  discountType: 'flat',
  discountValue: 0,
  grandTotal: 0,
  notes: '',
  lang: 'kn',
  gstEnabled: true,
  draft: true,
  supplierRef: '',
  otherReference: '',
};

function billReducer(state: BillState, action: BillAction): BillState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, lang: action.payload };
    case 'SET_GST_ENABLED':
      return { ...state, gstEnabled: action.payload };
    case 'UPDATE_CONSIGNEE':
      return { ...state, consignee: { ...state.consignee, ...action.payload } };
    case 'UPDATE_BUYER':
      return { ...state, buyer: { ...state.buyer, ...action.payload } };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id !== action.payload.id) return item;
          const updated = { ...item, ...action.payload.item };
          updated.amount = updated.quantity * updated.rate;
          return updated;
        })
      };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'SET_DISCOUNT':
      return { ...state, discountType: action.payload.type, discountValue: action.payload.value };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'SET_REFERENCES':
      return { ...state, ...action.payload };
    case 'SET_DATE':
      return { ...state, date: action.payload };
    case 'RESET_BILL':
      return { ...initialState, ...action.payload, date: new Date().toISOString().split('T')[0] };
    default:
      return state;
  }
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export function BillProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(billReducer, initialState);

  useEffect(() => {
    const settings = getSettings();
    if (state.items.length === 0) {
      dispatch({ type: 'SET_GST_ENABLED', payload: settings.gstOnByDefault });
    }
  }, []);

  const calculateTotals = () => {
    let subtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;

    state.items.forEach(item => {
      subtotal += item.amount;
      if (state.gstEnabled && item.gstRate > 0) {
        const taxAmount = item.amount * (item.gstRate / 100);
        totalCgst += taxAmount / 2;
        totalSgst += taxAmount / 2;
      }
    });

    let discount = 0;
    if (state.discountType === 'flat') {
      discount = state.discountValue;
    } else {
      discount = subtotal * (state.discountValue / 100);
    }

    const grandTotal = subtotal + totalCgst + totalSgst - discount;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      cgst: Math.round(totalCgst * 100) / 100,
      sgst: Math.round(totalSgst * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      grandTotal: Math.round(grandTotal * 100) / 100,
    };
  };

  return (
    <BillContext.Provider value={{ state, dispatch, calculateTotals }}>
      {children}
    </BillContext.Provider>
  );
}

export function useBill() {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error('useBill must be used within a BillProvider');
  }
  return context;
}
