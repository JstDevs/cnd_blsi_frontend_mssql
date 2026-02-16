import React, { forwardRef } from 'react';

// ------------------------------------- POST-CLOSING TRIAL BALANCE PRINT VIEW ------------------------------------
const PostClosingPrintView = forwardRef(({ data, formValues, fiscalYearName, fundName, approverName }, ref) => {

    const formatCurrency = (amount) => {
        return Number(amount || 0).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };
    const totals = (data || []).reduce(
        (acc, item) => ({
            debit: acc.debit + (Number(item.Debit) || 0),
            credit: acc.credit + (Number(item.Credit) || 0),
        }),
        { debit: 0, credit: 0 }
    );
    return (
        <div ref={ref} className="p-12 text-black bg-white min-h-screen font-serif text-sm print:p-8">
            {/* Standard Header */}
            <div className="text-center mb-10">
                <h1 className="text-base uppercase">Republic of the Philippines</h1>
                <h1 className="text-base uppercase">Province of {data?.[0]?.Province || '________________'}</h1>
                <h1 className="text-base uppercase">Municipality of {data?.[0]?.Municipality || 'LGU'}</h1>

                <div className="mt-6">
                    <h2 className="text-lg font-bold uppercase">POST-CLOSING TRIAL BALANCE</h2>
                    <p className="mt-1">As of {formValues?.dateTo ? new Date(formValues.dateTo).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '________________'}</p>
                </div>
            </div>
            <div className="w-full max-w-5xl mx-auto">
                {/* Table */}
                <table className="w-full border-collapse border-2 border-black mb-8">
                    <thead>
                        <tr className="uppercase text-center">
                            <th className="border-2 border-black p-3 w-2/5">ACCOUNT TITLE</th>
                            <th className="border-2 border-black p-3 w-1/5">ACCOUNT CODE</th>
                            <th className="border-2 border-black p-3 w-1/5">DEBIT</th>
                            <th className="border-2 border-black p-3 w-1/5">CREDIT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data || []).map((item, index) => (
                            <tr key={index}>
                                <td className="border border-black px-4 py-1">{item.AccountName}</td>
                                <td className="border border-black px-4 py-1 text-center">{item.AccountCode}</td>
                                <td className="border border-black px-4 py-1 text-right">{formatCurrency(item.Debit)}</td>
                                <td className="border border-black px-4 py-1 text-right">{formatCurrency(item.Credit)}</td>
                            </tr>
                        ))}
                        {/* Grand Total row */}
                        <tr className="font-bold uppercase">
                            <td className="border-2 border-black px-4 py-2 text-center" colSpan={2}>
                                GRAND TOTAL -------
                            </td>
                            <td className="border-2 border-black px-4 py-2 text-right">
                                {formatCurrency(totals.debit)}
                            </td>
                            <td className="border-2 border-black px-4 py-2 text-right">
                                {formatCurrency(totals.credit)}
                            </td>
                        </tr>
                    </tbody>
                </table>
                {/* Signatory */}
                <div className="mt-16 text-center">
                    <p className="mb-12">Certified Correct:</p>
                    <div className="inline-block text-center border-t border-transparent">
                        <p className="font-bold uppercase text-base">{approverName || 'ACCOUNTING S. HEAD'}</p>
                        <p className="italic text-sm">Accounting Head</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

PostClosingPrintView.displayName = 'PostClosingPrintView';
export default PostClosingPrintView;
