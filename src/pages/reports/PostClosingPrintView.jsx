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


export default PostClosingPrintView;
