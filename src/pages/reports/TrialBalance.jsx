import React, { useState } from 'react';
import {
  Calendar,
  Download,
  Eye,
  FileText,
  Printer,
  BookOpen,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  DollarSign,
  Building2,
  Calculator,
  PrinterIcon,
} from 'lucide-react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const TrialBalance = () => {
  const [dateEnd, setDateEnd] = useState('2025-05-30');
  const [dateFrom, setDateFrom] = useState('2025-05-30');
  const [selectedFund, setSelectedFund] = useState('General Fund');
  const [selectedLedger, setSelectedLedger] = useState('Subsidiary Ledger');
  const [selectedApprover, setSelectedApprover] = useState(
    'Cedric Azupardo Entac - Treasury'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('summary');

  const trialBalanceData = [
    {
      id: '1',
      accountCode: '101010010',
      accountName: 'Cash - Local Treasury',
      debit: 2336672.73,
      credit: 9018.0,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'assets',
    },
    {
      id: '2',
      accountCode: '101010020',
      accountName: 'Due from Local Government Units',
      debit: 0.0,
      credit: 51228.78,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'assets',
    },
    {
      id: '3',
      accountCode: '101010020',
      accountName: 'Due to LGUs',
      debit: 0.0,
      credit: 34152.54,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'liabilities',
    },
    {
      id: '4',
      accountCode: '101010020',
      accountName: 'Petty Cash',
      debit: 66660.0,
      credit: 362172.0,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'assets',
    },
    {
      id: '5',
      accountCode: '101020010',
      accountName: 'Cash in Bank - Local Currency, Current Account',
      debit: 2200.0,
      credit: 18480.0,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'assets',
    },
    {
      id: '6',
      accountCode: '102059990',
      accountName: 'Other Investments',
      debit: 3040000.0,
      credit: 2678571.42,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'assets',
    },
    {
      id: '7',
      accountCode: '102059991',
      accountName: 'Allowance for Impairment - Other Investments',
      debit: 13844738.8,
      credit: 3797867860.0,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'assets',
    },
    {
      id: '8',
      accountCode: '102070010',
      accountName: 'Sinking Fund',
      debit: 1002149.8,
      credit: 0.0,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'assets',
    },
    {
      id: '9',
      accountCode: '105010030',
      accountName: 'Prepaid Registration',
      debit: 500010.0,
      credit: 0.0,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'assets',
    },
    {
      id: '10',
      accountCode: '107050020',
      accountName: 'Office Equipment',
      debit: 4143396.0,
      credit: 3719996.28,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'assets',
    },
    {
      id: '11',
      accountCode: '107990010',
      accountName: 'Work/Zoo Animals',
      debit: 10.0,
      credit: 0.0,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'assets',
    },
    {
      id: '12',
      accountCode: '202010070',
      accountName: 'Due to LGUs',
      debit: 0.0,
      credit: 416.51,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'liabilities',
    },
    {
      id: '13',
      accountCode: '402020020',
      accountName: 'Affiliation Fees',
      debit: 0.0,
      credit: 60001496700.0,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'revenue',
    },
    {
      id: '14',
      accountCode: '501010010',
      accountName: 'Salaries and Wages - Regular',
      debit: 160000.0,
      credit: 118110.0,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'expenses',
    },
    {
      id: '15',
      accountCode: '501020140',
      accountName: 'Year End Bonus',
      debit: 120.0,
      credit: 0.0,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'expenses',
    },
    {
      id: '16',
      accountCode: '502030020',
      accountName: 'Accountable Forms Expenses',
      debit: 2269.2,
      credit: 0.0,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'expenses',
    },
    {
      id: '17',
      accountCode: '502040020',
      accountName: 'Electricity Expenses',
      debit: 138060.0,
      credit: 0.0,
      endDate: '2025-05-30',
      funds: 'General Fund',
      approverName: 'Cedric A. Entac',
      approverPosition: 'Treasury Head',
      category: 'expenses',
    },
  ];

  const funds = ['General Fund', 'Special Fund', 'Trust Fund', 'Capital Fund'];
  const ledgers = ['Subsidiary Ledger', 'General Ledger', 'Cash Book'];
  const approvers = [
    'Cedric Azupardo Entac - Treasury',
    'Maria Santos - Finance',
    'John Doe - Accounting',
    'Jane Smith - Budget',
  ];
  const categories = [
    'all',
    'assets',
    'liabilities',
    'equity',
    'revenue',
    'expenses',
  ];

  const filteredData = trialBalanceData.filter((item) => {
    const matchesSearch =
      item.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accountCode.includes(searchTerm);
    const matchesCategory =
      filterCategory === 'all' || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const totals = filteredData.reduce(
    (acc, item) => ({
      debit: acc.debit + item.debit,
      credit: acc.credit + item.credit,
    }),
    {
      debit: 0,
      credit: 0,
    }
  );

  const categoryTotals = categories
    .filter((c) => c !== 'all')
    .map((category) => {
      const categoryItems = filteredData.filter(
        (item) => item.category === category
      );
      const categoryDebit = categoryItems.reduce(
        (sum, item) => sum + item.debit,
        0
      );
      const categoryCredit = categoryItems.reduce(
        (sum, item) => sum + item.credit,
        0
      );

      return {
        category,
        debit: categoryDebit,
        credit: categoryCredit,
        count: categoryItems.length,
        balance: categoryDebit - categoryCredit,
      };
    });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'assets':
        return 'bg-blue-100 text-blue-800';
      case 'liabilities':
        return 'bg-red-100 text-red-800';
      case 'equity':
        return 'bg-green-100 text-green-800';
      case 'revenue':
        return 'bg-purple-100 text-purple-800';
      case 'expenses':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleView = () => {
    console.log('Viewing trial balance...');
  };

  const handleGenerateCashbook = () => {
    console.log('Generating cashbook...');
  };

  const handleExport = () => {
    console.log('Exporting trial balance...');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
        {/* Heading */}
        <div className="min-w-[200px]">
          <h2 className="text-2xl font-bold text-gray-900">Trial Balance</h2>
          <p className="text-gray-600">
            Comprehensive trial balance analysis and reporting
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex items-center bg-gray-100 rounded-lg p-1 w-full sm:w-auto justify-center sm:justify-start">
            <button
              onClick={() => setViewMode('summary')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex-1 ${
                viewMode === 'summary'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex-1 ${
                viewMode === 'detailed'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Detailed
            </button>
          </div>

          {/* <button
            onClick={handlePrint}
            className="flex items-center mt-2 sm:mt-0 justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button> */}

          {/* <button
            onClick={handleExport}
            className="flex items-center mt-2 sm:mt-0 justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button> */}
          <button type="button" className="btn btn-outline flex items-center">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </button>
          <button type="button" className="btn btn-outline flex items-center">
            <PrinterIcon className="h-5 w-5 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Accounts
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.length}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Across {categories.filter((c) => c !== 'all').length} categories
              </p>
            </div>
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Debits</p>
              <p className="text-2xl font-bold text-green-600">
                ${totals.debit.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Sum of all debit entries
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-red-600">
                ${totals.credit.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Sum of all credit entries
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
              <p
                className={`text-2xl font-bold ${
                  totals.debit - totals.credit >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                ${Math.abs(totals.debit - totals.credit).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {totals.debit === totals.credit
                  ? 'Balanced'
                  : totals.debit > totals.credit
                  ? 'Debit balance'
                  : 'Credit balance'}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date End
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fund
            </label>
            <select
              value={selectedFund}
              onChange={(e) => setSelectedFund(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {funds.map((fund) => (
                <option key={fund} value={fund}>
                  {fund}
                </option>
              ))}
            </select>
          </div>
          {/* // TODO : DO NOT NEED THIS */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approver
            </label>
            <select
              value={selectedApprover}
              onChange={(e) => setSelectedApprover(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {approvers.map((approver) => (
                <option key={approver} value={approver}>
                  {approver}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ledger
            </label>
            <select
              value={selectedLedger}
              onChange={(e) => setSelectedLedger(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ledgers.map((ledger) => (
                <option key={ledger} value={ledger}>
                  {ledger}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleView}
              className="btn btn-primary flex items-center w-full justify-center py-3 mb-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by account name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all'
                    ? 'All Categories'
                    : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateCashbook}
              className="flex items-center mt-2 sm:mt-0 justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Cashbook
            </button>
          </div>
        </div>
      </div>

      {/* Trial Balance Content */}
      {viewMode === 'summary' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Balance by Category
            </h3>
            <div className="space-y-4">
              {categoryTotals.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mr-2 ${getCategoryColor(
                          category.category
                        )}`}
                      >
                        {category.category.charAt(0).toUpperCase() +
                          category.category.slice(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({category.count} accounts)
                      </span>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        category.balance >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      ${Math.abs(category.balance).toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Debits:</span>
                      <span>${category.debit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Credits:</span>
                      <span>${category.credit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Accounts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Largest Account Balances
            </h3>
            <div className="space-y-4">
              {filteredData
                .sort(
                  (a, b) =>
                    Math.abs(b.debit - b.credit) - Math.abs(a.debit - a.credit)
                )
                .slice(0, 8)
                .map((item) => {
                  const balance = item.debit - item.credit;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.accountName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.accountCode}
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getCategoryColor(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            balance >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          ${Math.abs(balance).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {balance >= 0 ? 'Debit' : 'Credit'} balance
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Account Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Account Name
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Debit
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Credit
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Balance
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium">
                    End Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Approver
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item, index) => {
                  const balance = item.debit - item.credit;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {item.accountCode}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.accountName}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        {item.debit.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        {item.credit.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-right font-medium ${
                          balance >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {balance >= 0 ? '' : '-'}$
                        {Math.abs(balance).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 text-center">
                        {item.endDate}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div>
                          <div className="font-medium">{item.approverName}</div>
                          <div className="text-xs text-gray-500">
                            {item.approverPosition}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Totals Row */}
                <tr className="bg-blue-100 border-t-2 border-blue-900 font-bold">
                  <td
                    className="px-4 py-3 text-sm text-gray-900 font-bold"
                    colSpan={3}
                  >
                    TOTAL ({filteredData.length} accounts)
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">
                    {totals.debit.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-bold">
                    {totals.credit.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm text-right font-bold ${
                      totals.debit - totals.credit >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {totals.debit - totals.credit >= 0 ? '' : '-'}$
                    {Math.abs(totals.debit - totals.credit).toLocaleString(
                      'en-US',
                      { minimumFractionDigits: 2 }
                    )}
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-600 text-center"
                    colSpan={2}
                  >
                    {totals.debit === totals.credit
                      ? 'BALANCED'
                      : totals.debit > totals.credit
                      ? 'DEBIT BALANCE'
                      : 'CREDIT BALANCE'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 sm:px-6 sm:py-4">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-6 text-sm text-gray-700">
          {/* Left Section */}
          <div className="flex flex-col gap-1">
            <span>
              <span className="font-medium">Trial Balance:</span> {selectedFund}{' '}
              — {selectedLedger}
            </span>
            <span>
              <span className="font-medium">Period:</span> {dateFrom} to{' '}
              {dateEnd}
            </span>
            <span>
              <span className="font-medium">Approver:</span> {selectedApprover}
            </span>
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-1 sm:items-end text-gray-600">
            <span>
              <span className="font-medium">Accounts:</span>{' '}
              {filteredData.length}
            </span>
            <span>
              <span className="font-medium">Generated on:</span>{' '}
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;
