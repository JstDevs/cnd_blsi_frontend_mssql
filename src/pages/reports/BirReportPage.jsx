import { useState } from 'react';
import { PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import { useModulePermissions } from '@/utils/useModulePremission';

function BirReportPage() {
  const [filters, setFilters] = useState({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    formType: '2307',
    payeeType: 'vendor',
    vendor: '1',
  });
  // ---------------------USE MODULE PERMISSIONS------------------START (BirReportPage - MODULE ID = 16 )
  const { Print } = useModulePermissions(16);

  const vendors = [
    { value: '1', label: 'ABC Office Supplies' },
    { value: '2', label: 'XYZ Construction' },
    { value: '3', label: 'Tech Solutions Inc.' },
    { value: '4', label: 'Global Logistics' },
    { value: '5', label: 'Premium Services Co.' },
  ];

  const employees = [
    { value: '101', label: 'Juan Dela Cruz' },
    { value: '102', label: 'Maria Santos' },
    { value: '103', label: 'Pedro Reyes' },
    { value: '104', label: 'Ana Lopez' },
    { value: '105', label: 'Luis Garcia' },
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
    {
      id: 3,
      date: '2024-01-25',
      reference: 'DV-2024-01-0032',
      description: 'Payment for maintenance services',
      grossAmount: 75000,
      taxRate: 0.02,
      taxWithheld: 1500,
      netAmount: 73500,
    },
    {
      id: 4,
      date: '2024-01-28',
      reference: 'DV-2024-01-0041',
      description: 'Payment for office furniture',
      grossAmount: 120000,
      taxRate: 0.02,
      taxWithheld: 2400,
      netAmount: 117600,
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

  // Payee details based on selected vendor
  const getPayeeDetails = () => {
    if (filters.payeeType === 'employee') {
      const employee =
        employees.find((e) => e.value === filters.vendor) || employees[0];
      return {
        tin: '987-654-321-000',
        name: employee.label,
        address: 'Employee Address, City',
        zipCode: '1000',
      };
    } else {
      const vendor =
        vendors.find((v) => v.value === filters.vendor) || vendors[0];
      return {
        tin: '123-456-789-000',
        name: vendor.label,
        address: `${vendor.label} Street, Business District`,
        zipCode: '2000',
      };
    }
  };

  const payeeDetails = getPayeeDetails();

  return (
    <div>
      <div className="page-header">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-[200px]">
            <h1 className="text-lg font-semibold">BIR Reports</h1>
            <p className="text-sm text-neutral-600">
              Generate BIR forms and reports
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap w-full sm:w-auto gap-2 sm:justify-end">
            <button
              type="button"
              className="btn btn-outline flex items-center justify-center flex-1 sm:flex-initial"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
            {Print && (
              <button
                type="button"
                className="btn btn-outline flex items-center justify-center flex-1 sm:flex-initial"
              >
                <PrinterIcon className="h-5 w-5 mr-2" />
                Print
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            label="From Date"
            name="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
          <FormField
            label="To Date"
            name="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Payee Type
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="payeeType"
                  value="employee"
                  checked={filters.payeeType === 'employee'}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      payeeType: e.target.value,
                      vendor: '',
                    })
                  }
                />
                <span className="ml-2">Employee</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="payeeType"
                  value="vendor"
                  checked={filters.payeeType === 'vendor'}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      payeeType: e.target.value,
                      vendor: '',
                    })
                  }
                />
                <span className="ml-2">Vendor</span>
              </label>
            </div>
          </div>

          <FormField
            label={filters.payeeType === 'employee' ? 'Employee' : 'Vendor'}
            name="vendor"
            type="select"
            value={filters.vendor}
            onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
            options={filters.payeeType === 'employee' ? employees : vendors}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              // Handle filter application
              console.log('Generating report with filters:', filters);
            }}
          >
            Generate Report
          </button>
        </div>
      </div>

      {filters.formType === '2307' && (
        <div className="mt-8">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-xl font-bold">
              Certificate of Creditable Tax Withheld at Source
            </h2>
            <h3 className="text-lg font-semibold">BIR Form No. 2307</h3>
            <p className="text-sm text-neutral-600">
              For the period from{' '}
              {new Date(filters.startDate).toLocaleDateString()} to{' '}
              {new Date(filters.endDate).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="card p-4">
              <h4 className="font-medium mb-2">Payor Details</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-neutral-500">TIN:</span> 000-123-456-789
                </p>
                <p>
                  <span className="text-neutral-500">Name:</span> Local
                  Government Unit of Sample City
                </p>
                <p>
                  <span className="text-neutral-500">Address:</span> City Hall
                  Building, Main Street
                </p>
                <p>
                  <span className="text-neutral-500">ZIP Code:</span> 4100
                </p>
              </div>
            </div>

            <div className="card p-4">
              <h4 className="font-medium mb-2">Payee Details</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-neutral-500">TIN:</span>{' '}
                  {payeeDetails.tin}
                </p>
                <p>
                  <span className="text-neutral-500">Name:</span>{' '}
                  {payeeDetails.name}
                </p>
                <p>
                  <span className="text-neutral-500">Address:</span>{' '}
                  {payeeDetails.address}
                </p>
                <p>
                  <span className="text-neutral-500">ZIP Code:</span>{' '}
                  {payeeDetails.zipCode}
                </p>
              </div>
            </div>
          </div>

          <DataTable columns={columns} data={entries} pagination={true} />

          <div className="mt-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-neutral-600">Total Gross Amount</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(
                    entries.reduce((sum, item) => sum + item.grossAmount, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Tax Withheld</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(
                    entries.reduce((sum, item) => sum + item.taxWithheld, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Total Net Amount</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(
                    entries.reduce((sum, item) => sum + item.netAmount, 0)
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 card p-4">
            <h4 className="font-medium mb-2">Certification</h4>
            <p className="text-sm mb-4">
              I/We certify under penalty of perjury that this certificate has
              been made in good faith, verified by me/us, and to the best of
              my/our knowledge and belief, is true and correct.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-neutral-500">Prepared by:</p>
                <p className="font-medium">Juan Dela Cruz</p>
                <p className="text-sm text-neutral-600">Accounting Staff</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">
                  Certified correct by:
                </p>
                <p className="font-medium">Maria Santos</p>
                <p className="text-sm text-neutral-600">Treasurer</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BirReportPage;
