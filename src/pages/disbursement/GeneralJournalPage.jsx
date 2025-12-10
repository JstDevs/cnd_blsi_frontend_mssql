import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GeneralJournalForm from '../../components/forms/GeneralJournalForm';
import DataTable from '../../components/common/DataTable';
import {
  fetchGeneralJournals,
  resetGeneralJournalState,
} from '../../features/disbursement/generalJournalSlice';
import { fetchFunds } from '../../features/budget/fundsSlice';
import toast from 'react-hot-toast';

function GeneralJournalPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const { generalJournals, isLoading, error } = useSelector(
    (state) => state.generalJournal
  );
  const { funds } = useSelector((state) => state.funds);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  useEffect(() => {
    dispatch(resetGeneralJournalState()); // Reset state on mount
    dispatch(fetchFunds());
  }, [dispatch]);

  // Table columns definition
  const columns = [
    {
      key: 'Date',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'VoucherNo',
      header: 'Voucher No',
      sortable: true,
    },
    {
      key: 'Remarks',
      header: 'Remarks',
      sortable: true,
    },
    {
      key: 'AccountCode',
      header: 'Account Code',
      sortable: true,
    },
    {
      key: 'S/L',
      header: 'S/L',
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
  ];

  // Handle export to Excel
  const handleExport = async (values) => {
    try {
      const response = await fetch(`${API_URL}/generalJournal/exportExcel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          startDate: values.startDate,
          endDate: values.endDate,
          fundID: values.fundID,
        }),
      });

      if (!response.ok) throw new Error('Server response was not ok');

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = `General_Journal.xlsx`;
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
      toast.error(err.message || 'Failed to export general journal');
    }
  };

  // Handle view to Excel
  const handleView = (values) => {
    dispatch(fetchGeneralJournals(values));
  };

  return (
    <div>
      <div className="page-header">
        <h1>General Journal</h1>
        <p>Generate general journal reports.</p>
      </div>

      <div className="mt-4 p-3 sm:p-6 bg-white rounded-md shadow">
        <GeneralJournalForm
          funds={funds}
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
          data={generalJournals}
          loading={isLoading}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default GeneralJournalPage;
