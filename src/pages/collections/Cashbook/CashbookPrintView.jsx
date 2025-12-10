// CashbookPrintView.jsx
import React, { forwardRef } from 'react';

const CashbookPrintView = forwardRef(({ data }, ref) => {
  //   if (!data || data.length === 0) return null;

  return (
    <div
      ref={ref}
      className="p-8 w-full text-black"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">Cashbook Report</h2>
        <p>
          {data?.StartDate} - {data?.EndDate}
        </p>
        <p>Fund: {data?.FundName || 'All Funds'}</p>
      </div>

      {/* Table */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-1">Year</th>
            <th className="text-left py-1">Officer</th>
            <th className="text-left py-1">Fund</th>
            <th className="text-left py-1">Invoice Date</th>
            <th className="text-left py-1">AP AR</th>
            <th className="text-left py-1">Invoice Number</th>
            <th className="text-right py-1">Debit</th>
            <th className="text-right py-1">Credit</th>
            <th className="text-right py-1">Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b">
              <td className="py-1">{row.Year || '-'}</td>
              <td className="py-1">{row.Officer || '-'}</td>
              <td className="py-1">{row.Fund || '-'}</td>
              <td className="py-1">
                {row.InvoiceDate
                  ? new Date(row.InvoiceDate).toLocaleDateString()
                  : '-'}
              </td>
              <td className="py-1">{row.APAR || '-'}</td>
              <td className="py-1">{row.InvoiceNumber || '-'}</td>
              <td className="py-1 text-right">
                {row.Debit?.toLocaleString('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                }) || '₱0.00'}
              </td>
              <td className="py-1 text-right">
                {row.Credit?.toLocaleString('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                }) || '₱0.00'}
              </td>
              <td className="py-1 text-right">
                {row.Balance?.toLocaleString('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                }) || '₱0.00'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mt-6 text-right font-bold">
        Total Balance:{' '}
        {data[data.length - 1]?.Balance?.toLocaleString('en-PH', {
          style: 'currency',
          currency: 'PHP',
        }) || '₱0.00'}
      </div>
    </div>
  );
});

CashbookPrintView.displayName = 'CashbookPrintView';
export default CashbookPrintView;
