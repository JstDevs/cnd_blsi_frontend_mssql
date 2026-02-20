// CashbookPrintView.jsx
import React, { forwardRef } from 'react';

const CashbookPrintView = forwardRef(({ data }, ref) => {
  // Extract metadata from the first row if available
  const firstRow = data && data.length > 0 ? data[0] : {};
  const year = firstRow.Year || new Date().getFullYear();
  const officer = firstRow.Officer || '_____________';
  const fund = firstRow.Fund || 'All Funds';

  // Calculate Totals
  const totalDebit = data.reduce((sum, row) => sum + (Number(row.Debit) || 0), 0);
  const totalCredit = data.reduce((sum, row) => sum + (Number(row.Credit) || 0), 0);
  // For standard cashbook, the last row's running balance represents the current cash on hand.
  const endingBalance = data.length > 0 ? data[data.length - 1].Balance : 0;

  // Format currency helper
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '';
    return Number(amount).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Safe Date formatting
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  // Determine filler rows
  // Standard A4/Letter page can fit ~25-30 rows depending on font size.
  // We want to force at least 25 rows to look like a full page form.
  const MIN_ROWS = 25;
  const fillerCount = Math.max(0, MIN_ROWS - data.length);

  return (
    <div
      ref={ref}
      className="p-8 w-full text-black bg-white"
      style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}
    >
      {/* Top Right Label */}
      <div className="text-right italic mb-4">Appendix 25</div>

      {/* Main Title */}
      <div className="text-center mb-1">
        <h1 className="text-xl font-bold uppercase underline">CASHBOOK</h1>
      </div>

      {/* Year */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold">{year}</h2>
      </div>

      {/* Metadata Row */}
      <div className="flex justify-between mb-4 font-bold">
        <div>
          <span>Disbursing Officer: </span>
          <span className="underline decoration-1">{officer}</span>
        </div>
        <div>
          <span>Fund: </span>
          <span className="underline decoration-1">{fund}</span>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-black">
        <thead>
          {/* First Header Row */}
          <tr>
            <th
              className="border border-black px-2 py-1 align-middle"
              rowSpan="2"
              style={{ width: '10%' }}
            >
              Date
            </th>
            <th
              className="border border-black px-2 py-1 align-middle"
              rowSpan="2"
            >
              Particulars
            </th>
            <th
              className="border border-black px-2 py-1 align-middle"
              rowSpan="2"
              style={{ width: '15%' }}
            >
              Reference
            </th>
            <th
              className="border border-black px-2 py-1 text-center"
              colSpan="3"
            >
              CASH IN BANK
            </th>
          </tr>
          {/* Second Header Row */}
          <tr>
            <th className="border border-black px-2 py-1 text-center" style={{ width: '12%' }}>
              Debit
            </th>
            <th className="border border-black px-2 py-1 text-center" style={{ width: '12%' }}>
              Credit
            </th>
            <th className="border border-black px-2 py-1 text-center" style={{ width: '12%' }}>
              Balance
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Render actual data rows */}
          {data.map((row, i) => (
            <tr key={i}>
              <td className="border border-black px-2 py-1 text-center">
                {formatDate(row.InvoiceDate)}
              </td>
              <td className="border border-black px-2 py-1">
                {row.APAR || ''}
              </td>
              <td className="border border-black px-2 py-1 text-center">
                {row.InvoiceNumber || ''}
              </td>
              <td className="border border-black px-2 py-1 text-right">
                {formatCurrency(row.Debit)}
              </td>
              <td className="border border-black px-2 py-1 text-right">
                {formatCurrency(row.Credit)}
              </td>
              <td className="border border-black px-2 py-1 text-right">
                {formatCurrency(row.Balance)}
              </td>
            </tr>
          ))}

          {/* Render filler rows to mimic the manual form - ENSURE BORDERS */}
          {Array.from({ length: fillerCount }).map((_, i) => (
            <tr key={`filler-${i}`}>
              <td className="border border-black px-2 py-1 h-6">&nbsp;</td>
              <td className="border border-black px-2 py-1 h-6">&nbsp;</td>
              <td className="border border-black px-2 py-1 h-6">&nbsp;</td>
              <td className="border border-black px-2 py-1 h-6">&nbsp;</td>
              <td className="border border-black px-2 py-1 h-6">&nbsp;</td>
              <td className="border border-black px-2 py-1 h-6">&nbsp;</td>
            </tr>
          ))}

          {/* Totals Row */}
          <tr className="font-bold">
            <td className="border border-black px-2 py-1"></td>
            <td className="border border-black px-2 py-1"></td>
            <td className="border border-black px-2 py-1 text-center">TOTALS</td>
            <td className="border border-black px-2 py-1 text-right">
              {formatCurrency(totalDebit)}
            </td>
            <td className="border border-black px-2 py-1 text-right">
              {formatCurrency(totalCredit)}
            </td>
            <td className="border border-black px-2 py-1 text-right">
              {formatCurrency(endingBalance)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

CashbookPrintView.displayName = 'CashbookPrintView';
export default CashbookPrintView;
