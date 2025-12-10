import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FinancialStatementsForm from '../../components/forms/FinancialStatementsForm';
import DataTable from '../../components/common/DataTable';
import {
  fetchFinancialStatements,
  resetFinancialStatementState,
} from '../../features/reports/financialStatementSlice';
import toast from 'react-hot-toast';

function FinancialStatementsPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const { financialStatements, isLoading, error } = useSelector(
    (state) => state.financialStatementsReports
  );

  useEffect(() => {
    dispatch(resetFinancialStatementState());
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
      key: 'Type',
      header: 'Type',
      sortable: true,
    },
    {
      key: 'Term',
      header: 'Term',
      sortable: true,
    },
    {
      key: 'SubType',
      header: 'Sub Type',
      sortable: true,
    },
    {
      key: 'Notes',
      header: 'Notes',
      sortable: true,
    },
    {
      key: 'Values',
      header: 'Values',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'Comparison',
      header: 'Comparison',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
  ];

  // Handle export to Excel
  const handleExport = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/financialStatementsReports/exportExcel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            year: values.year,
          }),
        }
      );

      if (!response.ok) throw new Error('Server response was not ok');

      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition');
      let filename = `Consolidated_Statement_of_Financial_Position.xlsx`;
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
      toast.error(err.message || 'Failed to export');
    }
  };

  // Handle view to Excel
  const handleView = (values) => {
    dispatch(fetchFinancialStatements(values));
  };

  return (
    <div>
      <div className="page-header">
        <h1>Consolidated Comparison</h1>
        <p>Generate consolidated comparison reports.</p>
      </div>

      <div className="mt-4 p-3 sm:p-6 bg-white rounded-md shadow">
        <FinancialStatementsForm
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
          data={financialStatements}
          loading={isLoading}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default FinancialStatementsPage;
