import React from 'react';

const TrialBalancePrintView = React.forwardRef(({ data, formValues, approver, funds, approverPosition }, ref) => {

    const formatCurrency = (amount) => {
        return Number(amount || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Filter out zero balanced accounts if needed, or keep all
    const filteredData = (data || []).filter(item =>
        Number(item.debit || item.Debit || 0) !== 0 || Number(item.credit || item.Credit || 0) !== 0
    );

    const totals = filteredData.reduce(
        (acc, item) => ({
            debit: acc.debit + (Number(item.debit || item.Debit) || 0),
            credit: acc.credit + (Number(item.credit || item.Credit) || 0),
        }),
        { debit: 0, credit: 0 }
    );

    return (
        <div ref={ref} className="p-8 text-black bg-white min-h-screen font-sans text-sm print:p-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-lg font-bold uppercase underline decoration-2 underline-offset-4 mb-2">TRIAL BALANCE</h1>
                <h2 className="text-base font-bold uppercase underline decoration-2 underline-offset-4 mb-2">MUNICIPALITY OF {filteredData?.[0]?.Municipality || 'LGU'}</h2>
                <p className="italic font-bold">As of {formValues?.endDate ? new Date(formValues.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '_________________'}</p>
            </div>

            {/* Fund Name */}
            <div className="mb-2">
                <h3 className="font-bold text-base">
                    {formValues?.fundID
                        ? funds?.find(f => f.ID === formValues.fundID)?.Name
                        : (typeof filteredData?.[0]?.Funds === 'object'
                            ? filteredData?.[0]?.Funds?.Name
                            : (filteredData?.[0]?.Funds || 'General Fund'))}
                </h3>
            </div>

            {/* Table */}
            <div className="w-full border-2 border-black">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-center font-bold">
                            <th className="border-r border-b border-black p-2 w-[50%] font-normal align-middle" rowSpan={2}>Title</th>
                            <th className="border-r border-b border-black p-2 w-[10%] font-normal align-middle" rowSpan={2}>AC</th>
                            <th className="border-b border-black p-1 font-bold" colSpan={2}>TOTAL</th>
                        </tr>
                        <tr className="text-center">
                            <th className="border-r border-b border-black p-1 w-[20%] font-normal">Debit</th>
                            <th className="border-b border-black p-1 w-[20%] font-normal">Credit</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {filteredData.map((item, index) => (
                            <tr key={index} className="border-b border-gray-300 last:border-black last:border-b-2">
                                <td className="border-r border-black px-2 py-1">{item.accountName || item.AccountName}</td>
                                <td className="border-r border-black px-2 py-1 text-center">{item.accountCode || item.AccountCode}</td>
                                <td className="border-r border-black px-2 py-1 text-right">{formatCurrency(item.debit || item.Debit)}</td>
                                <td className="px-2 py-1 text-right">{formatCurrency(item.credit || item.Credit)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold border-t-2 border-black">
                            <td className="border-r border-black px-2 py-2 text-center text-base" colSpan={2}>
                                TOTAL
                            </td>
                            <td className="border-r border-black px-2 py-2 text-right">
                                {formatCurrency(totals.debit)}
                            </td>
                            <td className="px-2 py-2 text-right">
                                {formatCurrency(totals.credit)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Signatory */}
            <div className="mt-16 flex justify-end">
                <div className="text-center w-64">
                    <p className="mb-8 text-left text-xs">Certified Correct:</p>
                    <div className="inline-block border-b border-black pb-1 mb-1">
                        <p className="font-bold uppercase text-sm">{approver || 'CEDRIC A. ENTAC'}</p>
                    </div>
                    <p className="text-xs">{approverPosition || 'Treasury Head'}</p>
                </div>
            </div>
        </div>
    );
});

TrialBalancePrintView.displayName = 'TrialBalancePrintView';
export default TrialBalancePrintView;
