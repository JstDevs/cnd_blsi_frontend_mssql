import React, { forwardRef } from 'react';


// ------------------------------------- OLD VERSION ------------------------------------

// const PostClosingPrintView = forwardRef(({ data, formValues, fiscalYearName, fundName, approverName }, ref) => {
//     // Calculate totals
//     const totals = data.reduce(
//         (acc, item) => ({
//             debit: acc.debit + (Number(item.Debit) || 0),
//             credit: acc.credit + (Number(item.Credit) || 0),
//         }),
//         { debit: 0, credit: 0 }
//     );

//     return (
//         <div ref={ref} className="p-8 text-black bg-white min-h-screen">
//             {/* Header */}
//             <div className="text-center mb-8">
//                 <h1 className="text-xl font-bold uppercase">Republic of the Philippines</h1>
//                 <h2 className="text-lg font-bold">Municipality of {data?.[0]?.Municipality || 'LGU'}</h2>
//                 <div className="mt-4">
//                     <h3 className="text-xl font-bold uppercase underline">Post-Closing Trial Balance</h3>
//                     <p className="text-sm">As of {formValues?.dateTo || 'N/A'}</p>
//                 </div>
//             </div>

//             {/* Meta Info */}
//             <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                     <p><span className="font-semibold">Fund:</span> {fundName || 'N/A'}</p>
//                     <p><span className="font-semibold">Fiscal Year:</span> {fiscalYearName || 'N/A'}</p>
//                 </div>
//                 <div className="text-right">
//                     <p><span className="font-semibold">Date Range:</span> {formValues?.dateFrom} to {formValues?.dateTo}</p>
//                 </div>
//             </div>

//             {/* Table */}
//             <table className="w-full border-collapse border border-black mb-8 text-sm">
//                 <thead>
//                     <tr className="bg-gray-100">
//                         <th className="border border-black p-2 text-left">Account Code</th>
//                         <th className="border border-black p-2 text-left">Account Name</th>
//                         <th className="border border-black p-2 text-right">Debit</th>
//                         <th className="border border-black p-2 text-right">Credit</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.map((item, index) => (
//                         <tr key={index}>
//                             <td className="border border-black p-2">{item.AccountCode}</td>
//                             <td className="border border-black p-2">{item.AccountName}</td>
//                             <td className="border border-black p-2 text-right">
//                                 {Number(item.Debit || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                             </td>
//                             <td className="border border-black p-2 text-right">
//                                 {Number(item.Credit || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                             </td>
//                         </tr>
//                     ))}
//                     {/* Totals Row */}
//                     <tr className="font-bold bg-gray-50">
//                         <td className="border border-black p-2 text-right" colSpan={2}>TOTAL</td>
//                         <td className="border border-black p-2 text-right">
//                             {totals.debit.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                         </td>
//                         <td className="border border-black p-2 text-right">
//                             {totals.credit.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                         </td>
//                     </tr>
//                 </tbody>
//             </table>

//             {/* Signatories */}
//             <div className="mt-12 grid grid-cols-1 gap-8 max-w-xs ml-auto">
//                 <div className="text-center">
//                     <p className="mb-8">Approved by:</p>
//                     <p className="font-bold border-b border-black inline-block px-8">{approverName || '____________________'}</p>
//                     <p className="text-xs uppercase">{data?.[0]?.Position || 'Position'}</p>
//                 </div>
//             </div>

//             {/* Footer */}
//             <div className="mt-12 text-[10px] text-gray-500 italic">
//                 <p>Printed on: {new Date().toLocaleString()}</p>
//             </div>
//         </div>
//     );
// });

// PostClosingPrintView.displayName = 'PostClosingPrintView';

// -------------------------------------- END OF OLD VERSION ------------------------------------

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
