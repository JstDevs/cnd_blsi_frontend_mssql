// components/print/StatementComparisonPrintView.jsx
import React, { forwardRef } from 'react';
import toast from 'react-hot-toast';

const StatementComparisonPrintView = forwardRef(({ data, fiscalYear }, ref) => {
  // Calculate totals
  const totals = {
    Original: 0,
    Final: 0,
    Difference: 0,
    Actual: 0,
    Difference2: 0,
  };
  const lguValue = "LGU"
  const yearValue = "MMMM dd, yyyy"

  data.forEach((row) => {
    totals.Original += Number(row.Original) || 0;
    totals.Final += Number(row.Final) || 0;
    totals.Difference += Number(row.Difference) || 0;
    totals.Actual += Number(row.Actual) || 0;
    totals.Difference2 += Number(row.Difference2) || 0;

    // lgu = row.Municipality

    toast.success("THE THING IS A " + row.Actual)

  });

  // toast.success(data[0].Actual[0])

  return (
    <div ref={ref} className="p-6 text-black text-sm">
      <h2 className="text-center">
        Municipality of {lguValue}
      </h2>
      <h3 className="text-center font-bold">
        Statement of Comparison of Budget and Actual Amounts
      </h3>
      <p className="text-center mb-4">
        For the Year Ended [{fiscalYear?.Name} - {yearValue}]
      </p>

      {/* <table className="w-full border-collapse border text-xs"> */}
      <table className="w-full text-xs border-collapse border border-white">
        <thead>
          <tr>
            <th className="border border-white p-0.5">Particular       </th>
            <th className="border border-white p-0.5">Notes            </th>
            <th className="border border-white p-0.5">Original Budget  </th>
            <th className="border border-white p-0.5">Final Budget     </th>
            <th className="border border-white p-0.5">Difference       </th>
            <th className="border border-white p-0.5">Actual Amounts   </th>
            <th className="border border-white p-0.5">Difference       </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td className="border border-white p-0.5">{row.ChartOfAccounts}</td>
              <td className="border border-white p-0.5"> </td>
              <td className="border border-white p-0.5 text-right">
                {Number(row.Original || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </td>
              <td className="border border-white p-0.5 text-right">
                {Number(row.Final || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </td>
              <td className="border border-white p-0.5 text-right">
                {Number(row.Difference || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </td>
              <td className="border border-white p-0.5 text-right">
                {Number(row.Actual || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </td>
              <td className="border border-white p-0.5 text-right">
                {Number(row.Difference2 || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}

          {/* Totals */}
          <tr className="font-bold">
            <td className="border border-white p-0.5 text-right" colSpan={2}>
              Total Appropriationersssss
            </td>
            <td className="border border-white p-0.5 text-right">
              {totals.Original.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </td>
            <td className="border border-white p-0.5 text-right">
              {totals.Final.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </td>
            <td className="border border-white p-0.5 text-right">
              {totals.Difference.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </td>
            <td className="border border-white p-0.5 text-right">
              {totals.Actual.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </td>
            <td className="border border-white p-0.5 text-right">
              {totals.Difference2.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

StatementComparisonPrintView.displayName = 'StatementComparisonPrintView';
export default StatementComparisonPrintView;
