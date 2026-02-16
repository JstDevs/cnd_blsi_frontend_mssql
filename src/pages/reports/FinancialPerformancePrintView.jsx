import React, { forwardRef } from 'react';

// ------------------------------------- FINANCIAL PERFORMANCE PRINT VIEW ------------------------------------

const FinancialPerformancePrintView = forwardRef(({ data, formValues, fiscalYearName, fundName, approverName }, ref) => {
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0.00';
        return Number(amount).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // logic to group revenue and expenses
    const categorizedData = (data || []).reduce((acc, item) => {
        const firstDigit = String(item.AccountCode)[0];
        const category = item.Category || 'Other';

        if (firstDigit === '4') {
            if (!acc.revenue[category]) acc.revenue[category] = [];
            acc.revenue[category].push(item);
        } else if (firstDigit === '5') {
            if (category.toLowerCase().includes('transfers')) {
                if (!acc.transfers[category]) acc.transfers[category] = [];
                acc.transfers[category].push(item);
            } else {
                if (!acc.expenses[category]) acc.expenses[category] = [];
                acc.expenses[category].push(item);
            }
        }
        return acc;
    }, { revenue: {}, expenses: {}, transfers: {} });

    const calculateGroupTotal = (group) => {
        return Object.values(group).flat().reduce((sum, item) => sum + (Number(item.Amount) || 0), 0);
    };

    const totalRevenue = calculateGroupTotal(categorizedData.revenue);
    const totalExpenses = calculateGroupTotal(categorizedData.expenses);
    const surplusFromOperations = totalRevenue - totalExpenses;
    const totalTransfers = calculateGroupTotal(categorizedData.transfers);
    const netSurplus = surplusFromOperations - totalTransfers;

    return (
        <div ref={ref} className="p-12 text-black bg-white min-h-screen font-serif text-sm print:p-8">
            {/* Boxed Header */}
            <div className="border border-orange-300 p-4 text-center mb-10 mx-auto max-w-2xl rounded-lg">
                <h1 className="text-base font-bold uppercase tracking-wider">Municipality of {data?.[0]?.Municipality || 'LGU'}</h1>
                <h2 className="text-base font-bold uppercase tracking-wider">Statement of Financial Performance</h2>
                <h3 className="text-base font-bold uppercase tracking-wider">{fundName || 'General Fund'}</h3>
                <p className="mt-2">For the Year Ended {formValues?.dateTo ? new Date(formValues.dateTo).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'December 31, 2025'}</p>
                <p className="italic">(In thousands of Pesos)</p>
            </div>
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex justify-end mb-4 pr-4 border-b border-black">
                    <span className="font-bold">{fiscalYearName || '2024'}</span>
                </div>
                {/* Revenue Section */}
                <div className="mb-6">
                    <h4 className="font-bold mb-2">Revenue</h4>
                    {Object.entries(categorizedData.revenue).map(([cat, items]) => (
                        <div key={cat} className="flex justify-between pl-8 py-0.5">
                            <span>{cat}</span>
                            <span className="pr-4">{formatCurrency(items.reduce((s, i) => s + (Number(i.Amount) || 0), 0))}</span>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold mt-1 border-t border-black pt-1">
                        <span className="uppercase">Total Revenue</span>
                        <span className="pr-4 border-b-2 border-black">{formatCurrency(totalRevenue)}</span>
                    </div>
                </div>
                {/* Expenses Section */}
                <div className="mb-6">
                    <h4 className="font-bold mb-2">Less: Current Operating Expenses</h4>
                    {Object.entries(categorizedData.expenses).map(([cat, items]) => (
                        <div key={cat} className="flex justify-between pl-8 py-0.5">
                            <span>{cat}</span>
                            <span className="pr-4">{formatCurrency(items.reduce((s, i) => s + (Number(i.Amount) || 0), 0))}</span>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold mt-1 border-t border-black pt-1">
                        <span className="uppercase">Current Operating Expenses</span>
                        <span className="pr-4 border-b-2 border-black">{formatCurrency(totalExpenses)}</span>
                    </div>
                </div>
                {/* Surplus from Operations */}
                <div className="mb-6 flex justify-between font-bold text-base">
                    <span className="uppercase">Surplus (Deficit) from Current Operations</span>
                    <span className="pr-4">{formatCurrency(surplusFromOperations)}</span>
                </div>
                {/* Transfers Section */}
                <div className="mb-6">
                    <h4 className="italic pl-4 text-xs mb-1">Add (Deduct):</h4>
                    {Object.entries(categorizedData.transfers).map(([cat, items]) => (
                        <div key={cat} className="flex justify-between pl-12 py-0.5">
                            <span>{cat}</span>
                            <span className="pr-4">{formatCurrency(items.reduce((s, i) => s + (Number(i.Amount) || 0), 0))}</span>
                        </div>
                    ))}
                </div>
                {/* Net Surplus */}
                <div className="mb-10 flex justify-between font-bold border-t border-black pt-2">
                    <span className="uppercase">Surplus (Deficit) for the period</span>
                    <span className="pr-4 border-b-4 border-double border-black">{formatCurrency(netSurplus)}</span>
                </div>
                {/* Signatories */}
                <div className="mt-20">
                    <div className="flex flex-col items-end mr-12">
                        <div className="text-left">
                            <p className="mb-4">Certified Correct:</p>
                            <p className="font-bold uppercase mt-2 mb-0">{approverName || 'ACCOUNTING S. HEAD'}</p>
                            <p className="italic text-xs">Accounting Head</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

});

FinancialPerformancePrintView.displayName = 'FinancialPerformancePrintView';
export default FinancialPerformancePrintView;
