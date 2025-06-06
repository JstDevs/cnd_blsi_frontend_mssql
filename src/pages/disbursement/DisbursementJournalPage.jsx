import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DisbursementJournalForm from '../../components/forms/DisbursementJournalForm';
import DataTable from '../../components/common/DataTable';
import { fetchDisbursementJournals, exportDisbursementJournals } from '../../features/disbursement/disbursementJournalSlice';

function DisbursementJournalPage() {
  const dispatch = useDispatch();
  const { disbursementJournals, isLoading, error } = useSelector(state => state.disbursementJournal);

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
      key: 'municipality',
      header: 'Municipality',
      sortable: true,
    },
    {
      key: 'funds',
      header: 'Funds',
      sortable: true,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'checkNo',
      header: 'Check No.',
      sortable: true,
    },
    {
      key: 'voucherNo',
      header: 'Voucher No.',
      sortable: true,
    },
    {
      key: 'jevNo',
      header: 'JEV No.',
      sortable: true,
    },
    {
      key: 'claimant',
      header: 'Claimant',
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
      key: 'approver',
      header: 'Approver',
      sortable: true,
    },
    {
      key: 'position',
      header: 'Position',
      sortable: true,
    },
    {
      key: 'startDate',
      header: 'Start Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'endDate',
      header: 'End Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  // Handle form submission
  const handleFormSubmit = (values) => {
    dispatch(fetchDisbursementJournals(values));
  };

  // Handle export to Excel
  const handleExport = (values) => {
    dispatch(exportDisbursementJournals(values));
  };

  return (
    <div>
      <div className="page-header">
        <h1>Disbursement Journal</h1>
        <p>Generate disbursement journal reports.</p>
      </div>
      
      <div className="mt-4 p-6 bg-white rounded-md shadow">
        <DisbursementJournalForm 
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
          data={disbursementJournals}
          loading={isLoading}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default DisbursementJournalPage; 