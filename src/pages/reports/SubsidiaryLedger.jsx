import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SubsidiaryLedgerForm from '../../components/forms/SubsidiaryLedgerForm';
import DataTable from '../../components/common/DataTable';
import {
  fetchSubsidiaryLedgers,
  resetSubsidiaryLedgerState,
} from '../../features/reports/subsidiaryLedgerSlice';
import { fetchFunds } from '../../features/budget/fundsSlice';
import { fetchAccounts } from '../../features/settings/chartOfAccountsSlice';
import toast from 'react-hot-toast';

function SubsidiaryLedger() {
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const { subsidiaryLedgers, isLoading, error } = useSelector(
    (state) => state.subsidiaryLedger
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
    dispatch(resetSubsidiaryLedgerState());
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
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/subsidiaryLeadger/exportExcel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Server response was not ok');

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = `Subsidiary_Ledger.xlsx`;
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
      toast.error(err.message || 'Failed to export subsidiary ledger');
    }
  };

  // Handle view to Excel
  const handleView = (values) => {
    dispatch(fetchSubsidiaryLedgers(values));
  };

  return (
    <div>
      <div className="page-header">
        <h1>Subsidiary Ledger</h1>
        <p>Generate subsidiary ledger reports.</p>
      </div>

      <div className="mt-4 p-3 sm:p-6 bg-white rounded-md shadow">
        <SubsidiaryLedgerForm
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
          data={subsidiaryLedgers}
          loading={isLoading}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default SubsidiaryLedger;
