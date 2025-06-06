import { useState } from 'react';
import { PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';

function BudgetReportPage() {
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    reportType: 'summary',
    fund: '',
  });
  
  const funds = [
    { value: 'General Fund', label: 'General Fund' },
    { value: 'Special Education Fund', label: 'Special Education Fund' },
    { value: 'Trust Fund', label: 'Trust Fund' },
  ];
  
  const reportTypes = [
    { value: 'summary', label: 'Budget Summary' },
    { value: 'saaob', label: 'Statement of Appropriations, Allotments and Obligations' },
    { value: 'scba', label: 'Statement of Comparison of Budget and Actual Amounts' },
  ];
  
  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  // Mock data for table
  const entries = [
    {
      id: 1,
      accountCode: '5-01-01-010',
      accountTitle: 'Personal Services - Regular',
      appropriation: 5000000,
      allotment: 4500000,
      obligation: 3500000,
      balance: 1000000,
      utilizationRate: 0.78,
    },
    {
      id: 2,
      accountCode: '5-02-01-010',
      accountTitle: 'Traveling Expenses - Local',
      appropriation: 1000000,
      allotment: 800000,
      obligation: 600000,
      balance: 200000,
      utilizationRate: 0.75,
    },
  ];
  
  // Table columns
  const columns = [
    {
      key: 'accountCode',
      header: 'Account Code',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'accountTitle',
      header: 'Account Title',
      sortable: true,
    },
    {
      key: 'appropriation',
      header: 'Appropriation',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'allotment',
      header: 'Allotment',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'obligation',
      header: 'Obligation',
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
      key: 'utilizationRate',
      header: 'Utilization',
      sortable: true,
      render: (value) => formatPercentage(value),
      className: 'text-right',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Budget Reports</h1>
            <p>View and generate budget utilization reports</p>
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
            label="Year"
            name="year"
            type="number"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            min="2000"
            max="2100"
          />
          
          <FormField
            label="Month"
            name="month"
            type="select"
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            options={[
              { value: '01', label: 'January' },
              { value: '02', label: 'February' },
              { value: '03', label: 'March' },
              { value: '04', label: 'April' },
              { value: '05', label: 'May' },
              { value: '06', label: 'June' },
              { value: '07', label: 'July' },
              { value: '08', label: 'August' },
              { value: '09', label: 'September' },
              { value: '10', label: 'October' },
              { value: '11', label: 'November' },
              { value: '12', label: 'December' },
            ]}
          />
          
          <FormField
            label="Report Type"
            name="reportType"
            type="select"
            value={filters.reportType}
            onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}
            options={reportTypes}
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
            Generate Report
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl font-bold">Local Government Unit</h2>
          <h3 className="text-lg font-semibold">Statement of Appropriations, Allotments and Obligations</h3>
          <p className="text-sm text-neutral-600">For the Month Ended {new Date(filters.year, filters.month - 1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}</p>
        </div>
        
        <DataTable
          columns={columns}
          data={entries}
          pagination={true}
        />
        
        <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-neutral-600">Total Appropriation</p>
              <p className="text-lg font-semibold">{formatCurrency(entries.reduce((sum, item) => sum + item.appropriation, 0))}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Allotment</p>
              <p className="text-lg font-semibold">{formatCurrency(entries.reduce((sum, item) => sum + item.allotment, 0))}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Obligation</p>
              <p className="text-lg font-semibold">{formatCurrency(entries.reduce((sum, item) => sum + item.obligation, 0))}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Overall Utilization</p>
              <p className="text-lg font-semibold">{formatPercentage(entries.reduce((sum, item) => sum + item.obligation, 0) / entries.reduce((sum, item) => sum + item.appropriation, 0))}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetReportPage;