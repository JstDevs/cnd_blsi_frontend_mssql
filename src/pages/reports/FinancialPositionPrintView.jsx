import React, { forwardRef } from 'react';

const FinancialPositionPrintView = forwardRef(({ data, formValues, currentYearName, nonCurrentYearName, fundName, approverName }, ref) => {

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0.00';
        return Number(amount).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // Helper to group data by category and sub-category
    const groupData = (items) => {
        const groups = {
            assets: { label: 'ASSETS', subGroups: {} },
            liabilities: { label: 'LIABILITIES', subGroups: {} },
            equity: { label: 'NET ASSETS / EQUITY', subGroups: {} }
        };

        items.forEach(item => {
            const firstDigit = String(item.AccountCode)[0];
            let category = 'assets';
            if (firstDigit === '2') category = 'liabilities';
            if (firstDigit === '3') category = 'equity';

            // Check if backend already provides a 'Category' or 'SubCategory' field
            // If not, we use 'Current Assets' or 'Current Liabilities' as default sub-labels
            const subLabel = item.Category || (category === 'equity' ? '' : `Current ${groups[category].label.charAt(0) + groups[category].label.slice(1).toLowerCase()}`);

            if (!groups[category].subGroups[subLabel]) {
                groups[category].subGroups[subLabel] = [];
            }
            groups[category].subGroups[subLabel].push(item);
        });

        return groups;
    };

    const groupedData = groupData(data || []);

    const calculateSubTotal = (items) => {
        return items.reduce((sum, item) => sum + (Number(item.CurrentYearBalance) || 0), 0);
    };

    const calculateCategoryTotal = (subGroups) => {
        let total = 0;
        Object.values(subGroups).forEach(items => {
            total += calculateSubTotal(items);
        });
        return total;
    };

    const totalAssets = calculateCategoryTotal(groupedData.assets.subGroups);
    const totalLiabilities = calculateCategoryTotal(groupedData.liabilities.subGroups);
    const totalEquity = calculateCategoryTotal(groupedData.equity.subGroups);

    return (
        <div ref={ref} className="p-12 text-black bg-white min-h-screen font-serif text-sm print:p-8">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-base font-bold uppercase tracking-wider">Municipality of {data?.[0]?.Municipality || 'LGU'}</h1>
                <h2 className="text-base font-bold uppercase tracking-wider">Statement of Financial Position</h2>
                <h3 className="text-base font-bold uppercase tracking-wider">{fundName || 'General Fund'}</h3>
                <p className="mt-2">For the Year Ended {formValues?.dateTo ? new Date(formValues.dateTo).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'December 31, 2025'}</p>
                <p className="italic">(In thousands of Pesos)</p>
            </div>

            <div className="w-full max-w-4xl mx-auto">
                {/* Year Label */}
                <div className="flex justify-end mb-4 pr-4">
                    <span className="font-bold">{nonCurrentYearName || '2024'}</span>
                </div>

                {/* ASSETS Section */}
                <div className="mb-6">
                    <h4 className="font-bold uppercase mb-2">ASSETS</h4>
                    {Object.entries(groupedData.assets.subGroups).map(([subLabel, items]) => (
                        <div key={subLabel} className="mb-4">
                            <p className="font-bold italic pl-8 mb-1">{subLabel}</p>
                            {items.map((item, idx) => (
                                <div key={idx} className="flex justify-between pl-12 py-0.5">
                                    <span>{item.AccountName}</span>
                                    <span className="pr-4">{formatCurrency(item.CurrentYearBalance)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between pl-8 mt-1 border-t border-transparent">
                                <span className="font-bold">Total Assets</span>
                                <span className="font-bold pr-4 underline decoration-double">{formatCurrency(calculateSubTotal(items))}</span>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold mt-4">
                        <span className="uppercase">Total Assets</span>
                        <span className="pr-4 underline decoration-double">{formatCurrency(totalAssets)}</span>
                    </div>
                </div>

                {/* LIABILITIES Section */}
                <div className="mb-6">
                    <h4 className="font-bold uppercase mb-2">LIABILITIES</h4>
                    {Object.entries(groupedData.liabilities.subGroups).map(([subLabel, items]) => (
                        <div key={subLabel} className="mb-2">
                            <p className="font-bold italic pl-8 mb-1">{subLabel}</p>
                            {items.map((item, idx) => (
                                <div key={idx} className="flex justify-between pl-12 py-0.5">
                                    <span>{item.AccountName}</span>
                                    <span className="pr-4">{formatCurrency(item.CurrentYearBalance)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between pl-8 mt-1">
                                <span className="font-bold">Total Liabilities</span>
                                <span className="font-bold pr-4 underline decoration-double">{formatCurrency(calculateSubTotal(items))}</span>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold mt-4">
                        <span className="uppercase">Total Liabilities</span>
                        <span className="pr-4 underline decoration-double">{formatCurrency(totalLiabilities)}</span>
                    </div>
                </div>

                {/* NET ASSETS / EQUITY Section */}
                <div className="mb-10">
                    <h4 className="font-bold uppercase mb-2">NET ASSETS / EQUITY</h4>
                    {Object.entries(groupedData.equity.subGroups).map(([subLabel, items]) => (
                        <div key={subLabel}>
                            {items.map((item, idx) => (
                                <div key={idx} className="flex justify-between pl-8 py-0.5">
                                    <span>{item.AccountName}</span>
                                    <span className="pr-4">{formatCurrency(item.CurrentYearBalance)}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="flex justify-between font-bold mt-4">
                        <span className="uppercase">Total Liabilities and Net Assets / Equity</span>
                        <span className="pr-4 underline decoration-double">{formatCurrency(totalLiabilities + totalEquity)}</span>
                    </div>
                </div>

                {/* Signatories */}
                <div className="mt-16 text-sm">
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

FinancialPositionPrintView.displayName = 'FinancialPositionPrintView';

export default FinancialPositionPrintView;
