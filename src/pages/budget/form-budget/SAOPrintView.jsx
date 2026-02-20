import React, { forwardRef } from 'react';

const SAOPrintView = forwardRef(({
    data,
    preparedByName,
    preparedByTitle,
    certifiedByName,
    certifiedByTitle
}, ref) => {
    // Helper to format currency
    const formatMoney = (amount) => {
        return (Number(amount) || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const firstRow = data?.[0] || {};
    const municipality = firstRow.Municipality || "Passi City";
    const fund = firstRow.Fund || "";
    const department = firstRow.Department || "";
    const code = firstRow['Account Code'] || "";

    return (
        <div ref={ref} className="p-8 text-black font-sans text-[10px]">
            <div className="mb-8 text-center">
                <h2 className="font-bold text-lg uppercase tracking-wide">STATUS OF APPROPRIATION & OBLIGATION</h2>
            </div>

            <div className="mb-6 max-w-2xl">
                <div className="grid grid-cols-[160px_1fr] gap-y-1 items-end">
                    <div className="font-bold text-sm">MUNICIPALITY OF :</div>
                    <div className="border-b-2 border-black font-bold text-sm uppercase px-2">{municipality}</div>

                    <div className="font-bold text-sm">Fund/Special Account:</div>
                    <div className="border-b-2 border-black font-bold text-sm px-2">{fund}</div>

                    <div className="font-bold text-sm">Dept./Office/Unit :</div>
                    <div className="border-b-2 border-black font-bold text-sm px-2">{department}</div>
                </div>
            </div>

            <table className="w-full border-collapse border border-black mb-8">
                <thead>
                    <tr className="text-center font-bold">
                        <th className="border border-black py-2 px-1 w-[10%]">DATE</th>
                        <th className="border border-black py-2 px-1 w-[12%]">OBR NO.</th>
                        <th className="border border-black py-2 px-1 w-[38%]">P A R T I C U L A R S</th>
                        <th className="border border-black py-2 px-1 w-[15%]">APPROPRIATION/ ALLOTMENT</th>
                        <th className="border border-black py-2 px-1 w-[10%]">EXPENSES</th>
                        <th className="border border-black py-2 px-1 w-[15%]">BALANCE</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} className="align-top">
                            <td className="border border-black py-1 px-2 text-center">{row.Date ? new Date(row.Date).toISOString().split('T')[0] : ''}</td>
                            <td className="border border-black py-1 px-2 text-center break-words">{row['OBR No.']}</td>
                            <td className="border border-black py-1 px-2">{row.Particulars}</td>
                            <td className="border border-black py-1 px-2 text-right">{formatMoney(row['Appropriation/ Allotment'])}</td>
                            <td className="border border-black py-1 px-2 text-right">{formatMoney(row.Expenses)}</td>
                            <td className="border border-black py-1 px-2 text-right">{formatMoney(row.Balance)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Signatories */}
            <div className="flex justify-between mt-12 px-4">
                <div>
                    <p className="font-bold">Prepared by:</p>
                    <br />
                    <br />
                    <div className="border-b border-black w-64"></div>
                    <p className="text-center w-64 font-bold mt-1 uppercase">{preparedByName}</p>
                    <p className="text-center w-64 text-xs">{preparedByTitle}</p>
                </div>
                <div>
                    <p className="font-bold">Certified Correct:</p>
                    <br />
                    <br />
                    <div className="border-b border-black w-64"></div>
                    <p className="text-center w-64 font-bold mt-1 uppercase">{certifiedByName}</p>
                    <p className="text-center w-64 text-xs">{certifiedByTitle}</p>
                </div>
            </div>

            <div className="flex justify-between mt-8 text-[9px]">
                <p>Date Printed: {new Date().toLocaleString()}</p>
            </div>
        </div>
    );
});

SAOPrintView.displayName = 'SAOPrintView';
export default SAOPrintView;
