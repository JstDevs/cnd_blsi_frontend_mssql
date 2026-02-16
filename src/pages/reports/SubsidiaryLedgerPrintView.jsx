import React, { forwardRef } from 'react';

const SubsidiaryLedgerPrintView = forwardRef(({ data, formValues, chartOfAccounts, fundName }, ref) => {
    const formatCurrency = (amount) => {
        if (amount === 0) return '0.00';
        if (!amount) return '-';
        return Number(amount).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const totals = (data || []).reduce(
        (acc, item) => ({
            debit: acc.debit + (Number(item.debit || item.Debit) || 0),
            credit: acc.credit + (Number(item.credit || item.Credit) || 0),
        }),
        { debit: 0, credit: 0 }
    );

    const firstRow = data?.[0] || {};

    // Get account details from the first row or from the chartOfAccounts list if available
    const selectedAccount = chartOfAccounts?.find(acc => String(acc.AccountCode) === String(formValues?.ChartofAccountsID));

    const accountName = selectedAccount?.Name || firstRow.account_name || firstRow.AccountName || '________________';
    const accountCode = selectedAccount?.AccountCode || firstRow.account_code || firstRow.AccountCode || '________________';
    const sl = selectedAccount?.SL || firstRow.sl || firstRow.SL || '________________';
    const gl = firstRow.gl || firstRow.GL || '________________'; // Assuming GL might come from somewhere or is just a placeholder here

    return (
        <div ref={ref} className="p-8 text-black bg-white min-h-screen font-serif text-[11px] print:p-6">
            {/* Header Title */}
            <div className="text-center mb-6">
                <h1 className="text-xl font-bold uppercase tracking-widest">SUBSIDIARY LEDGER</h1>
                <div className="mt-1 border-t-2 border-black w-2/3 mx-auto pt-1">
                    <p className="font-bold flex justify-center items-center">
                        Municipality of
                    </p>
                    <p className="uppercase font-bold">{firstRow.municipality || 'LGU'}</p>
                </div>
                <div className="mt-2 border-t border-orange-400 w-full"></div>
            </div>

            {/* Info Section */}
            <div className="w-full mb-4 px-2">
                <div className="grid grid-cols-2 gap-x-12 font-bold">
                    <div className="space-y-1">
                        <div className="flex">
                            <span className="w-32">Fund:</span>
                            <span className="font-normal border-b border-black flex-1 ml-1">{fundName || firstRow.fund || '________________'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32">Nature of Account:</span>
                            <span className="font-normal border-b border-black flex-1 ml-1">{accountName}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32">Office/Address:</span>
                            <span className="font-normal border-b border-black flex-1 ml-1">________________________________</span>
                        </div>
                        <div className="flex">
                            <span className="w-32">Contact Person/No.:</span>
                            <span className="font-normal border-b border-black flex-1 ml-1">________________________________</span>
                        </div>
                    </div>
                    <div className="space-y-1 flex flex-col justify-end">
                        <div className="flex">
                            <span className="w-12">GL:</span>
                            <span className="font-normal border-b border-black flex-1 ml-1 text-center">{gl}</span>
                        </div>
                        <div className="flex">
                            <span className="w-12">SL:</span>
                            <span className="font-normal border-b border-black flex-1 ml-1 text-center">{sl}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                {/* Table */}
                <table className="w-full border-collapse border border-black">
                    <thead>
                        <tr className="uppercase text-center">
                            <th className="border border-black p-1 w-[12%]" rowSpan={2}>Date</th>
                            <th className="border border-black p-1 w-[35%]" rowSpan={2}>Particular</th>
                            <th className="border border-black p-1 w-[8%]" rowSpan={2}>Ref.</th>
                            <th className="border border-black p-1" colSpan={3}>Amount</th>
                        </tr>
                        <tr className="uppercase text-center">
                            <th className="border border-black p-1 w-[15%]">Debit</th>
                            <th className="border border-black p-1 w-[15%]">Credit</th>
                            <th className="border border-black p-1 w-[15%]">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data || []).length > 0 ? (data || []).map((item, index) => (
                            <tr key={index} className="border-b border-black">
                                <td className="border-x border-black px-2 py-1 text-center">
                                    {item.date ? new Date(item.date).toLocaleDateString('en-PH', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''}
                                </td>
                                <td className="border-x border-black px-2 py-1">{item.ledger_item || item.ledger_item}</td>
                                <td className="border-x border-black px-2 py-1 text-center">{item.ref || '---'}</td>
                                <td className="border-x border-black px-2 py-1 text-right">{formatCurrency(item.debit)}</td>
                                <td className="border-x border-black px-2 py-1 text-right">{formatCurrency(item.credit)}</td>
                                <td className="border-x border-black px-2 py-1 text-right font-semibold">{formatCurrency(item.balance)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="border border-black px-2 py-4 text-center italic text-gray-500">No records found.</td>
                            </tr>
                        )}
                        {/* Summary Total Row */}
                        <tr className="font-bold uppercase bg-gray-50">
                            <td className="border border-black px-2 py-1" colSpan={3}>
                                Total
                            </td>
                            <td className="border border-black px-2 py-1 text-right">
                                {formatCurrency(totals.debit)}
                            </td>
                            <td className="border border-black px-2 py-1 text-right">
                                {formatCurrency(totals.credit)}
                            </td>
                            <td className="border border-black px-2 py-1 text-right">
                                {formatCurrency(data?.[data.length - 1]?.balance)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Footer space as requested by empty lines in image */}
            <div className="mt-12"></div>
        </div>
    );
});

SubsidiaryLedgerPrintView.displayName = 'SubsidiaryLedgerPrintView';
export default SubsidiaryLedgerPrintView;
