import React, { forwardRef, useMemo } from 'react';

const SAAOBPrintView = forwardRef(({ data }, ref) => {
    // Helper to safely parse numbers
    const parseNum = (val) => Number(val) || 0;

    // Helper to format currency
    const formatMoney = (amount) => {
        return (Number(amount) || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Group Data by Category
    const groupedData = useMemo(() => {
        const groups = {};
        let grandTotal = {
            Appropriation: 0,
            Allotment: 0,
            Obligation: 0,
            UnobligatedAppropriation: 0,
            UnobligatedAllotment: 0
        };

        data.forEach(row => {
            const category = row.Category || 'Uncategorized';

            if (!groups[category]) {
                groups[category] = {
                    name: category,
                    items: [],
                    totals: {
                        Appropriation: 0,
                        Allotment: 0,
                        Obligation: 0,
                        UnobligatedAppropriation: 0,
                        UnobligatedAllotment: 0
                    }
                };
            }

            groups[category].items.push(row);

            // Accumulate Category Totals
            const g = groups[category];
            g.totals.Appropriation += parseNum(row.Appropriation);
            g.totals.Allotment += parseNum(row.Allotment);
            g.totals.Obligation += parseNum(row.Obligation);
            g.totals.UnobligatedAppropriation += parseNum(row['Unobligated Appropriation']);
            g.totals.UnobligatedAllotment += parseNum(row['Unobligated Allotment']);

            // Accumulate Grand Totals
            grandTotal.Appropriation += parseNum(row.Appropriation);
            grandTotal.Allotment += parseNum(row.Allotment);
            grandTotal.Obligation += parseNum(row.Obligation);
            grandTotal.UnobligatedAppropriation += parseNum(row['Unobligated Appropriation']);
            grandTotal.UnobligatedAllotment += parseNum(row['Unobligated Allotment']);
        });

        return { groups, grandTotal };
    }, [data]);

    const { groups, grandTotal } = groupedData;
    const firstRow = data?.[0] || {};
    const municipality = firstRow.Municipality || "Passi City";
    const endDate = firstRow['Month End'] || "";
    const year = firstRow.Year || "";

    return (
        <div ref={ref} className="p-8 text-black font-sans text-[10px]">
            <div className="mb-6 text-center">
                <h2 className="font-bold text-lg uppercase">MUNICIPALITY OF {municipality}</h2>
                <p className="font-bold text-sm">(CURRENT APPROPRIATION)</p>
                <h3 className="font-bold text-md">STATUS OF APPROPRIATIONS, ALLOTMENTS, OBLIGATIONS AND BALANCES</h3>
                <p className="text-xs">Ending Balance for the Month of {endDate}, {year}</p>
            </div>

            <table className="w-full border-collapse border border-black mb-8">
                <thead>
                    <tr className="border border-black bg-gray-100">
                        <th className="border border-black py-2 px-1 w-[8%] text-center align-middle" rowSpan={2}>CODE</th>
                        <th className="border border-black py-2 px-1 w-[32%] text-center align-middle" rowSpan={2}>FUNCTION / PPA / ALLOTMENT CLASS</th>
                        <th className="border border-black py-2 px-1 w-[12%] text-center align-middle" rowSpan={2}>APPROPRIATIONS</th>
                        <th className="border border-black py-2 px-1 w-[12%] text-center align-middle" rowSpan={2}>ALLOTMENTS</th>
                        <th className="border border-black py-2 px-1 w-[12%] text-center align-middle" rowSpan={2}>OBLIGATIONS</th>
                        <th className="border border-black py-1 px-1 text-center" colSpan={2}>UNOBLIGATED BALANCES</th>
                    </tr>
                    <tr className="border border-black bg-gray-100">
                        <th className="border border-black py-1 px-1 w-[12%] text-center">APPROPRIATIONS</th>
                        <th className="border border-black py-1 px-1 w-[12%] text-center">ALLOTMENTS</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(groups).map((group, idx) => (
                        <React.Fragment key={idx}>
                            <tr className="font-bold bg-gray-50">
                                <td className="border border-black py-1 px-2" colSpan={7}>{group.name}</td>
                            </tr>
                            {group.items.map((item, i) => (
                                <tr key={i}>
                                    <td className="border border-black py-1 px-2 text-center">{item['Account Code']}</td>
                                    <td className="border border-black py-1 px-4">{item.Name}</td>
                                    <td className="border border-black py-1 px-2 text-right">{formatMoney(item.Appropriation)}</td>
                                    <td className="border border-black py-1 px-2 text-right">{formatMoney(item.Allotment)}</td>
                                    <td className="border border-black py-1 px-2 text-right">{formatMoney(item.Obligation)}</td>
                                    <td className="border border-black py-1 px-2 text-right">{formatMoney(item['Unobligated Appropriation'])}</td>
                                    <td className="border border-black py-1 px-2 text-right">{formatMoney(item['Unobligated Allotment'])}</td>
                                </tr>
                            ))}
                            {/* Subtotal */}
                            <tr className="font-bold bg-gray-100">
                                <td className="border border-black py-1 px-2 text-right" colSpan={2}>Sub Total</td>
                                <td className="border border-black py-1 px-2 text-right">{formatMoney(group.totals.Appropriation)}</td>
                                <td className="border border-black py-1 px-2 text-right">{formatMoney(group.totals.Allotment)}</td>
                                <td className="border border-black py-1 px-2 text-right">{formatMoney(group.totals.Obligation)}</td>
                                <td className="border border-black py-1 px-2 text-right">{formatMoney(group.totals.UnobligatedAppropriation)}</td>
                                <td className="border border-black py-1 px-2 text-right">{formatMoney(group.totals.UnobligatedAllotment)}</td>
                            </tr>
                        </React.Fragment>
                    ))}

                    {/* Grand Total */}
                    <tr className="font-bold bg-gray-200 border-t-2 border-black">
                        <td className="border border-black py-2 px-2 text-right" colSpan={2}>GRAND TOTAL</td>
                        <td className="border border-black py-2 px-2 text-right">{formatMoney(grandTotal.Appropriation)}</td>
                        <td className="border border-black py-2 px-2 text-right">{formatMoney(grandTotal.Allotment)}</td>
                        <td className="border border-black py-2 px-2 text-right">{formatMoney(grandTotal.Obligation)}</td>
                        <td className="border border-black py-2 px-2 text-right">{formatMoney(grandTotal.UnobligatedAppropriation)}</td>
                        <td className="border border-black py-2 px-2 text-right">{formatMoney(grandTotal.UnobligatedAllotment)}</td>
                    </tr>
                </tbody>
            </table>

            {/* Signatories */}
            <div className="flex justify-between mt-12 px-4">
                <div>
                    <p className="font-bold">Prepared by:</p>
                    <br />
                    <br />
                    <div className="border-b border-black w-64"></div>
                    <p className="text-center w-64 font-bold mt-1">JANE DOE</p>
                    <p className="text-center w-64 text-xs">Budget Officer</p>
                </div>
                <div>
                    <p className="font-bold">Certified Correct:</p>
                    <br />
                    <br />
                    <div className="border-b border-black w-64"></div>
                    <p className="text-center w-64 font-bold mt-1">JOHN SMITH</p>
                    <p className="text-center w-64 text-xs">Municipal Accountant</p>
                </div>
            </div>

            <div className="flex justify-between mt-8 text-[9px]">
                <p>Date Printed: {new Date().toLocaleString()}</p>
                <p>Page 1 of 1</p>
            </div>
        </div>
    );
});

SAAOBPrintView.displayName = 'SAAOBPrintView';
export default SAAOBPrintView;
