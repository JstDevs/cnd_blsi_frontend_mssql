import { useState } from 'react';
import { useSelector } from 'react-redux';
import { PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';

function SubsidiaryLedger() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    accountCode: '',
    subAccount: '',
    fund: '',
  });

  // Mock data for dropdowns
  const accounts = [
    {
      value: '1-01-01-010',
      label: '1-01-01-010 - Cash in Bank - Local Currency, Current Account',
    },
    {
      value: '1-01-02-020',
      label: '1-01-02-020 - Cash - Treasury/Collecting Officer',
    },
  ];

  const subAccounts = [
    { value: '101', label: '101 - Municipal Treasurer' },
    { value: '102', label: '102 - Municipal Accountant' },
    { value: '103', label: '103 - Municipal Budget Officer' },
  ];

  const funds = [
    { value: 'General Fund', label: 'General Fund' },
    { value: 'Special Education Fund', label: 'Special Education Fund' },
    { value: 'Trust Fund', label: 'Trust Fund' },
  ];

  // Mock data for table
  const entries = [
    {
      id: 'GL-2024-001',
      fund: 'General Fund',
      accountName: 'Real Property Tax Receivable',
      accountCode: '1-01-01-100',
      date: '2024-01-15',
      ledgerItem: 'Q1 2024 RPT Collection',
      debit: 50000.0,
      credit: 0.0,
      balance: 50000.0,
      municipality: 'BASCO (Capital)',
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
      key: 'id',
      header: 'ID',
      sortable: true,
      className: 'whitespace-nowrap',
    },
    {
      key: 'fund',
      header: 'Fund',
      sortable: true,
      className: 'whitespace-nowrap',
    },
    {
      key: 'accountName',
      header: 'Account Name',
      sortable: true,
      className: 'whitespace-nowrap',
    },
    {
      key: 'accountCode',
      header: 'Account Code',
      sortable: true,
      className: 'whitespace-nowrap',
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
      className: 'whitespace-nowrap',
    },
    {
      key: 'ledgerItem',
      header: 'Ledger Item',
      sortable: true,
      className: 'whitespace-nowrap',
    },
    {
      key: 'debit',
      header: 'Debit',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right whitespace-nowrap',
    },
    {
      key: 'credit',
      header: 'Credit',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right whitespace-nowrap',
    },
    {
      key: 'balance',
      header: 'Balance',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right font-medium whitespace-nowrap',
    },
    {
      key: 'municipality',
      header: 'Municipality',
      sortable: true,
      className: 'whitespace-nowrap',
    },
  ];
  return (
    <div className="p-4 md:p-6">
      <div className="page-header">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Subsidiary Ledger
            </h1>
            <p className="text-gray-600">
              Detailed transaction records by sub-account
            </p>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              type="button"
              className="btn btn-outline mt-2 sm:mt-0 flex items-center justify-center w-full md:w-auto"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              <span>Export</span>
            </button>
            <button
              type="button"
              className="btn btn-outline mt-2 sm:mt-0 flex items-center justify-center w-full md:w-auto"
            >
              <PrinterIcon className="h-5 w-5 mr-2" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 card p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          <FormField
            label="Account"
            name="accountCode"
            type="select"
            value={filters.accountCode}
            onChange={(e) =>
              setFilters({ ...filters, accountCode: e.target.value })
            }
            options={accounts}
            className="col-span-1 lg:col-span-2"
          />
          <FormField
            label="Cut-off Date"
            name="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="col-span-1"
          />

          {/* <FormField
            label="End Date"
            name="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="col-span-1"
          /> */}

          {/* <FormField
            label="Sub-Account"
            name="subAccount"
            type="select"
            value={filters.subAccount}
            onChange={(e) =>
              setFilters({ ...filters, subAccount: e.target.value })
            }
            options={subAccounts}
            className="col-span-1 sm:col-span-2"
          /> */}

          <FormField
            label="Fund"
            name="fund"
            type="select"
            value={filters.fund}
            onChange={(e) => setFilters({ ...filters, fund: e.target.value })}
            options={funds}
            className="col-span-1 sm:col-span-2 lg:col-span-1"
          />
        </div>

        <div className="flex flex-wrap justify-end mt-4 gap-4">
          <button
            type="button"
            className="btn mt-2 sm:mt-0 btn-outline w-full sm:w-auto"
            onClick={() =>
              setFilters({
                startDate: '',
                endDate: '',
                accountCode: '',
                subAccount: '',
                fund: '',
              })
            }
          >
            Clear
          </button>
          <button
            type="button"
            className="btn mt-2 sm:mt-0 btn-primary w-full sm:w-auto"
            onClick={() => {
              // Handle filter application
              console.log('Filters applied:', filters);
            }}
          >
            View
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <DataTable
          columns={columns}
          data={entries}
          pagination={true}
          responsive={true}
          className="min-w-full"
        />
      </div>
    </div>
  );
}

export default SubsidiaryLedger;
