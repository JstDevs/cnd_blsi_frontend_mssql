import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatementComparisonForm from '../../../components/forms/StatementComparisonForm';
import DataTable from '@/components/common/DataTable';
import {
  fetchStatementComparisons,
  resetStatementComparisonState,
} from '@/features/budget/statementComparisonSlice';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/utils/currencyFormater';

function StatementComparison() {
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  const { statementComparisons, isLoading, error } = useSelector(
    (state) => state.statementComparison
  );
  const { fiscalYears } = useSelector((state) => state.fiscalYears);

  useEffect(() => {
    dispatch(resetStatementComparisonState());
    dispatch(fetchFiscalYears());
  }, [dispatch]);

  const columns = [
    { key: 'Type', header: 'Type', sortable: true },
    { key: 'SubID', header: 'Sub ID', sortable: true },
    { key: 'Subtype', header: 'Subtype', sortable: true },
    { key: 'Category', header: 'Category', sortable: true },
    { key: 'Chart of Accounts', header: 'Chart of Accounts', sortable: true },
    { key: 'Account Code', header: 'Account Code', sortable: true },
    {
      key: 'Original',
      header: 'Original',
      sortable: true,
      render: formatCurrency,
      className: 'text-right',
    },
    {
      key: 'Final',
      header: 'Final',
      sortable: true,
      className: 'text-right',
      render: formatCurrency,
    },
    {
      key: 'Difference',
      header: 'Difference',
      sortable: true,
      className: 'text-right',
    },
    {
      key: 'Actual',
      header: 'Actual',
      sortable: true,
      className: 'text-right',
    },
    {
      key: 'Difference 2',
      header: 'Difference 2',
      sortable: true,
      className: 'text-right',
    },
    { key: 'Period', header: 'Period', sortable: true },
    {
      key: 'Original_Sum',
      header: 'Original_Sum',
      sortable: true,
      render: formatCurrency,
    },
    {
      key: 'Final_Sum',
      header: 'Final_Sum',
      sortable: true,
      render: formatCurrency,
    },
    {
      key: 'Difference_Sum',
      header: 'Difference_Sum',
      sortable: true,
      render: formatCurrency,
    },
    {
      key: 'Actual_Sum',
      header: 'Actual_Sum',
      sortable: true,
      render: formatCurrency,
    },
    {
      key: 'Difference2_Sum',
      header: 'Difference2_Sum',
      sortable: true,
      render: formatCurrency,
    },

    { key: 'Municipality', header: 'Municipality', sortable: true },
    { key: 'Province', header: 'Province', sortable: true },
  ];

  const handleExport = async (values) => {
    try {
      const response = await fetch(
        `${API_URL}/statementOfComparison/exportExcel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ fiscalYearID: values.fiscalYearID }),
        }
      );

      if (!response.ok) throw new Error('Server response was not ok');

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = `Statement_of_Comparison.xlsx`;
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
      toast.error(err.message || 'Failed to export');
    }
  };

  const handleView = (values) => {
    dispatch(fetchStatementComparisons(values));
  };

  return (
    <div className="page-container">
      {/* Unified Page Header */}
      <div className="page-header">
        <div>
          <h1>Statement of Comparison</h1>
          <p>
            Compare original, final, and actual budget amounts by fiscal year
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 sm:p-6 bg-white rounded-md shadow">
        <StatementComparisonForm
          fiscalYears={fiscalYears}
          onExportExcel={handleExport}
          onView={handleView}
          onClose={() => {}}
        />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <DataTable
          columns={columns}
          data={statementComparisons}
          loading={isLoading}
          pagination
        />
      </div>
    </div>
  );
}

export default StatementComparison;
