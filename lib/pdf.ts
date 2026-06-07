import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { InvoiceDocument } from '@/components/pdf/InvoiceDocument';
import { Bill, ShopSettings } from '@/lib/types';

export const generatePdfBlob = async (bill: Bill, settings: ShopSettings): Promise<Blob> => {
  const document = React.createElement(InvoiceDocument, { bill, settings });
  const asPdf = pdf(document);
  return await asPdf.toBlob();
};

export const downloadPdf = async (bill: Bill, settings: ShopSettings) => {
  const blob = await generatePdfBlob(bill, settings);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice_${bill.billNo}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
