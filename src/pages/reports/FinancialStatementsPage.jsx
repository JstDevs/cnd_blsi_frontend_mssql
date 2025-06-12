import { useState } from 'react';
import { PrinterIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import FormField from '../../components/common/FormField';

function FinancialStatementsPage() {
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    statementType: 'sfp',
    fund: '',
  });
  
  const funds = [
    { value: 'General Fund', label: 'General Fund' },
    { value: 'Special Education Fund', label: 'Special Education Fund' },
    { value: 'Trust Fund', label: 'Trust Fund' },
  ];
  
  const statementTypes = [
    { value: 'sfp', label: 'Statement of Financial Position' },
    { value: 'sfe', label: 'Statement of Financial Performance' },
    { value: 'scf', label: 'Statement of Cash Flows' },
    { value: 'sce', label: 'Statement of Changes in Equity' },
    { value: 'scna', label: 'Statement of Comparison of Budget and Actual Amounts' },
  ];
  
  // Mock data for financial statement
  const mockData = {
    sfp: {
      assets: [
        { account: 'Cash and Cash Equivalents', amount: 5000000 },
        { account: 'Receivables', amount: 2500000 },
        { account: 'Property, Plant and Equipment', amount: 15000000 },
      ],
      liabilities: [
        { account: 'Accounts Payable', amount: 1500000 },
        { account: 'Loans Payable', amount: 5000000 },
      ],
      equity: [
        { account: 'Government Equity', amount: 15000000 },
        { account: 'Accumulated Surplus/(Deficit)', amount: 1000000 },
      ],
    },
  };
  
  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Financial Statements</h1>
            <p>View and generate financial statement reports</p>
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
            label="Statement Type"
            name="statementType"
            type="select"
            value={filters.statementType}
            onChange={(e) => setFilters({ ...filters, statementType: e.target.value })}
            options={statementTypes}
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
      
      {/* Statement of Financial Position */}
      {filters.statementType === 'sfp' && (
        <div className="mt-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold">Local Government Unit</h2>
            <h3 className="text-lg font-semibold">Statement of Financial Position</h3>
            <p className="text-sm text-neutral-600">As of {new Date(filters.year, filters.month - 1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}</p>
          </div>
          
          {/* Assets */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Assets</h4>
            <div className="space-y-2">
              {mockData.sfp.assets.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <span>{item.account}</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold">
                <span>Total Assets</span>
                <span>{formatCurrency(mockData.sfp.assets.reduce((sum, item) => sum + item.amount, 0))}</span>
              </div>
            </div>
          </div>
          
          {/* Liabilities */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liabilities</h4>
            <div className="space-y-2">
              {mockData.sfp.liabilities.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <span>{item.account}</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold">
                <span>Total Liabilities</span>
                <span>{formatCurrency(mockData.sfp.liabilities.reduce((sum, item) => sum + item.amount, 0))}</span>
              </div>
            </div>
          </div>
          
          {/* Equity */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Equity</h4>
            <div className="space-y-2">
              {mockData.sfp.equity.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b">
                  <span>{item.account}</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 font-bold">
                <span>Total Equity</span>
                <span>{formatCurrency(mockData.sfp.equity.reduce((sum, item) => sum + item.amount, 0))}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinancialStatementsPage;