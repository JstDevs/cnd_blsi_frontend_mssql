import React, { forwardRef } from 'react';

// ------------------------------------- GENERAL LEDGER PRINT VIEW ------------------------------------

const GeneralLedgerPrintView = forwardRef(({ data, formValues, fiscalYearName, fundName, approverName }, ref) => {

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
            debit: acc.debit + (Number(item.Debit || item.debit) || 0),
            credit: acc.credit + (Number(item.Credit || item.credit) || 0),
        }),
        { debit: 0, credit: 0 }
    );

    // Get info from first row if available
    const firstRow = data?.[0] || {};

    return (
        <div ref={ref} className="p-12 text-black bg-white min-h-screen font-serif text-[11px] print:p-8">
            {/* Header Title */}
            <div className="text-center mb-8">
                <h1 className="text-xl font-bold uppercase tracking-widest">GENERAL LEDGER</h1>
                <div className="mt-2 border-t-2 border-black w-1/3 mx-auto pt-1">
                    <p className="font-bold flex justify-center items-center">
                        Municipality of
                        <span className="ml-2 uppercase">{firstRow.Municipality || 'LGU'}</span>
                    </p>
                </div>
            </div>

            {/* Info Section */}
            <div className="w-full max-w-5xl mx-auto mb-4 flex justify-between font-bold">
                <div className="space-y-1">
                    <p>Fund: <span className="font-normal border-b border-black min-w-[150px] inline-block ml-1">{fundName || firstRow['Fund Name'] || firstRow.Fund || firstRow.fund || '________________'}</span></p>
                    <p>Account Title: <span className="font-normal border-b border-black min-w-[200px] inline-block ml-1">{firstRow['Account Name'] || firstRow.AccountName || firstRow.account_name || '________________'}</span></p>
                </div>
                <div className="flex items-end">
                    <p>Account Code: <span className="font-normal border-b border-black min-w-[150px] inline-block ml-1 text-center">{firstRow['Account Code'] || firstRow.AccountCode || firstRow.account_code || '________________'}</span></p>
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto">
                {/* Table */}
                <table className="w-full border-collapse border-t-2 border-b-2 border-black">
                    <thead>
                        <tr className="uppercase text-center">
                            <th className="border border-black p-2 w-[12%]" rowSpan={2}>Date</th>
                            <th className="border border-black p-2 w-[35%]" rowSpan={2}>Particular</th>
                            <th className="border border-black p-2 w-[8%]" rowSpan={2}>Ref.</th>
                            <th className="border border-black p-2" colSpan={3}>Amount</th>
                        </tr>
                        <tr className="uppercase text-center">
                            <th className="border border-black p-1 w-[15%]">Debit</th>
                            <th className="border border-black p-1 w-[15%]">Credit</th>
                            <th className="border border-black p-1 w-[15%]">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data || []).map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 last:border-black last:border-b-2">
                                <td className="border-x border-black px-2 py-1 text-center font-bold">
                                    {(item['Invoice Date'] || item.Date || item.date) ? new Date(item['Invoice Date'] || item.Date || item.date).toLocaleDateString('en-PH', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''}
                                </td>
                                <td className="border-x border-black px-2 py-1">{item.Particular || item['Ledger Item'] || item.ledger_item}</td>
                                <td className="border-x border-black px-2 py-1 text-center">{item.Ref || item['Invoice Number'] || item.invoice_number}</td>
                                <td className="border-x border-black px-2 py-1 text-right">{formatCurrency(item.Debit || item.debit)}</td>
                                <td className="border-x border-black px-2 py-1 text-right">{formatCurrency(item.Credit || item.credit)}</td>
                                <td className="border-x border-black px-2 py-1 text-right font-semibold">{formatCurrency(item.Balance || item.balance)}</td>
                            </tr>
                        ))}
                        {/* Summary Total Row */}
                        <tr className="font-bold uppercase">
                            <td className="border border-black px-4 py-2" colSpan={3}>
                                Total
                            </td>
                            <td className="border border-black px-4 py-2 text-right">
                                {formatCurrency(totals.debit)}
                            </td>
                            <td className="border border-black px-4 py-2 text-right">
                                {formatCurrency(totals.credit)}
                            </td>
                            <td className="border border-black px-4 py-2 text-right">
                                {/* Balance total depends on accounting logic, usually the last balance */}
                                {formatCurrency(data?.[data.length - 1]?.Balance || data?.[data.length - 1]?.balance)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
});

GeneralLedgerPrintView.displayName = 'GeneralLedgerPrintView';
export default GeneralLedgerPrintView;
