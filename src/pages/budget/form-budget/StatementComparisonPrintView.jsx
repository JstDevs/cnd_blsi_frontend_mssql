// components/print/StatementComparisonPrintView.jsx
import React, { forwardRef, useMemo } from 'react';

const StatementComparisonPrintView = forwardRef(({ data, fiscalYear }, ref) => {
  // Helper to safely parse numbers
  const parseNum = (val) => Number(val) || 0;

  // Helper to format currency
  const formatMoney = (amount) => {
    return (Number(amount) || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // 1. Group Data and Calculate Totals using useMemo to avoid recalc on every render
  const groupedData = useMemo(() => {
    const groups = {};
    let grandTotal = { Original: 0, Final: 0, Difference: 0, Actual: 0, Difference2: 0 };

    data.forEach(row => {
      const type = row.Type || 'Uncategorized';
      const subtype = row.Subtype || 'Other';
      const category = row.Category || 'General';

      // Initialize path
      if (!groups[type]) groups[type] = {
        name: type,
        subtypes: {},
        totals: { Original: 0, Final: 0, Difference: 0, Actual: 0, Difference2: 0 }
      };

      if (!groups[type].subtypes[subtype]) groups[type].subtypes[subtype] = {
        name: subtype,
        categories: {},
        totals: { Original: 0, Final: 0, Difference: 0, Actual: 0, Difference2: 0 }
      };

      if (!groups[type].subtypes[subtype].categories[category]) groups[type].subtypes[subtype].categories[category] = {
        name: category,
        items: [],
        totals: { Original: 0, Final: 0, Difference: 0, Actual: 0, Difference2: 0 }
      };

      // Add Item
      groups[type].subtypes[subtype].categories[category].items.push(row);

      // Accumulate Totals (Category Level)
      const catTotals = groups[type].subtypes[subtype].categories[category].totals;
      catTotals.Original += parseNum(row.Original);
      catTotals.Final += parseNum(row.Final);
      catTotals.Difference += parseNum(row.Difference);
      catTotals.Actual += parseNum(row.Actual);
      catTotals.Difference2 += parseNum(row.Difference2);
    });

    // Roll up totals
    Object.values(groups).forEach(typeGroup => {
      Object.values(typeGroup.subtypes).forEach(subtypeGroup => {
        Object.values(subtypeGroup.categories).forEach(catGroup => {
          // Add Category totals to Subtype
          subtypeGroup.totals.Original += catGroup.totals.Original;
          subtypeGroup.totals.Final += catGroup.totals.Final;
          subtypeGroup.totals.Difference += catGroup.totals.Difference;
          subtypeGroup.totals.Actual += catGroup.totals.Actual;
          subtypeGroup.totals.Difference2 += catGroup.totals.Difference2;
        });

        // Add Subtype totals to Type
        typeGroup.totals.Original += subtypeGroup.totals.Original;
        typeGroup.totals.Final += subtypeGroup.totals.Final;
        typeGroup.totals.Difference += subtypeGroup.totals.Difference;
        typeGroup.totals.Actual += subtypeGroup.totals.Actual;
        typeGroup.totals.Difference2 += subtypeGroup.totals.Difference2;
      });

      // Add Type totals to Grand Total
      grandTotal.Original += typeGroup.totals.Original;
      grandTotal.Final += typeGroup.totals.Final;
      grandTotal.Difference += typeGroup.totals.Difference;
      grandTotal.Actual += typeGroup.totals.Actual;
      grandTotal.Difference2 += typeGroup.totals.Difference2;
    });

    return { groups, grandTotal };
  }, [data]);

  const { groups, grandTotal } = groupedData;
  const lguValue = data?.[0]?.Municipality || "LGU";
  const yearValue = data?.[0]?.Period || "Year";

  return (
    <div ref={ref} className="p-6 text-black text-[9px] font-sans">
      <div className="mb-6">
        <h2 className="text-center font-bold">Municipality of {lguValue}</h2>
        <h3 className="text-center font-bold">Statement of Comparison of Budget and Actual Amounts</h3>
        <p className="text-center">For the Year Ended {yearValue}</p>
      </div>

      <table className="w-full text-[9px] border-collapse">
        <thead>
          <tr className="border-b border-black">
            <th className="w-[30%] text-left align-top py-2" rowSpan={2}>Particular</th>
            <th className="w-[5%] text-center align-top py-2" rowSpan={2}>Notes</th>
            <th className="text-center border-b border-black py-1" colSpan={2}>Budget Amounts</th>
            <th className="w-[11%] text-center align-top py-2" rowSpan={2}>Difference<br />Original and Final<br />Budget</th>
            <th className="w-[11%] text-center align-top py-2" rowSpan={2}>Actual<br />Amounts</th>
            <th className="w-[11%] text-center align-top py-2" rowSpan={2}>Difference<br />Final Budget and<br />Actual Amount</th>
          </tr>
          <tr className="border-b border-black">
            <th className="w-[11%] text-right py-1">Original</th>
            <th className="w-[11%] text-right py-1">Final</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groups).map((typeGroup) => (
            <React.Fragment key={typeGroup.name}>
              {/* Type Header (e.g., Receipts, Payments) */}
              <tr>
                <td colSpan={7} className="font-bold pt-2">{typeGroup.name}</td>
              </tr>

              {Object.values(typeGroup.subtypes).map((subtypeGroup) => (
                <React.Fragment key={subtypeGroup.name}>
                  {/* Subtype Header (e.g., Tax Revenue) */}
                  <tr>
                    <td colSpan={7} className="font-bold pl-4">{subtypeGroup.name}</td>
                  </tr>

                  {Object.values(subtypeGroup.categories).map((catGroup) => (
                    <React.Fragment key={catGroup.name}>
                      {/* Category Header (e.g., Professional Tax) */}
                      <tr>
                        <td colSpan={7} className="pl-8">{catGroup.name}</td>
                      </tr>

                      {/* Items */}
                      {catGroup.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="pl-12 py-0.5 pr-2">{item['Chart of Accounts']}</td>
                          <td></td>
                          <td className="text-right px-2">{formatMoney(item.Original)}</td>
                          <td className="text-right px-2">{formatMoney(item.Final)}</td>
                          <td className="text-right px-2">{formatMoney(item.Difference)}</td>
                          <td className="text-right px-2">{formatMoney(item.Actual)}</td>
                          <td className="text-right px-2">{formatMoney(item.Difference2)}</td>
                        </tr>
                      ))}

                      {/* Category Subtotal */}
                      <tr className="font-semibold">
                        <td className="pl-8 py-1">Total {catGroup.name}</td>
                        <td></td>
                        <td className="text-right px-2"><div className="border-t border-black pt-0.5">{formatMoney(catGroup.totals.Original)}</div></td>
                        <td className="text-right px-2"><div className="border-t border-black pt-0.5">{formatMoney(catGroup.totals.Final)}</div></td>
                        <td className="text-right px-2"><div className="border-t border-black pt-0.5">{formatMoney(catGroup.totals.Difference)}</div></td>
                        <td className="text-right px-2"><div className="border-t border-black pt-0.5">{formatMoney(catGroup.totals.Actual)}</div></td>
                        <td className="text-right px-2"><div className="border-t border-black pt-0.5">{formatMoney(catGroup.totals.Difference2)}</div></td>
                      </tr>
                    </React.Fragment>
                  ))}

                  {/* Space between subtypes */}
                  <tr><td colSpan={7} className="h-2"></td></tr>

                </React.Fragment>
              ))}
            </React.Fragment>
          ))}

          {/* Grand Total */}
          <tr className="font-bold text-[10px]">
            <td className="pt-4">Total Appropriations</td>
            <td className="pt-4"></td>
            <td className="text-right pt-4 px-2"><div className="border-t border-b-4 border-double border-black py-0.5">{formatMoney(grandTotal.Original)}</div></td>
            <td className="text-right pt-4 px-2"><div className="border-t border-b-4 border-double border-black py-0.5">{formatMoney(grandTotal.Final)}</div></td>
            <td className="text-right pt-4 px-2"><div className="border-t border-b-4 border-double border-black py-0.5">{formatMoney(grandTotal.Difference)}</div></td>
            <td className="text-right pt-4 px-2"><div className="border-t border-b-4 border-double border-black py-0.5">{formatMoney(grandTotal.Actual)}</div></td>
            <td className="text-right pt-4 px-2"><div className="border-t border-b-4 border-double border-black py-0.5">{formatMoney(grandTotal.Difference2)}</div></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

StatementComparisonPrintView.displayName = 'StatementComparisonPrintView';
export default StatementComparisonPrintView;
