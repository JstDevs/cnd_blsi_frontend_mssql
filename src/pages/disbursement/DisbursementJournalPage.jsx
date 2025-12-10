import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DisbursementJournalForm from '../../components/forms/DisbursementJournalForm';
import DataTable from '../../components/common/DataTable';
import {
  fetchDisbursementJournals,
  resetDisbursementJournalState,
} from '../../features/disbursement/disbursementJournalSlice';
import { fetchAccounts } from '../../features/settings/chartOfAccountsSlice';
import { fetchFunds } from '../../features/budget/fundsSlice';
import axiosInstance from '@/utils/axiosInstance';
import toast from 'react-hot-toast';

function DisbursementJournalPage() {
  const API_URL = import.meta.env.VITE_API_URL;

  const dispatch = useDispatch();
  const { disbursementJournals, isLoading, error } = useSelector(
    (state) => state.disbursementJournal
  );
  const chartOfAccounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );
  const { funds } = useSelector((state) => state.funds);

  const disbursementTypes = [
    { value: 'Check', label: 'Check' },
    { value: 'Collection', label: 'Collection' },
    { value: 'Cash', label: 'Cash' },
    { value: 'General', label: 'General' },
  ];

  useEffect(() => {
    dispatch(resetDisbursementJournalState()); // Reset state on mount
    dispatch(fetchAccounts());
    dispatch(fetchFunds());
  }, [dispatch]);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Table columns definition
  const columns = [
    {
      key: 'Municipality',
      header: 'Municipality',
      sortable: true,
    },
    {
      key: 'Funds',
      header: 'Funds',
      sortable: true,
    },
    {
      key: 'Date',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'CheckNo',
      header: 'Check No.',
      sortable: true,
    },
    {
      key: 'VoucherNo',
      header: 'Voucher No.',
      sortable: true,
    },
    {
      key: 'JEVNo',
      header: 'JEV No.',
      sortable: true,
    },
    {
      key: 'Claimant',
      header: 'Claimant',
      sortable: true,
    },
    {
      key: 'Particulars',
      header: 'Particulars',
      sortable: true,
    },
    {
      key: 'AccountCode',
      header: 'Account Code',
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
      key: 'Approver',
      header: 'Approver',
      sortable: true,
    },
    {
      key: 'Position',
      header: 'Position',
      sortable: true,
    },
    {
      key: 'StartDate',
      header: 'Start Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'EndDate',
      header: 'End Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  // Handle export to Excel
  const handleExport = async (values) => {
    console.log({ values });
    try {
      const response = await fetch(
        `${API_URL}/disbursementJournals/exportExcel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            DisbursementType: values.DisbursementType,
            DateStart: values.DateStart,
            DateEnd: values.DateEnd,
            FundID: values.FundID,
            ChartOfAccountID: values.ChartOfAccountID,
          }),
        }
      );
      console.log(response);
      if (!response.ok) throw new Error('Server response was not ok');

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = `Disbursement_Journals_${values.DisbursementType}.xlsx`;
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/['"]/g, '');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Optional: custom file name
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      toast.error(err.message || 'Failed to export disbursement journal');
    }
  };

  // Handle view to Excel
  const handleView = (values) => {
    console.log(values);
    dispatch(fetchDisbursementJournals(values));
  };

  return (
    <div>
      <div className="page-header">
        <h1>Disbursement Journal</h1>
        <p>Generate disbursement journal reports.</p>
      </div>

      <div className="mt-4 p-3 sm:p-6 bg-white rounded-md shadow">
        <DisbursementJournalForm
          chartOfAccounts={chartOfAccounts}
          funds={funds}
          disbursementTypes={disbursementTypes}
          onExportExcel={handleExport}
          onView={handleView}
          onClose={() => {}}
        />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-md">
          <p className="text-error-700">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={disbursementJournals}
          loading={isLoading}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default DisbursementJournalPage;
