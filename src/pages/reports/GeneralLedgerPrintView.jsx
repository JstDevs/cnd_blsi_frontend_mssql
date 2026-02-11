import React, { forwardRef } from 'react';
import { formatDate } from 'date-fns';

const GeneralLedgerPrintView = forwardRef(({ data, filters }, ref) => {
    // Calculate totals
    const totals = {
        Debit: 0,
        Credit: 0,
        Balance: 0,
    };

    data.forEach((row) => {
        totals.Debit += Number(row.Debit) || 0;
        totals.Credit += Number(row.Credit) || 0;
        totals.Balance += Number(row.Balance) || 0;
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <div ref={ref} className="p-6 text-black text-[10px] w-full">
            <div className="text-center mb-6">
                <h2 className="font-bold text-sm">Municipality of {data?.[0]?.Municipality || 'LGU'}</h2>
                <h3 className="font-bold text-lg">General Ledger</h3>
                {filters?.CutOffDate && (
                    <p className="text-xs">
                        As of {formatDate(filters.CutOffDate, "MMMM d, yyyy")}
                    </p>
                )}
            </div>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-1 text-left">Date</th>
                        <th className="border border-gray-300 p-1 text-left">Ref Number</th>
                        <th className="border border-gray-300 p-1 text-left">Particulars</th>
                        <th className="border border-gray-300 p-1 text-left">Account Code</th>
                        <th className="border border-gray-300 p-1 text-left">Account Name</th>
                        <th className="border border-gray-300 p-1 text-right">Debit</th>
                        <th className="border border-gray-300 p-1 text-right">Credit</th>
                        <th className="border border-gray-300 p-1 text-right">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 p-1">
                                {row['Invoice Date'] ? formatDate(new Date(row['Invoice Date']), "MMM d, yyyy") : '-'}
                            </td>
                            <td className="border border-gray-300 p-1">{row['Invoice Number']}</td>
                            <td className="border border-gray-300 p-1">{row['Ledger Item'] || '-'}</td>
                            <td className="border border-gray-300 p-1">{row['Account Code']}</td>
                            <td className="border border-gray-300 p-1">{row['Account Name']}</td>
                            <td className="border border-gray-300 p-1 text-right">
                                {row.Debit ? formatCurrency(row.Debit) : '-'}
                            </td>
                            <td className="border border-gray-300 p-1 text-right">
                                {row.Credit ? formatCurrency(row.Credit) : '-'}
                            </td>
                            <td className="border border-gray-300 p-1 text-right font-semibold">
                                {row.Balance ? formatCurrency(row.Balance) : '-'}
                            </td>
                        </tr>
                    ))}

                    {/* Totals Row */}
                    <tr className="font-bold bg-gray-200">
                        <td className="border border-gray-300 p-1 text-right" colSpan={5}>
                            TOTAL
                        </td>
                        <td className="border border-gray-300 p-1 text-right">
                            {formatCurrency(totals.Debit)}
                        </td>
                        <td className="border border-gray-300 p-1 text-right">
                            {formatCurrency(totals.Credit)}
                        </td>
                        <td className="border border-gray-300 p-1 text-right">
                            {formatCurrency(totals.Balance)}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-8 flex justify-between">
                <div className="text-center">
                    <p className="mb-8">Prepared by:</p>
                    <div className="border-t border-black w-48 mt-8"></div>
                    <p className="font-bold">Municipal Accountant</p>
                </div>
                <div className="text-center">
                    <p className="mb-8">Approved by:</p>
                    <div className="border-t border-black w-48 mt-8"></div>
                    <p className="font-bold">Municipal Mayor</p>
                </div>
            </div>
        </div>
    );
});

GeneralLedgerPrintView.displayName = 'GeneralLedgerPrintView';
export default GeneralLedgerPrintView;
