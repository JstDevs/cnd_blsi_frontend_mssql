import { useState } from 'react';
import { PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';

function BirReportPage() {
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    formType: '2307',
    vendor: '',
  });
  
  // Mock data for dropdowns
  const formTypes = [
    { value: '2307', label: 'Form 2307 - Certificate of Creditable Tax Withheld' },
    { value: '1601E', label: 'Form 1601-E - Monthly Remittance Return of Creditable Income Taxes Withheld' },
    { value: '1601C', label: 'Form 1601-C - Monthly Remittance Return of Income Taxes Withheld on Compensation' },
  ];
  
  const vendors = [
    { value: '1', label: 'ABC Office Supplies' },
    { value: '2', label: 'XYZ Construction' },
    { value: '3', label: 'Tech Solutions Inc.' },
  ];
  
  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };
  
  // Mock data for table
  const entries = [
    {
      id: 1,
      date: '2024-01-15',
      reference: 'DV-2024-01-0015',
      description: 'Payment for office supplies',
      grossAmount: 50000,
      taxRate: 0.02,
      taxWithheld: 1000,
      netAmount: 49000,
    },
    {
      id: 2,
      date: '2024-01-20',
      reference: 'DV-2024-01-0023',
      description: 'Payment for IT equipment',
      grossAmount: 100000,
      taxRate: 0.02,
      taxWithheld: 2000,
      netAmount: 98000,
    },
  ];
  
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
      key: 'description',
      header: 'Description',
      sortable: true,
    },
    {
      key: 'grossAmount',
      header: 'Gross Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'taxRate',
      header: 'Tax Rate',
      sortable: true,
      render: (value) => `${(value * 100).toFixed(2)}%`,
      className: 'text-right',
    },
    {
      key: 'taxWithheld',
      header: 'Tax Withheld',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
    {
      key: 'netAmount',
      header: 'Net Amount',
      sortable: true,
      render: (value) => formatCurrency(value),
      className: 'text-right',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>BIR Reports</h1>
            <p>Generate BIR forms and reports</p>
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
            label="Form Type"
            name="formType"
            type="select"
            value={filters.formType}
            onChange={(e) => setFilters({ ...filters, formType: e.target.value })}
            options={formTypes}
          />
          
          <FormField
            label="Vendor/Payee"
            name="vendor"
            type="select"
            value={filters.vendor}
            onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
            options={vendors}
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
      
      {filters.formType === '2307' && (
        <div className="mt-8">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-xl font-bold">Certificate of Creditable Tax Withheld at Source</h2>
            <h3 className="text-lg font-semibold">BIR Form No. 2307</h3>
            <p className="text-sm text-neutral-600">For the Month of {new Date(filters.year, filters.month -1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="card p-4">
              <h4 className="font-medium mb-2">Payor Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-neutral-500">TIN:</span> 123-456-789-000</p>
                <p><span className="text-neutral-500">Name:</span> Local Government Unit</p>
                <p><span className="text-neutral-500">Address:</span> LGU Building, City Center</p>
                <p><span className="text-neutral-500">ZIP Code:</span> 1234</p>
              </div>
            </div>
            
            <div className="card p-4">
              <h4 className="font-medium mb-2">Payee Details</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-neutral-500">TIN:</span> 987-654-321-000</p>
                <p><span className="text-neutral-500">Name:</span> ABC Office Supplies</p>
                <p><span className="text-neutral-500">Address:</span> 123 Supplier Street</p>
                <p><span className="text-neutral-500">ZIP Code:</span> 5678</p>
              </div>
            </div>
          </div>
          
          <DataTable
            columns={columns}
            data={entries}
            pagination={true}
          />
          
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-neutral-600">Total Gross Amount</p>
                <p className="text-lg font-semibold">{formatCurrency(entries.reduce((sum, item) => sum + item.grossAmount, 0))}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Tax Withheld</p>
                <p className="text-lg font-semibold">{formatCurrency(entries.reduce((sum, item) => sum + item.taxWithheld, 0))}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Net Amount</p>
                <p className="text-lg font-semibold">{formatCurrency(entries.reduce((sum, item) => sum + item.netAmount, 0))}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BirReportPage;