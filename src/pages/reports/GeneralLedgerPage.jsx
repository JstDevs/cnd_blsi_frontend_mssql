import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GeneralLedgerForm from '../../components/forms/GeneralLedgerForm';
import DataTable from '../../components/common/DataTable';
import {
  fetchGeneralLedgers,
  resetGeneralLedgerState,
} from '../../features/reports/generalLedgerSlice';
import { fetchFunds } from '../../features/budget/fundsSlice';
import { fetchAccounts } from '../../features/settings/chartOfAccountsSlice';
import toast from 'react-hot-toast';
const API_URL = import.meta.env.VITE_API_URL;

function GeneralLedgerPage() {
  const dispatch = useDispatch();

  const { generalLedgers, isLoading, error } = useSelector(
    (state) => state.generalLedger
  );
  const { funds } = useSelector((state) => state.funds);
  const { accounts } = useSelector((state) => state.chartOfAccounts);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  useEffect(() => {
    dispatch(resetGeneralLedgerState());
    dispatch(fetchFunds());
    dispatch(fetchAccounts());
  }, [dispatch]);

  // Table columns definition
  const columns = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
    },
    {
      key: 'ap_ar',
      header: 'AP AR',
      sortable: true,
    },
    {
      key: 'fund',
      header: 'Fund',
      sortable: true,
    },
    {
      key: 'account_name',
      header: 'Account Name',
      sortable: true,
    },
    {
      key: 'account_code',
      header: 'Account Code',
      sortable: true,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
    },
    {
      key: 'ledger_item',
      header: 'Ledger Item',
      sortable: true,
    },
    {
      key: 'invoice_number',
      header: 'Invoice Number',
      sortable: true,
    },
    {
      key: 'account_code_display',
      header: 'Account Code Display',
      sortable: true,
    },
    {
      key: 'account_name_display',
      header: 'Account Name Display',
      sortable: true,
    },
    {
      key: 'debit',
      header: 'Debit',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'credit',
      header: 'Credit',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'balance',
      header: 'Balance',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'municipality',
      header: 'Municipality',
      sortable: true,
    },
  ];

  // Handle export to Excel
  const handleExport = async (values) => {
    // console.log({ values });
    try {
      const response = await fetch(`${API_URL}/generalLedger/exportExcel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Server response was not ok');

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = `General_Ledger.xlsx`;
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
      toast.error(err.message || 'Failed to export general ledger');
    }
  };

  // Handle view to Excel
  const handleView = (values) => {
    dispatch(fetchGeneralLedgers(values));
  };

  return (
    <div>
      <div className="page-header">
        <h1>General Ledger</h1>
        <p>Generate general ledger reports.</p>
      </div>

      <div className="mt-4 p-3 sm:p-6 bg-white rounded-md shadow">
        <GeneralLedgerForm
          funds={funds}
          accountOptions={accounts.map((acc) => ({
            value: acc.ID,
            label: `${acc.AccountCode} - ${acc.Name}`,
          }))}
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
          data={generalLedgers}
          loading={isLoading}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default GeneralLedgerPage;
