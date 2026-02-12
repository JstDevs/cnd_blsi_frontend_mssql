import React, { useEffect, useRef } from 'react';
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
import StatementComparisonPrintView from './StatementComparisonPrintView';
import { useReactToPrint } from 'react-to-print';

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
  // inside StatementComparison()
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Statement Comparison Report',
  });


  const columns = [
    { key: 'Type',              header: 'Account Group',        sortable: true },
    { key: 'Subtype',           header: 'Major Group',          sortable: true },
    { key: 'Category',          header: 'Sub-Major Group',      sortable: true },
    { key: 'Chart of Accounts', header: 'Chart of Accounts',    sortable: true },
    {
      key: 'Account Code',
      header: 'Account Code',
      sortable: true,
      className: 'text-left font-bold',
      render: (value) => (
        <span className="text-center font-bold">
          {value}
        </span>
      ),
    },
    {
      key: 'Original_Sum',
      header: 'Original Budget',
      sortable: true,
      className: 'text-right font-semibold',
      render: (value) => (
        <span className="text-right font-semibold text-primary-700">
          {value < 0 ? "(" + formatCurrency(value * -1) + ")" : formatCurrency(value)} 
          {/* {formatCurrency(value)} */}
        </span>
      ),
    },
    {
      key: 'Final_Sum',
      header: 'Final Budget',
      sortable: true,
      className: 'text-right font-semibold',
      render: (value) => (
        <span className="text-right font-semibold text-primary-700">
          {value < 0 ? "(" + formatCurrency(value * -1) + ")" : formatCurrency(value)} 
          {/* {formatCurrency(value)} */}
        </span>
      ),
    },
    {
      key: 'Difference_Sum',
      header: 'Difference',
      sortable: true,
      className: 'text-right font-semibold',
      render: (value) => (
        <span className="text-right font-semibold text-accent-700">
          {value < 0 ? "(" + formatCurrency(value * -1) + ")" : formatCurrency(value)} 
          {/* {formatCurrency(value)} */}
        </span>
      ),
    },
    {
      key: 'Actual_Sum',
      header: 'Actual Amount',
      sortable: true,
      className: 'text-right font-semibold',
      render: (value) => (
        <span className="text-right font-semibold text-primary-800">
          {value < 0 ? "(" + formatCurrency(value * -1) + ")" : formatCurrency(value)} 
          {/* {formatCurrency(value)} */}
        </span>
      ),
    },
    {
      key: 'Difference2_Sum',
      header: 'Final Difference ',
      sortable: true,
      className: 'text-right font-semibold',
      render: (value) => (
        <span className="text-right font-semibold text-accent-700">
          {value < 0 ? "(" + formatCurrency(value * -1) + ")" : formatCurrency(value)} 
          {/* {formatCurrency(value)} */}
        </span>
      ),
    },
    
    // { key: 'Period',  header: 'Period', sortable: true },
    // { key: 'SubID',   header: 'Sub ID', sortable: true },
    // { 
    //   key: 'Original',          
    //   header: 'Original',           
    //   sortable: true, 
    //   render: formatCurrency, 
    //   className: 'text-right',  
    // },
    // {
    //   key: 'Final',
    //   header: 'Final',
    //   sortable: true,
    //   className: 'text-right',
    //   render: formatCurrency,
    // },
    // {
    //   key: 'Difference',
    //   header: 'Difference',
    //   sortable: true,
    //   className: 'text-right',
    // },
    // {
    //   key: 'Actual',
    //   header: 'Actual',
    //   sortable: true,
    //   className: 'text-right',
    // },
    // {
    //   key: 'Difference 2',
    //   header: 'Difference 2',
    //   sortable: true,
    //   className: 'text-right',
    // },
    // { key: 'Municipality', header: 'Municipality', sortable: true },
    // { key: 'Province', header: 'Province', sortable: true },
  ];

  const handleExport = async (values) => {
    try {
      const response = await fetch(
        `${API_URL}/statementOfComparison/exportExcel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
  const handleGenerateJournal = () => {
    if (statementComparisons.length === 0) {
      toast.error('No data to generate journal');
      return;
    }
    handlePrint();
  };
  return (
    <div className="page-container">
      {/* Unified Page Header */}
      <div className="page-header">
        <div>
          <h1>Statement of Comparison of Budget and Actual Amount</h1>
          <p>
            Compare original, final, and actual budget amounts by fiscal year
          </p>
        </div>
      </div>

      <div className="mt-4 p-3 sm:p-6 bg-white rounded-md shadow">
        <StatementComparisonForm
          fiscalYears={fiscalYears}
          onGenerateJournal={handleGenerateJournal}
          onExportExcel={handleExport}
          onView={handleView}
          onClose={() => { }}
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
      
      {/* Hidden print layout */}
      <div className="hidden">
        <StatementComparisonPrintView
          ref={printRef}
          data={statementComparisons}
        />
      </div>
    </div>
  );
}

export default StatementComparison;

