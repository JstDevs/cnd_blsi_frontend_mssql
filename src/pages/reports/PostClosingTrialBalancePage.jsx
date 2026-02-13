import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostClosingForm from '../../components/forms/PostClosingForm';
import DataTable from '../../components/common/DataTable';
import {
    fetchPostClosingData,
    resetPostClosingState,
} from '../../features/reports/postClosingSlice';
import { fetchFunds } from '../../features/budget/fundsSlice';
import { fetchEmployees } from '@/features/settings/employeeSlice';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';
import toast from 'react-hot-toast';

function PostClosingTrialBalancePage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const dispatch = useDispatch();

    const { postClosingData, isLoading, error } = useSelector(
        (state) => state.postClosing
    );
    const { funds } = useSelector((state) => state.funds);
    const { employees } = useSelector((state) => state.employees);
    const { fiscalYears } = useSelector((state) => state.fiscalYears);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    useEffect(() => {
        dispatch(resetPostClosingState());
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
            key: 'Debit',
            header: 'Debit',
            sortable: true,
            render: (value) => formatCurrency(value),
            className: 'text-right',
        },
        {
            key: 'Credit',
            header: 'Credit',
            sortable: true,
            render: (value) => formatCurrency(value),
            className: 'text-right',
        },
        {
            key: 'Balance',
            header: 'Balance',
            sortable: true,
            render: (_, row) => formatCurrency((row.Debit || 0) - (row.Credit || 0)),
            className: 'text-right font-bold',
        },
    ];

    const handleExport = async (values) => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await fetch(
                `${API_URL}/postClosingReport/exportExcel`,
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
            let filename = `Post_Closing_Trial_Balance.xlsx`;
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
        dispatch(fetchPostClosingData(values));
    };

    return (
        <div className="space-y-6">
            <div className="page-header">
                <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-primary-600 pl-4">
                    Post-Closing
                </h1>
                <p className="text-gray-600 ml-5">Generate and view post-closing reports.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 overflow-visible">
                <PostClosingForm
                    funds={funds}
                    employees={employees}
                    fiscalYears={fiscalYears}
                    onExportExcel={handleExport}
                    onView={handleView}
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
                    data={postClosingData}
                    loading={isLoading}
                    pagination={true}
                />
            </div>
        </div>
    );
}

export default PostClosingTrialBalancePage;
