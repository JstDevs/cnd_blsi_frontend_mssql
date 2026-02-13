import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CashFlowForm from '../../components/forms/CashFlowForm';
import DataTable from '../../components/common/DataTable';
import {
    fetchCashFlowData,
    resetCashFlowState,
} from '../../features/reports/cashFlowSlice';
import { fetchFunds } from '../../features/budget/fundsSlice';
import { fetchEmployees } from '@/features/settings/employeeSlice';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';
import toast from 'react-hot-toast';
import { useReactToPrint } from 'react-to-print';
import CashFlowPrintView from './CashFlowPrintView';

function CashFlowPage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch();
    const printRef = useRef();

    const { cashFlowData, isLoading, error } = useSelector(
        (state) => state.cashFlow
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
        dispatch(resetCashFlowState());
        dispatch(fetchFunds());
        dispatch(fetchEmployees());
        dispatch(fetchFiscalYears());
    }, [dispatch]);

    const columns = [
        { key: 'Funds', header: 'Funds', sortable: true },
        { key: 'Type', header: 'Type', sortable: true },
        { key: 'Name', header: 'Name', sortable: true },
        { key: 'NormalBalance', header: 'Normal Balance', sortable: true },
        { key: 'Flow', header: 'Flow', sortable: true },
        {
            key: 'Amount',
            header: 'Amount',
            sortable: true,
            render: (value) => formatCurrency(value),
            className: 'text-right'
        },
        { key: 'Equity', header: 'Equity', sortable: true },
        {
            key: 'Beginning',
            header: 'Beginning',
            sortable: true,
            render: (value) => formatCurrency(value),
            className: 'text-right'
        },
        { key: 'EndDate', header: 'End Date', sortable: true },
        { key: 'FullName', header: 'Full Name', sortable: true },
        { key: 'Position', header: 'Position', sortable: true },
    ];

    const handleExport = async (values) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(
                `${API_URL}/cashFlowReport/exportExcel`,
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
            let filename = `Statement_of_Cash_Flows.xlsx`;
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
        dispatch(fetchCashFlowData(values));
    };

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: 'Statement_of_Cash_Flows',
    });

    const handleGenerateFSP = (values) => {
        if (!cashFlowData || cashFlowData.length === 0) {
            toast.error('No data to generate report. Please view the report first.');
            return;
        }
        setFormValues(values);
        handlePrint();
    };

    const getFiscalYearName = () => fiscalYears.find(y => y.ID === formValues?.fiscalYearID)?.Name;
    const getFundName = () => formValues?.fundID === 'all' ? 'All Funds' : funds.find(f => f.ID === formValues?.fundID)?.Name;
    const getApproverName = () => {
        const emp = employees.find(e => e.ID === formValues?.approverID);
        return emp ? `${emp.FirstName} ${emp.LastName}` : '';
    };

    return (
        <div className="space-y-6">
            <div className="page-header">
                <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-primary-600 pl-4">
                    Cash Flow
                </h1>
                <p className="text-gray-600 ml-5">Generate and view statement of cash flows.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 overflow-visible">
                <CashFlowForm
                    funds={funds}
                    employees={employees}
                    fiscalYears={fiscalYears}
                    onExportExcel={handleExport}
                    onView={handleView}
                    onGenerateFSP={handleGenerateFSP}
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
                    data={cashFlowData}
                    loading={isLoading}
                    pagination={true}
                />
            </div>

            <div className="hidden">
                <CashFlowPrintView
                    ref={printRef}
                    data={cashFlowData}
                    formValues={formValues}
                    fiscalYearName={getFiscalYearName()}
                    fundName={getFundName()}
                    approverName={getApproverName()}
                />
            </div>
        </div>
    );
}

export default CashFlowPage;
