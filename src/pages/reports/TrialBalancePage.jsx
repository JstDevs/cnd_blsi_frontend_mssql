import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TrialBalanceForm from '../../components/forms/TrialBalanceForm';
import DataTable from '../../components/common/DataTable';
import {
  fetchTrialBalances,
  resetTrialBalanceState,
} from '../../features/reports/trialBalanceSlice';
import { fetchFunds } from '../../features/budget/fundsSlice';
import { fetchEmployees } from '@/features/settings/employeeSlice';
import toast from 'react-hot-toast';

function TrialBalancePage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  const { trialBalances, isLoading, error } = useSelector(
    (state) => state.trialBalance
  );
  const { funds } = useSelector((state) => state.funds);
  const { employees } = useSelector((state) => state.employees);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  useEffect(() => {
    dispatch(resetTrialBalanceState());
    dispatch(fetchFunds());
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Table columns definition
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
      key: 'EndDate',
      header: 'End Date',
      sortable: true,
    },
    {
      key: 'Funds',
      header: 'Funds',
      sortable: true,
    },
    {
      key: 'FullName',
      header: 'Full Name',
      sortable: true,
    },
    {
      key: 'Position',
      header: 'Position',
      sortable: true,
    },
    {
      key: 'Municipality',
      header: 'Municipality',
      sortable: true,
    },
  ];

  // Handle export to Excel
  const handleExport = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/trialBalanceReport/exportExcel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            endDate: values.endDate,
            fundID: values.fundID,
            approverID: values.approverID,
            ledger: values.ledger,
          }),
        }
      );

      if (!response.ok) throw new Error('Server response was not ok');

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = `Trial_Balance.xlsx`;
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
      toast.error(err.message || 'Failed to export trial balance');
    }
  };

  // Handle view to Excel
  const handleView = (values) => {
    dispatch(fetchTrialBalances(values));
  };

  return (
    <div>
      <div className="page-header">
        <h1>Trial Balance</h1>
        <p>Generate trial balance reports.</p>
      </div>

      <div className="mt-4 p-3 sm:p-6 bg-white rounded-md shadow">
        <TrialBalanceForm
          funds={funds}
          employees={employees}
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
          data={trialBalances}
          loading={isLoading}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default TrialBalancePage;
