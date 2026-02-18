import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChangeInEquityForm from '../../components/forms/ChangeInEquityForm';
import DataTable from '../../components/common/DataTable';
import {
    fetchChangeInEquity,
    resetEquityState,
} from '../../features/reports/changeInEquitySlice';
import { fetchFunds } from '../../features/budget/fundsSlice';
import { fetchEmployees } from '@/features/settings/employeeSlice';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';
import toast from 'react-hot-toast';

function ChangeInEquityPage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch();

    const { equityData, isLoading, error } = useSelector(
        (state) => state.changeInEquity
    );
    const { funds } = useSelector((state) => state.funds);
    const { employees } = useSelector((state) => state.employees);
    const { fiscalYears } = useSelector((state) => state.fiscalYears);

    const [formValues, setFormValues] = useState(null);

    useEffect(() => {
        dispatch(resetEquityState());
        dispatch(fetchFunds());
        dispatch(fetchEmployees());
        dispatch(fetchFiscalYears());
    }, [dispatch]);

    const columns = [
        { key: 'StartDate', header: 'Start Date', sortable: true },
        { key: 'EndDate', header: 'End Date', sortable: true },
        { key: 'CurrentYear', header: 'Current Year', sortable: true },
        { key: 'NonCurrentYear', header: 'Non Current Year', sortable: true },
        { key: 'RowNum', header: 'RowNum', sortable: true },
        { key: 'Ncurbeg', header: 'Ncurbeg', sortable: true },
        { key: 'RowNum1', header: 'RowNum1', sortable: true },
        { key: 'Curbeg', header: 'Curbeg', sortable: true },
        { key: 'RowNum2', header: 'RowNum2', sortable: true },
        { key: 'AL1', header: 'AL1', sortable: true },
        { key: 'RowNum3', header: 'RowNum3', sortable: true },
        { key: 'EQL1', header: 'EQL1', sortable: true },
        { key: 'RowNum4', header: 'RowNum4', sortable: true },
        { key: 'IL1', header: 'IL1', sortable: true },
        { key: 'RowNum5', header: 'RowNum5', sortable: true },
        { key: 'EXL1', header: 'EXL1', sortable: true },
        { key: 'RowNum6', header: 'RowNum6', sortable: true },
        { key: 'AL2', header: 'AL2', sortable: true },
        { key: 'RowNum7', header: 'RowNum7', sortable: true },
        { key: 'EQL2', header: 'EQL2', sortable: true },
        { key: 'RowNum8', header: 'RowNum8', sortable: true },
        { key: 'IL2', header: 'IL2', sortable: true },
        { key: 'RowNum9', header: 'RowNum9', sortable: true },
        { key: 'EXL2', header: 'EXL2', sortable: true },
        { key: 'RowNum10', header: 'RowNum10', sortable: true },
    ];

    const handleExport = async (values) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(
                `${API_URL}/changeInEquityReport/exportExcel`,
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
            let filename = `Statement_of_Changes_in_Equity.xlsx`;
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
        dispatch(fetchChangeInEquity(values));
    };

    const handleGenerateFSP = (values) => {
        toast.success('Generate FSP clicked (View report first)');
        // Implement print/pdf logic here if needed, similar to FinancialPositionPage
    };

    return (
        <div className="space-y-6">
            <div className="page-header">
                <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-primary-600 pl-4">
                    Change in Equity
                </h1>
                <p className="text-gray-600 ml-5">Generate and view statement of changes in equity.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 overflow-visible">
                <ChangeInEquityForm
                    funds={funds}
                    employees={employees}
                    fiscalYears={fiscalYears}
                    onExportExcel={handleExport}
                    onView={handleView}
                    onGenerateJournal={handleGenerateFSP}
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
                    data={equityData}
                    loading={isLoading}
                    pagination={true}
                />
            </div>
        </div>
    );
}

export default ChangeInEquityPage;
