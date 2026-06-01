/**
 * @fileoverview Utility module for csv
 * Implements functionality related to the D-EAN platform's core logic layer.
 */
export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const friendlyHeaders = headers.map(h => h.toUpperCase().replace(/_/g, ' '));
  const rows = data.map(row => headers.map(header => {
    const val = row[header];
    if (val instanceof Date) return val.toISOString();
    return val;
  }));
  
  const csv = generateCSV(friendlyHeaders, rows);
  downloadCSV(csv, filename);
};

export const generateCSV = (headers: string[], rows: any[][]) => {
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of rows) {
    const values = row.map(val => {
      const escaped = ('' + (val ?? '')).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
