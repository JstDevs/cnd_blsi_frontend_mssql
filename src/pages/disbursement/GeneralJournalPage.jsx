import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GeneralJournalForm from '../../components/forms/GeneralJournalForm';
import DataTable from '../../components/common/DataTable';
import { fetchGeneralJournals, exportGeneralJournals } from '../../features/disbursement/generalJournalSlice';

function GeneralJournalPage() {
  const dispatch = useDispatch();
  const { generalJournals, isLoading, error } = useSelector(state => state.generalJournal);

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
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'reference',
      header: 'Reference',
      sortable: true,
    },
    {
      key: 'particulars',
      header: 'Particulars',
      sortable: true,
    },
    {
      key: 'accountCode',
      header: 'Account Code',
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
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'Posted' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'postedBy',
      header: 'Posted By',
      sortable: true,
    },
    {
      key: 'postedDate',
      header: 'Posted Date',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleString() : '-',
    },
  ];

  // Handle form submission
  const handleFormSubmit = (values) => {
    dispatch(fetchGeneralJournals(values));
  };

  // Handle export to Excel
  const handleExport = (values) => {
    dispatch(exportGeneralJournals(values));
  };

  return (
    <div>
      <div className="page-header">
        <h1>General Journal</h1>
        <p>Generate general journal reports.</p>
      </div>
      
      <div className="mt-4 p-6 bg-white rounded-md shadow">
        <GeneralJournalForm 
          onSubmit={handleFormSubmit}
          onExport={handleExport}
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