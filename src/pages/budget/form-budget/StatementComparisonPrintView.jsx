// components/print/StatementComparisonPrintView.jsx
import React, { forwardRef } from 'react';

const StatementComparisonPrintView = forwardRef(({ data, fiscalYear }, ref) => {
  // Calculate totals
  const totals = {
    Original: 0,
    Final: 0,
    Difference: 0,
    Actual: 0,
    Difference2: 0,
  };

  data.forEach((row) => {
    totals.Original += row.Original || 0;
    totals.Final += row.Final || 0;
    totals.Difference += row.Difference || 0;
    totals.Actual += row.Actual || 0;
    totals.Difference2 += row['Difference 2'] || 0;
  });

  return (
    <div ref={ref} className="p-6 text-black text-sm">
      <h2 className="text-center font-bold">Municipality of __________</h2>
      <h3 className="text-center">
        Statement of Comparison of Budget and Actual Amounts
      </h3>
      <p className="text-center mb-4">For the Year Ended {fiscalYear?.Name}</p>

      <table className="w-full border-collapse border text-xs">
        <thead>
          <tr>
            <th className="border p-2">Particular</th>
            <th className="border p-2">Notes</th>
            <th className="border p-2">Budget Amounts - Original</th>
            <th className="border p-2">Budget Amounts - Final</th>
            <th className="border p-2">Difference (Original vs Final)</th>
            <th className="border p-2">Actual Amounts</th>
            <th className="border p-2">Difference (Final vs Actual)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td className="border p-2">{row.Category}</td>
              <td className="border p-2">{row.Subtype}</td>
              <td className="border p-2 text-right">
                {row.Original?.toLocaleString('en-PH')}
              </td>
              <td className="border p-2 text-right">
                {row.Final?.toLocaleString('en-PH')}
              </td>
              <td className="border p-2 text-right">
                {row.Difference?.toLocaleString('en-PH')}
              </td>
              <td className="border p-2 text-right">
                {row.Actual?.toLocaleString('en-PH')}
              </td>
              <td className="border p-2 text-right">
                {row['Difference 2']?.toLocaleString('en-PH')}
              </td>
            </tr>
          ))}

          {/* Totals */}
          <tr className="font-bold">
            <td className="border p-2 text-right" colSpan={2}>
              Total Appropriations
            </td>
            <td className="border p-2 text-right">
              {totals.Original.toLocaleString('en-PH')}
            </td>
            <td className="border p-2 text-right">
              {totals.Final.toLocaleString('en-PH')}
            </td>
            <td className="border p-2 text-right">
              {totals.Difference.toLocaleString('en-PH')}
            </td>
            <td className="border p-2 text-right">
              {totals.Actual.toLocaleString('en-PH')}
            </td>
            <td className="border p-2 text-right">
              {totals.Difference2.toLocaleString('en-PH')}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

StatementComparisonPrintView.displayName = 'StatementComparisonPrintView';
export default StatementComparisonPrintView;
