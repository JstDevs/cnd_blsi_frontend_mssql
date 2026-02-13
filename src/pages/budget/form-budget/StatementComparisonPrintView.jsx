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
  let lguValue = "LGU"
  let yearValue = "MMMM dd, yyyy"

  data.forEach((row) => {
    totals.Original += Number(row.Original) || 0;
    totals.Final += Number(row.Final) || 0;
    totals.Difference += Number(row.Difference) || 0;
    totals.Actual += Number(row.Actual) || 0;
    totals.Difference2 += Number(row.Difference2) || 0;

    // toast.success("THE THING IS A " + row.Period);

  });
  yearValue = data?.[0]?.Period
  lguValue = data?.[0]?.Municipality

  return (
    <div ref={ref} className="p-6 text-black text-[9px]">
      <h2 className="text-center">
        Municipality of {lguValue}
      </h2>
      <h3 className="text-center font-bold">
        Statement of Comparison of Budget and Actual Amounts
      </h3>
      <p className="text-center mb-4">
        For the Year Ended {yearValue}
      </p>

      {/* <table className="w-full border-collapse border text-xs"> */}
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-[9px] w-[24%]">Particular       </th>
            <th className="text-[9px] w-[16%] text-right">Notes </th>
            <th className="text-[9px] w-[12%]">Original Budget  </th>
            <th className="text-[9px] w-[12%]">Final Budget     </th>
            <th className="text-[9px] w-[12%]">Budget Difference</th>
            <th className="text-[9px] w-[12%]">Actual Amounts   </th>
            <th className="text-[9px] w-[12%]">Final Difference </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            // if NOT data?.[idx]?.Type = data?.[idx]?.Type THEN display row.Type on specified place ELSE PASS


            // this is the specified place
            // <tr>
            //   <td>
            //      {row.Type}
            //   </td>
            // </tr>

            <tr key={idx}>
              <td className="text-[9px] leading-tight">
                {/* {row.Type} - {row.Subtype} - {row.Category} - {row.ChartOfAccounts}  */}
                {row.ChartOfAccounts}
              </td>
              <td className="text-[9px]">

              </td>
              <td className="text-[9px] text-right">
                {Number(row.Original || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </td>
              <td className="text-[9px] text-right">
                {Number(row.Final || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </td>
              <td className="text-[9px] text-right">
                {Number(row.Difference || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </td>
              <td className="text-[9px] text-right">
                {Number(row.Actual || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </td>
              <td className="text-[9px] text-right">
                {Number(row.Difference2 || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}

          {/* Blank Space */}
          <tr>
            <td className="border border-white p-1"></td>
            <td className="border border-white p-1"></td>
            <td className="border border-white p-1"></td>
            <td className="border border-white p-1"></td>
            <td className="border border-white p-1"></td>
            <td className="border border-white p-1"></td>
            <td className="border border-white p-1"></td>
          </tr>

          {/* Totals */}
          <tr className="font-bold">
            <td className="text-[9px] text-left" colSpan={2}>
              Total Appropriations
            </td>
            <td className="text-[9px] text-right">
              {totals.Original.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </td>
            <td className="text-[9px] text-right">
              {totals.Final.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </td>
            <td className="text-[9px] text-right">
              {totals.Difference.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </td>
            <td className="text-[9px] text-right">
              {totals.Actual.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </td>
            <td className="text-[9px] text-right">
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
