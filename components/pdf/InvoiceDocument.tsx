import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Bill, ShopSettings, GSTSummaryRow } from '@/lib/types';
import { amountToWords } from '@/lib/numberToWords';
import '@/lib/pdfFonts';

const s = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Noto Sans Kannada',
    fontSize: 9,
    fontStyle: 'normal',
    color: '#000',
  },
  // ── Outer border
  border: {
    border: '1.5pt solid #000',
    padding: 0,
  },
  // ── Header
  headerArea: {
    padding: 8,
    paddingBottom: 4,
    borderBottom: '1pt solid #000',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shopName: { fontSize: 16, fontWeight: 'bold' },
  shopAddr: { fontSize: 9, marginTop: 2 },
  shopPhone: { fontSize: 9 },
  pageBox: {
    border: '1pt solid #000',
    padding: '6 12',
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // ── Two-col grid row
  gridRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
  },
  gridLeft: {
    width: '50%',
    borderRight: '1pt solid #000',
    padding: 6,
  },
  gridRight: {
    width: '50%',
    padding: 6,
  },
  labelBold: { fontWeight: 'bold', fontSize: 9 },
  label: { fontSize: 8, color: '#333' },
  value: { fontSize: 9, fontWeight: 'bold' },
  // ── Small two-col row inside right half
  miniRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #999',
    minHeight: 18,
  },
  miniLeft: {
    width: '50%',
    borderRight: '0.5pt solid #999',
    padding: '3 4',
    fontSize: 8,
  },
  miniRight: {
    width: '50%',
    padding: '3 4',
    fontSize: 8,
  },
  // ── Items table
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    backgroundColor: '#f5f5f5',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #ccc',
    minHeight: 22,
  },
  // Column widths
  cSl: { width: '6%', textAlign: 'center', padding: '4 2', borderRight: '0.5pt solid #ccc' },
  cDesc: { width: '36%', padding: '4 4', borderRight: '0.5pt solid #ccc' },
  cGst: { width: '8%', textAlign: 'center', padding: '4 2', borderRight: '0.5pt solid #ccc' },
  cQty: { width: '14%', textAlign: 'center', padding: '4 2', borderRight: '0.5pt solid #ccc' },
  cRate: { width: '16%', textAlign: 'right', padding: '4 4', borderRight: '0.5pt solid #ccc' },
  cAmt: { width: '20%', textAlign: 'right', padding: '4 4' },
  thText: { fontWeight: 'bold', fontSize: 8 },
  tdText: { fontSize: 9 },
  // ── Totals
  totalsRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #ccc',
    minHeight: 18,
  },
  totalsLabel: {
    width: '80%',
    textAlign: 'right',
    padding: '3 6',
    fontWeight: 'bold',
    fontSize: 9,
  },
  totalsValue: {
    width: '20%',
    textAlign: 'right',
    padding: '3 4',
    fontWeight: 'bold',
    fontSize: 9,
  },
  grandTotalRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    borderTop: '1pt solid #000',
    minHeight: 20,
  },
  // ── Words box
  wordsBox: {
    padding: '4 6',
    borderBottom: '1pt solid #000',
  },
  // ── HSN table
  hsnHeader: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    backgroundColor: '#f5f5f5',
  },
  hsnRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #ccc',
  },
  hsnCell: {
    padding: '3 4',
    borderRight: '0.5pt solid #ccc',
    fontSize: 8,
    textAlign: 'center',
  },
  hsnCellLast: {
    padding: '3 4',
    fontSize: 8,
    textAlign: 'center',
  },
  // ── Footer
  footer: {
    flexDirection: 'row',
    minHeight: 100,
  },
  footerLeft: {
    width: '50%',
    borderRight: '1pt solid #000',
    padding: 6,
  },
  footerRight: {
    width: '50%',
    padding: 6,
    justifyContent: 'space-between',
  },
  footerLine: { fontSize: 8, marginBottom: 2 },
  signatureArea: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
});

interface Props {
  bill: Bill;
  settings: ShopSettings;
}

export function InvoiceDocument({ bill, settings }: Props) {
  // Build GST summary
  const gstSummary: GSTSummaryRow[] = React.useMemo(() => {
    const map: Record<number, GSTSummaryRow> = {};
    bill.items.forEach(item => {
      const rate = item.gstRate;
      if (rate > 0 && bill.gstEnabled) {
        if (!map[rate]) {
          map[rate] = { hsnSac: '', taxableValue: 0, centralTaxRate: rate / 2, centralTaxAmount: 0, stateTaxRate: rate / 2, stateTaxAmount: 0, totalTaxAmount: 0 };
        }
        map[rate].taxableValue += item.amount;
        const tax = item.amount * (rate / 100);
        map[rate].centralTaxAmount += tax / 2;
        map[rate].stateTaxAmount += tax / 2;
        map[rate].totalTaxAmount += tax;
      }
    });
    return Object.values(map);
  }, [bill.items, bill.gstEnabled]);

  const taxTotal = gstSummary.reduce((a, r) => a + r.totalTaxAmount, 0);

  // Pad items to fill page
  const minRows = 15;
  const emptyCount = Math.max(0, minRows - bill.items.length);
  const emptyRows = Array.from({ length: emptyCount });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.border}>

          {/* ═══ HEADER ═══ */}
          <View style={s.headerArea}>
            <View style={{ width: '75%' }}>
              <Text style={s.shopName}>{settings.shopNameKn}</Text>
              <Text style={s.shopAddr}>{settings.addressLine1}</Text>
              <Text style={s.shopAddr}>{settings.addressLine2}</Text>
              <Text style={s.shopPhone}>ಮೊಬೈಲ್ ನಂ:- {settings.phone1}, {settings.phone2}</Text>
              <Text style={s.shopPhone}>ಜಿಎಸ್ಟೈನ್: {settings.gstin}</Text>
              <Text style={s.shopPhone}>ಇ ಮೇಲ್ ಐಡಿ : {settings.email}</Text>
              {settings.altEmail && <Text style={s.shopPhone}>{settings.altEmail}</Text>}
            </View>
            <View style={{ width: '25%', alignItems: 'flex-end' }}>
              <View style={s.pageBox}>
                <Text>1 ↑0 1</Text>
              </View>
            </View>
          </View>

          {/* ═══ CONSIGNEE + REFERENCES ═══ */}
          <View style={s.gridRow}>
            <View style={s.gridLeft}>
              <Text style={{ fontWeight: 'bold', fontSize: 9, textDecoration: 'underline', marginBottom: 4 }}>CONSIGNEE:-</Text>
              <Text style={s.value}>{bill.consignee.name}</Text>
              {bill.consignee.address ? <Text style={{ fontSize: 9 }}>{bill.consignee.address}</Text> : null}
              {bill.consignee.city ? <Text style={{ fontSize: 9 }}>{bill.consignee.city} {bill.consignee.pincode ? `ಪಿನ್ - ${bill.consignee.pincode}` : ''}</Text> : null}
              {bill.consignee.gstin ? <Text style={{ fontSize: 9 }}>ಜಿಎಸ್ ಟಿ ಐಎನ್: {bill.consignee.gstin}</Text> : null}
            </View>
            <View style={s.gridRight}>
              <View style={s.miniRow}>
                <Text style={s.miniLeft}>Supplier Ref.</Text>
                <Text style={s.miniRight}>Other Reference (s)</Text>
              </View>
              <View style={s.miniRow}>
                <Text style={s.miniLeft}>Buyer&apos;s order No:</Text>
                <Text style={s.miniRight}>Dated :</Text>
              </View>
              <View style={s.miniRow}>
                <Text style={s.miniLeft}>Dispatch Document No:</Text>
                <Text style={s.miniRight}>Delivery Note Date :</Text>
              </View>
            </View>
          </View>

          {/* ═══ BUYER + DISPATCH ═══ */}
          <View style={s.gridRow}>
            <View style={s.gridLeft}>
              <Text style={{ fontWeight: 'bold', fontSize: 9, textDecoration: 'underline', marginBottom: 4 }}>BUYER (if other than consignee):-</Text>
              {bill.buyer.name ? <Text style={{ fontSize: 9 }}>{bill.buyer.name}</Text> : null}
              {bill.buyer.address ? <Text style={{ fontSize: 9 }}>{bill.buyer.address}</Text> : null}
            </View>
            <View style={s.gridRight}>
              <View style={s.miniRow}>
                <Text style={s.miniLeft}>Dispatched through :</Text>
                <Text style={s.miniRight}>Destination :</Text>
              </View>
              <View style={{ padding: '3 4' }}>
                <Text style={{ fontSize: 8 }}>Terms of Delivery :</Text>
              </View>
            </View>
          </View>

          {/* ═══ ITEMS TABLE ═══ */}
          {/* Table Header */}
          <View style={s.tableHeader}>
            <View style={s.cSl}><Text style={s.thText}>ಕ್ರಮ{'\n'}ಸಂ.</Text></View>
            <View style={s.cDesc}><Text style={s.thText}>ಸೋಪ್ತುಗಳು</Text></View>
            <View style={s.cGst}><Text style={s.thText}>GST{'\n'}RATE</Text></View>
            <View style={s.cQty}><Text style={s.thText}>QTY</Text></View>
            <View style={s.cRate}><Text style={s.thText}>RATE</Text></View>
            <View style={s.cAmt}><Text style={s.thText}>AMOUNT</Text></View>
          </View>

          {/* Data Rows */}
          {bill.items.map((item, idx) => (
            <View style={s.tableRow} key={item.id}>
              <View style={s.cSl}><Text style={s.tdText}>{idx + 1}.</Text></View>
              <View style={s.cDesc}><Text style={s.tdText}>{item.nameKn}</Text></View>
              <View style={s.cGst}><Text style={s.tdText}>{item.gstRate > 0 ? `${item.gstRate}%` : ''}</Text></View>
              <View style={s.cQty}><Text style={s.tdText}>{item.quantity} {item.unit !== 'piece' ? item.unit : ''}</Text></View>
              <View style={s.cRate}><Text style={s.tdText}>{item.rate.toFixed(2)}</Text></View>
              <View style={s.cAmt}><Text style={s.tdText}>{item.amount.toFixed(2)}</Text></View>
            </View>
          ))}

          {/* Empty rows */}
          {emptyRows.map((_, i) => (
            <View style={s.tableRow} key={`e-${i}`}>
              <View style={s.cSl}><Text> </Text></View>
              <View style={s.cDesc}><Text> </Text></View>
              <View style={s.cGst}><Text> </Text></View>
              <View style={s.cQty}><Text> </Text></View>
              <View style={s.cRate}><Text> </Text></View>
              <View style={s.cAmt}><Text> </Text></View>
            </View>
          ))}

          {/* ═══ TOTALS ═══ */}
          <View style={s.totalsRow}>
            <Text style={s.totalsLabel}>TOTAL</Text>
            <Text style={s.totalsValue}>{bill.subtotal.toFixed(2)}</Text>
          </View>
          {bill.gstEnabled && (
            <>
              <View style={s.totalsRow}>
                <Text style={s.totalsLabel}>CGST</Text>
                <Text style={s.totalsValue}>{bill.cgst.toFixed(2)}</Text>
              </View>
              <View style={s.totalsRow}>
                <Text style={s.totalsLabel}>SGST</Text>
                <Text style={s.totalsValue}>{bill.sgst.toFixed(2)}</Text>
              </View>
            </>
          )}
          {bill.discount > 0 && (
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>Discount</Text>
              <Text style={s.totalsValue}>- {bill.discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={s.grandTotalRow}>
            <Text style={[s.totalsLabel, { fontSize: 11 }]}>GRAND TOTAL</Text>
            <Text style={[s.totalsValue, { fontSize: 11 }]}>{bill.grandTotal.toFixed(2)}</Text>
          </View>

          {/* ═══ AMOUNT IN WORDS ═══ */}
          <View style={s.wordsBox}>
            <Text style={{ fontSize: 8 }}>Amount Chargeable (in words)</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 9, marginTop: 2 }}>INR {amountToWords(bill.grandTotal)}</Text>
          </View>

          {/* ═══ HSN/SAC TABLE ═══ */}
          {bill.gstEnabled && gstSummary.length > 0 && (
            <>
              <View style={s.hsnHeader}>
                <Text style={[s.hsnCell, { width: '14%', fontWeight: 'bold' }]}>HSN/SAC</Text>
                <Text style={[s.hsnCell, { width: '14%', fontWeight: 'bold' }]}>Taxable{'\n'}value</Text>
                <Text style={[s.hsnCell, { width: '18%', fontWeight: 'bold' }]}>Central Tax{'\n'}Rate    Amount</Text>
                <Text style={[s.hsnCell, { width: '18%', fontWeight: 'bold' }]}>State Tax{'\n'}Rate    Amount</Text>
                <Text style={[s.hsnCellLast, { width: '14%', fontWeight: 'bold' }]}>Total{'\n'}Tax Amount</Text>
              </View>
              {gstSummary.map((row, i) => (
                <View style={s.hsnRow} key={i}>
                  <Text style={[s.hsnCell, { width: '14%' }]}>{row.hsnSac || ''}</Text>
                  <Text style={[s.hsnCell, { width: '14%' }]}>{row.taxableValue.toFixed(2)}</Text>
                  <Text style={[s.hsnCell, { width: '18%' }]}>{row.centralTaxRate}%   {row.centralTaxAmount.toFixed(2)}</Text>
                  <Text style={[s.hsnCell, { width: '18%' }]}>{row.stateTaxRate}%   {row.stateTaxAmount.toFixed(2)}</Text>
                  <Text style={[s.hsnCellLast, { width: '14%' }]}>{row.totalTaxAmount.toFixed(2)}</Text>
                </View>
              ))}
              <View style={[s.hsnRow, { borderBottom: '1pt solid #000' }]}>
                <Text style={[s.hsnCell, { width: '14%', fontWeight: 'bold' }]}>Total</Text>
                <Text style={[s.hsnCell, { width: '14%', fontWeight: 'bold' }]}>{gstSummary.reduce((a, r) => a + r.taxableValue, 0).toFixed(2)}</Text>
                <Text style={[s.hsnCell, { width: '18%', fontWeight: 'bold' }]}>{gstSummary[0]?.centralTaxRate}%   {gstSummary.reduce((a, r) => a + r.centralTaxAmount, 0).toFixed(2)}</Text>
                <Text style={[s.hsnCell, { width: '18%', fontWeight: 'bold' }]}>{gstSummary[0]?.stateTaxRate}%   {gstSummary.reduce((a, r) => a + r.stateTaxAmount, 0).toFixed(2)}</Text>
                <Text style={[s.hsnCellLast, { width: '14%', fontWeight: 'bold' }]}>{taxTotal.toFixed(2)}</Text>
              </View>
              <View style={s.wordsBox}>
                <Text style={{ fontSize: 8 }}>Tax Amount (in words) : INR {amountToWords(Math.round(taxTotal))}</Text>
              </View>
            </>
          )}

          {/* ═══ FOOTER ═══ */}
          <View style={s.footer}>
            <View style={s.footerLeft}>
              {settings.pan && <Text style={s.footerLine}>Company&apos;s PAN : {settings.pan}</Text>}
              <Text style={s.footerLine}>Company&apos;s GSTIN : {settings.gstin}</Text>
              {bill.consignee.gstin && <Text style={s.footerLine}>Buyer&apos;s GSTIN : {bill.consignee.gstin}</Text>}
              <Text style={[s.footerLine, { fontWeight: 'bold', marginTop: 6 }]}>Declaration:</Text>
              <Text style={s.footerLine}>{settings.declaration}</Text>
            </View>
            <View style={s.footerRight}>
              <View>
                <Text style={[s.footerLine, { fontWeight: 'bold' }]}>Company&apos;s Bank Details:</Text>
                <Text style={s.footerLine}>{settings.bankName}</Text>
                <Text style={s.footerLine}>A/C NO       {settings.accountNo}</Text>
                <Text style={s.footerLine}>IFSC Code  :  {settings.ifscCode} (0 IS ZERO)</Text>
                <Text style={s.footerLine}>Branch       :  {settings.branch.toUpperCase()}</Text>
              </View>
              <View style={s.signatureArea}>
                <Text style={{ fontWeight: 'bold', fontSize: 9 }}>For {settings.shopNameKn}</Text>
                <Text style={{ fontSize: 8, marginTop: 24 }}>Proprietor</Text>
              </View>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  );
}
