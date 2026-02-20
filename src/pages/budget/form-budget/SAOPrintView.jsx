// SAO Print View Component
import React, { forwardRef } from 'react';

const SAOPrintView = forwardRef(({
    data,
    fundName,
    deptName
}, ref) => {
    // Helper to format currency
    const formatMoney = (amount) => {
        return (Number(amount) || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const firstRow = data?.[0] || {};
    const municipality = firstRow.Municipality || "Passi City";

    return (
        <div ref={ref} className="p-10 text-black font-sans text-sm">
            <div className="mb-8 text-center">
                <h2 className="font-bold text-xl uppercase tracking-wider">STATUS OF APPROPRIATION & OBLIGATION</h2>
            </div>

            <div className="mb-8 w-full max-w-3xl mx-auto">
                <div className="flex items-end mb-2">
                    <div className="font-bold w-48 text-base">MUNICIPALITY OF :</div>
                    <div className="flex-1 border-b border-black font-bold uppercase px-2 text-base">{municipality}</div>
                </div>
                <div className="flex items-end mb-2">
                    <div className="font-bold w-48 text-base">Fund/Special Account:</div>
                    <div className="flex-1 border-b border-black font-bold px-2 text-base">{fundName}</div>
                </div>
                <div className="flex items-end mb-2">
                    <div className="font-bold w-48 text-base">Dept./Office/Unit :</div>
                    <div className="flex-1 border-b border-black font-bold px-2 text-base">{deptName}</div>
                </div>
            </div>

            <table className="w-full border-collapse border border-black mb-12">
                <thead>
                    <tr className="text-center font-bold text-xs bg-gray-50 uppercase">
                        <th className="border border-black py-2 px-1 w-[12%]">DATE</th>
                        <th className="border border-black py-2 px-1 w-[12%]">OBR NO.</th>
                        <th className="border border-black py-2 px-1 w-[36%]">P A R T I C U L A R S</th>
                        <th className="border border-black py-2 px-1 w-[15%]">APPROPRIATION/ ALLOTMENT</th>
                        <th className="border border-black py-2 px-1 w-[10%]">EXPENSES</th>
                        <th className="border border-black py-2 px-1 w-[15%]">BALANCE</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} className="align-top text-xs">
                            <td className="border border-black py-2 px-2 text-center whitespace-nowrap">
                                {row.Date ? new Date(row.Date).toISOString().split('T')[0] : ''}
                            </td>
                            <td className="border border-black py-2 px-2 text-center break-words">{row['OBR No.']}</td>
                            <td className="border border-black py-2 px-2 uppercase">{row.Particulars}</td>
                            <td className="border border-black py-2 px-2 text-right tracking-tighter font-mono">{formatMoney(row['Appropriation/ Allotment'])}</td>
                            <td className="border border-black py-2 px-2 text-right tracking-tighter font-mono">{formatMoney(row.Expenses)}</td>
                            <td className="border border-black py-2 px-2 text-right tracking-tighter font-mono font-bold">{formatMoney(row.Balance)}</td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={6} className="border border-black py-8 text-center text-gray-400 italic">No Records Found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="mt-8 text-[10px] text-gray-500">
                <p>Date Printed: {new Date().toLocaleString()}</p>
            </div>
        </div>
    );
});

SAOPrintView.displayName = 'SAOPrintView';
export default SAOPrintView;
