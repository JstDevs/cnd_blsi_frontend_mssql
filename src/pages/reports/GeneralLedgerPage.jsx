import { useState } from 'react';
import { useSelector } from 'react-redux';
import { PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';

function GeneralLedgerPage() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    accountCode: '',
    fund: '',
  });
  
  // Mock data for dropdowns
  const accounts = [
    { value: '1-01-01-010', label: '1-01-01-010 - Cash in Bank - Local Currency, Current Account' },
    { value: '1-01-02-020', label: '1-01-02-020 - Cash - Treasury/Collecting Officer' },
  ];
  
  const funds = [
    { value: 'General Fund', label: 'General Fund' },
    { value: 'Special Education Fund', label: 'Special Education Fund' },
    { value: 'Trust Fund', label: 'Trust Fund' },
  ];
  
  // Mock data for table
  const entries = [
    {
      id: 1,
      date: '2024-01-15',
      reference: 'JEV-2024-01-0001',
      particulars: 'To record collection of real property tax',
      debit: 50000,
      credit: 0,
      balance: 50000,
    },
    {
      id: 2,
      date: '2024-01-16',
      reference: 'DV-2024-01-0015',
      particulars: 'Payment for office supplies',
      debit: 0,
      credit: 15000,
      balance: 35000,
    },
  ];
  
  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  
  // Table columns
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
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'particulars',
      header: 'Particulars',
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
      className: 'text-right font-medium',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>General Ledger</h1>
            <p>View and print general ledger reports</p>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="btn btn-outline flex items-center"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
            <button
              type="button"
              className="btn btn-outline flex items-center"
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            label="Start Date"
            name="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          
          <FormField
            label="End Date"
            name="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
          
          <FormField
            label="Account"
            name="accountCode"
            type="select"
            value={filters.accountCode}
            onChange={(e) => setFilters({ ...filters, accountCode: e.target.value })}
            options={accounts}
          />
          
          <FormField
            label="Fund"
            name="fund"
            type="select"
            value={filters.fund}
            onChange={(e) => setFilters({ ...filters, fund: e.target.value })}
            options={funds}
          />
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              // Handle filter application
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={entries}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default GeneralLedgerPage;