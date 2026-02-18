import React, { forwardRef } from 'react';

const ChangeInEquityPrintView = forwardRef(({ data, formValues, currentYearName, nonCurrentYearName, fundName, approverName }, ref) => {
    const reportData = data && data.length > 0 ? data[0] : {};

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0.00';
        return Number(amount).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div ref={ref} className="p-12 text-black bg-white min-h-screen font-serif text-[13px] print:p-8">
            {/* Header */}
            <div className="text-center mb-12">
                <p className="text-sm italic">Republic of the Philippines</p>
                <p className="text-sm italic">Province of {reportData.Province || ''}</p>
                <div className="border border-orange-200 inline-block px-10 py-1 my-2 rounded-full">
                    <h1 className="text-base font-bold uppercase tracking-widest">MUNICIPALITY OF {reportData.Municipality || ''}</h1>
                </div>
                <h2 className="text-base font-bold uppercase tracking-tight">CONSOLIDATED STATEMENT OF CHANGES IN NET ASSETS / EQUITY</h2>
                <p className="text-sm italic">For the Year Ended {formatDate(formValues?.dateTo)}</p>
                <p className="text-sm italic">(With Comparative Figures for {nonCurrentYearName || ''})</p>
            </div>

            <div className="w-full max-w-4xl mx-auto space-y-8">
                <div>
                    <h3 className="font-bold text-sm mb-6 underline">NET ASSETS / EQUITY</h3>

                    <div className="space-y-1">
                        {/* Balance at beginning */}
                        <div className="flex justify-between font-bold">
                            <span className="w-2/3">Balance at {formatDate(formValues?.dateFrom)}</span>
                            <div className="w-1/3 flex justify-between px-4">
                                <span>{formatCurrency(reportData.Curbeg)}</span>
                                <span>{formatCurrency(reportData.Ncurbeg)}</span>
                            </div>
                        </div>

                        {/* Adjustments */}
                        <div className="pl-8">
                            <p className="font-italic italic">Add (Deduct)</p>
                            <div className="flex justify-between pl-4">
                                <span className="w-2/3">Change in Accounting Policy</span>
                                <div className="w-1/3 flex justify-between px-4 border-b border-black">
                                    <span>{formatCurrency(reportData.AL1)}</span>
                                    <span>{formatCurrency(reportData.AL2)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between pl-4">
                                <span className="w-2/3">Prior Period Errors</span>
                                <div className="w-1/3 flex justify-between px-4 border-b border-black">
                                    <span>{formatCurrency(reportData.EQL1)}</span>
                                    <span>{formatCurrency(reportData.EQL2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Restated Balance */}
                        <div className="flex justify-between font-bold pt-2">
                            <span className="w-2/3">Restated Balance</span>
                            <div className="w-1/3 flex justify-between px-4 border-b-2 border-double border-black">
                                <span>{formatCurrency(reportData.Curbeg + reportData.AL1 + reportData.EQL1)}</span>
                                <span>{formatCurrency(reportData.Ncurbeg + reportData.AL2 + reportData.EQL2)}</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <p className="font-bold">Add (Deduct) Changes in net assets/equity during the Year</p>
                            <div className="pl-8 space-y-1">
                                <div className="flex justify-between">
                                    <span className="w-2/3">Adjustment of net revenue recognized directly in net assets / equity</span>
                                    <div className="w-1/3 flex justify-between px-4">
                                        <span>{formatCurrency(reportData.IL1)}</span>
                                        <span>{formatCurrency(reportData.IL2)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="w-2/3">Unrealized Gain/(Loss) from Changes in the Fair Value of Financial Assets</span>
                                    <div className="w-1/3 flex justify-between px-4">
                                        <span>{formatCurrency(reportData.EXL1)}</span>
                                        <span>{formatCurrency(reportData.EXL2)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="w-2/3">Surplus (Deficit) for the Period</span>
                                    <div className="w-1/3 flex justify-between px-4">
                                        <span>{formatCurrency(reportData.RowNum7)}</span>
                                        <span>{formatCurrency(reportData.RowNum8)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total recognized */}
                        <div className="flex justify-between font-bold pt-2">
                            <span className="w-2/3 pl-8">Total recognized revenue and expenses for the period</span>
                            <div className="w-1/3 flex justify-between px-4 border-b-2 border-black">
                                <span>{formatCurrency(reportData.IL1 + reportData.EXL1 + reportData.RowNum7)}</span>
                                <span>{formatCurrency(reportData.IL2 + reportData.EXL2 + reportData.RowNum8)}</span>
                            </div>
                        </div>

                        {/* Final Balance */}
                        <div className="flex justify-between font-bold pt-4">
                            <span className="w-2/3">Balance at {formatDate(formValues?.dateTo)}</span>
                            <div className="w-1/3 flex justify-between px-4 border-b-4 border-double border-black">
                                <span>{formatCurrency((reportData.Curbeg + reportData.AL1 + reportData.EQL1) + (reportData.IL1 + reportData.EXL1 + reportData.RowNum7))}</span>
                                <span>{formatCurrency((reportData.Ncurbeg + reportData.AL2 + reportData.EQL2) + (reportData.IL2 + reportData.EXL2 + reportData.RowNum8))}</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Signatories Section - following same pattern if applicable */}
                <div className="mt-20">
                    <div className="flex justify-end">
                        <div className="w-64">
                            <p className="mb-8 italic">Certified Correct:</p>
                            <p className="font-bold text-center border-b border-black">{approverName || ''}</p>
                            <p className="text-center text-xs">Accounting Head</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

ChangeInEquityPrintView.displayName = 'ChangeInEquityPrintView';

export default ChangeInEquityPrintView;
