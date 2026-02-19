import React from 'react';

const AlphalistPrintView = React.forwardRef(({ data, filters, reportType }, ref) => {
    const formatCurrency = (amount) => {
        return Number(amount || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const getReportTitle = () => {
        switch (reportType) {
            case 'Monthly': return 'MONTHLY ALPHALIST OF PAYEES (MAP)';
            case 'Quarterly': return 'QUARTERLY ALPHALIST OF PAYEES (QAP)';
            case 'Annually': return 'YEARLY ALPHALIST OF PAYEES';
            default: return 'ALPHALIST OF PAYEES';
        }
    };

    const getPeriodLabel = () => {
        switch (reportType) {
            case 'Monthly': return `For the Month of ${data?.[0]?.Month || '__________'} ${filters?.year}`;
            case 'Quarterly': return `For the ${data?.[0]?.Quarter || '__________'} of ${filters?.year}`;
            case 'Annually': return `For the Year of ${filters?.year}`;
            default: return '';
        }
    };

    const getReturnPeriod = (item) => {
        if (reportType === 'Monthly') return item.Month;
        if (reportType === 'Quarterly') return item.Quarter;
        return item.Year || filters?.year;
    };

    return (
        <div ref={ref} className="p-8 text-black bg-white min-h-screen font-sans text-[10px] print:p-8">
            {/* Header */}
            <div className="text-center mb-6">
                <p className="uppercase">PROVINCE OF {data?.[0]?.Province || '__________'}</p>
                <p className="uppercase">Municipality of {data?.[0]?.Municipality || '__________'}</p>
                <h1 className="text-sm font-bold uppercase mt-4">{getReportTitle()}</h1>
                <p className="italic">{getPeriodLabel()}</p>
            </div>

            {/* Table */}
            <div className="w-full border border-black">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-center font-bold uppercase border-b border-black">
                            <th className="border-r border-black p-1 w-[4%]">No.</th>
                            <th className="border-r border-black p-1 w-[12%]">TIN</th>
                            <th className="border-r border-black p-1 w-[20%]">REGISTERED NAME</th>
                            <th className="border-r border-black p-1 w-[10%]">RETURN PERIOD</th>
                            <th className="border-r border-black p-1 w-[8%]">ATC</th>
                            <th className="border-r border-black p-1 w-[18%]">NATURE OF INCOME PAYMENT</th>
                            <th className="border-r border-black p-1 w-[10%] text-right">AMOUNT OF TAX BASE</th>
                            <th className="border-r border-black p-1 w-[6%] text-right">TAX RATE</th>
                            <th className="p-1 w-[12%] text-right">TAX WITHHELD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data || []).map((item, index) => (
                            <tr key={index} className="border-b border-black last:border-b-0">
                                <td className="border-r border-black p-1 text-center">{index + 1}</td>
                                <td className="border-r border-black p-1">{item.TIN}</td>
                                <td className="border-r border-black p-1 uppercase">{item.Payee}</td>
                                <td className="border-r border-black p-1 text-center">{getReturnPeriod(item)}</td>
                                <td className="border-r border-black p-1 text-center">{item['Tax Code']}</td>
                                <td className="border-r border-black p-1">{item.Nature}</td>
                                <td className="border-r border-black p-1 text-right">{formatCurrency(item['Sub-Total'])}</td>
                                <td className="border-r border-black p-1 text-right">{item['Tax Rate']}</td>
                                <td className="p-1 text-right">{formatCurrency(item['Withheld Amount'])}</td>
                            </tr>
                        ))}
                        {/* Placeholder rows if empty or just to fill space like in the screenshot */}
                        {(!data || data.length === 0) && (
                            <>
                                <tr className="border-b border-black"><td className="border-r border-black p-4" colSpan={9}>&nbsp;</td></tr>
                                <tr className="border-b border-black"><td className="border-r border-black p-4" colSpan={9}>&nbsp;</td></tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Declaration */}
            <div className="mt-4 text-[9px] leading-tight">
                <p className="text-justify">
                    I declare under the penalties of perjury, that this has been made in good faith, verified by me, and to the best of my knowledge and belief, is true and correct and to the provisions of the NIRC and the regulations issued under the authority thereof; that the information contained herein completely reflect all income payments with the corresponding taxes withheld from payees are duly remitted to the BIR and proper Certificate of Creditable Withholding Tax at Source (BIR Form 2307) have been issued to payees; that the information appearing herein that be consistent with the total amount remitted and that income instant information shall result to denial of the claims for expenses.
                </p>
            </div>

            {/* Signature Area (Optional, not in screenshot but usually present) */}
            <div className="mt-12 flex justify-end">
                <div className="text-center w-64 border-t border-black pt-2">
                    <p className="font-bold uppercase">{data?.[0]?.Approver || '____________________'}</p>
                    <p className="text-[8px]">{data?.[0]?.Position || 'Authorized Representative'}</p>
                </div>
            </div>
        </div>
    );
});

AlphalistPrintView.displayName = 'AlphalistPrintView';

export default AlphalistPrintView;
