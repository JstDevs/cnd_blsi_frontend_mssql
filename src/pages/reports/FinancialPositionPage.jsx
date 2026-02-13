import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FinancialPositionForm from '../../components/forms/FinancialPositionForm';
import DataTable from '../../components/common/DataTable';
import {
    fetchFinancialPositionData,
    resetFinancialPositionState,
} from '../../features/reports/financialPositionSlice';
import { fetchFunds } from '../../features/budget/fundsSlice';
import { fetchEmployees } from '@/features/settings/employeeSlice';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';
import toast from 'react-hot-toast';
import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import FinancialPositionPrintView from './FinancialPositionPrintView';

function FinancialPositionPage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch();
    const printRef = useRef();

    const { financialPositionData, isLoading, error } = useSelector(
        (state) => state.financialPosition
    );
    const { funds } = useSelector((state) => state.funds);
    const { employees } = useSelector((state) => state.employees);
    const { fiscalYears } = useSelector((state) => state.fiscalYears);

    const [formValues, setFormValues] = useState(null);

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '-';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    useEffect(() => {
        dispatch(resetFinancialPositionState());
        dispatch(fetchFunds());
        dispatch(fetchEmployees());
        dispatch(fetchFiscalYears());
    }, [dispatch]);

    const columns = [
        {
            key: 'AccountCode',
            header: 'Account Code',
            sortable: true,
        },
        {
            key: 'AccountName',
            header: 'Account Name',
            sortable: true,
        },
        {
            key: 'CurrentYearBalance',
            header: 'Current Year',
            sortable: true,
            render: (value) => formatCurrency(value),
            className: 'text-right',
        },
        {
            key: 'NonCurrentYearBalance',
            header: 'Non-Current Year',
            sortable: true,
            render: (value) => formatCurrency(value),
            className: 'text-right',
        },
        {
            key: 'IncreaseDecrease',
            header: 'Increase / (Decrease)',
            sortable: true,
            render: (_, row) => formatCurrency((row.CurrentYearBalance || 0) - (row.NonCurrentYearBalance || 0)),
            className: 'text-right font-bold',
        },
    ];

    const handleExport = async (values) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(
                `${API_URL}/financialPositionReport/exportExcel`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(values),
                }
            );

            if (!response.ok) throw new Error('Server response was not ok');

            const blob = await response.blob();
            const disposition = response.headers.get('Content-Disposition');
            let filename = `Statement_of_Financial_Position.xlsx`;
            if (disposition && disposition.includes('filename=')) {
                filename = disposition.split('filename=')[1].replace(/['"]/g, '');
            }

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export failed:', err);
            toast.error(err.message || 'Failed to export report');
        }
    };

    const handleView = (values) => {
        setFormValues(values);
        dispatch(fetchFinancialPositionData(values));
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: 'Statement_of_Financial_Position',
    });

    const handleGenerateJournal = (values) => {
        if (!financialPositionData || financialPositionData.length === 0) {
            toast.error('No data to generate journal. Please view the report first.');
            return;
        }
        setFormValues(values);
        handlePrint();
    };

    // Helper to get names for print view
    const getCurrentYearName = () => fiscalYears.find(y => y.ID === formValues?.currentYearID)?.Name;
    const getNonCurrentYearName = () => fiscalYears.find(y => y.ID === formValues?.nonCurrentYearID)?.Name;
    const getFundName = () => funds.find(f => f.ID === formValues?.fundID)?.Name;
    const getApproverName = () => {
        const emp = employees.find(e => e.ID === formValues?.approverID);
        return emp ? `${emp.FirstName} ${emp.LastName}` : '';
    };

    return (
        <div className="space-y-6">
            <div className="page-header">
                <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-primary-600 pl-4">
                    Financial Position
                </h1>
                <p className="text-gray-600 ml-5">Generate and view statement of financial position.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 overflow-visible">
                <FinancialPositionForm
                    funds={funds}
                    employees={employees}
                    fiscalYears={fiscalYears}
                    onExportExcel={handleExport}
                    onView={handleView}
                    onGenerateJournal={handleGenerateJournal}
                />
            </div>

            {error && (
                <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                    <p className="text-error-700 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-error-500 rounded-full"></span>
                        {error}
                    </p>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <DataTable
                    columns={columns}
                    data={financialPositionData}
                    loading={isLoading}
                    pagination={true}
                />
            </div>

            {/* Hidden Print View */}
            <div className="hidden">
                <FinancialPositionPrintView
                    ref={printRef}
                    data={financialPositionData}
                    formValues={formValues}
                    currentYearName={getCurrentYearName()}
                    nonCurrentYearName={getNonCurrentYearName()}
                    fundName={getFundName()}
                    approverName={getApproverName()}
                />
            </div>
        </div>
    );
}

export default FinancialPositionPage;
