import React, { forwardRef } from 'react';

const CashFlowPrintView = forwardRef(({ data, formValues, fiscalYearName, fundName, approverName }, ref) => {

    const formatCurrency = (amount) => {
        return Number(amount || 0).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Group data for the structured view
    const operatingActivities = data.filter(item => item.Type === 'Operating');
    const investingActivities = data.filter(item => item.Type === 'Investing');
    const financingActivities = data.filter(item => item.Type === 'Financing');

    const sumAmount = (list) => list.reduce((sum, item) => sum + (Number(item.Amount) || 0), 0);

    const netOperating = sumAmount(operatingActivities);
    const netInvesting = sumAmount(investingActivities);
    const netFinancing = sumAmount(financingActivities);
    const totalCashProvided = netOperating + netInvesting + netFinancing;
    const cashBeginning = Number(data?.[0]?.Beginning) || 0;
    const cashEnd = totalCashProvided + cashBeginning;

    const renderSection = (title, items, netValue) => (
        <div className="mb-4">
            <h4 className="font-bold underline">{title}</h4>
            <div className="pl-4">
                {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1">
                        <span>{item.Name}</span>
                        <span>{formatCurrency(item.Amount)}</span>
                    </div>
                ))}
                <div className="flex justify-between font-bold border-t border-black mt-1">
                    <span>Net Cash Flows From {title}</span>
                    <span>{formatCurrency(netValue)}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div ref={ref} className="p-12 text-black bg-white min-h-screen font-serif">
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-lg font-bold">Municipality of {data?.[0]?.Municipality || 'LGU'}</h2>
                <h1 className="text-xl font-bold uppercase">STATEMENT OF CASH FLOWS</h1>
                <p className="text-sm italic">As of {formValues?.dateTo || 'N/A'}</p>
            </div>

            {/* Structured Report Table Layout (Simplified for Print) */}
            <div className="max-w-3xl mx-auto border-2 border-black p-6">
                {renderSection('Operating Activities', operatingActivities, netOperating)}
                {renderSection('Investing Activities', investingActivities, netInvesting)}
                {renderSection('Financing Activities', financingActivities, netFinancing)}

                <div className="mt-8 space-y-2">
                    <div className="flex justify-between font-bold">
                        <span>Total Cash Provided by Operating, Investing and Financing Activities</span>
                        <span className="border-b-2 border-black">{formatCurrency(totalCashProvided)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Add: Cash at the Beginning of the Year</span>
                        <span>{formatCurrency(cashBeginning)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-black">
                        <span>Cash Balance at the End of the Year</span>
                        <span className="border-b-4 border-double border-black">{formatCurrency(cashEnd)}</span>
                    </div>
                </div>
            </div>

            {/* Signatory */}
            <div className="mt-16 mr-12 text-right">
                <p className="mb-12">Certified Correct:</p>
                <div className="inline-block text-center">
                    <p className="font-bold border-b border-black px-8">{approverName || '____________________'}</p>
                    <p className="text-xs uppercase">{data?.[0]?.Position || 'Budget Head'}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-[10px] text-gray-500 italic">
                <p>Printed on: {new Date().toLocaleString()}</p>
                <p>Fund: {fundName}</p>
            </div>
        </div>
    );
});

CashFlowPrintView.displayName = 'CashFlowPrintView';

export default CashFlowPrintView;
