import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  Building2,
} from 'lucide-react';
import BudgetForm from '../../../components/forms/BudgetForm';
import Modal from '../../../components/common/Modal';
import { useSelector } from 'react-redux';

const BudgetDetails = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useSelector((state) => state.auth);

  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterSubDepartment, setFilterSubDepartment] = useState('all');
  const [filterAccount, setFilterAccount] = useState('all');
  const [filterFund, setFilterFund] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [budgetStats, setBudgetStats] = useState(null);
  const [budgetDetails, setBudgetDetails] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleAddNew = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const fetchBudgetDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/budget`, { method: 'GET' });
      const res = await response.json();
      if (res?.status) {
        const { items, status, ...rest } = res || {};
        setBudgetDetails(res?.items || []);
        setBudgetStats(rest);
      } else {
        console.log('Something went wrong');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/budget/${id}`, {
        method: 'DELETE',
      });
      const res = await response.json();
      if (res) {
        fetchBudgetDetails();
        setIsModalOpen(false);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleCreate = async (values) => {
    try {
      const response = await fetch(`${API_URL}/budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          FiscalYearID: values?.fiscalYear,
          FundID: values?.fund,
          ProjectID: values?.project,
          Name: values?.budgetName,
          DepartmentID: values?.department,
          SubDepartmentID: values?.subDepartment,
          ChartofAccountsID: values?.chartOfAccounts,
          Appropriation: values?.appropriation,
          TotalAmount: values?.totalAmount,
          AppropriationBalance: values?.charges,
          Charges: values?.charges,
          January: values?.january,
          February: values?.february,
          March: values?.march,
          April: values?.april,
          May: values?.may,
          June: values?.june,
          July: values?.july,
          August: values?.august,
          September: values?.september,
          October: values?.october,
          November: values?.november,
          December: values?.december,
          CreatedBy: user?.UserName,
          CreatedDate: new Date().toISOString(),
          ModifyBy: user?.UserName,
          ModifyDate: new Date().toISOString(),
        }),
      });
      const res = await response.json();
      if (res) {
        fetchBudgetDetails();
        setIsModalOpen(false);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const response = await fetch(`${API_URL}/budget/${values?.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FiscalYearID: values?.fiscalYear,
          FundID: values?.fund,
          ProjectID: values?.project,
          Name: values?.budgetName,
          DepartmentID: values?.department,
          SubDepartmentID: values?.subDepartment,
          ChartofAccountsID: values?.chartOfAccounts,
          Appropriation: values?.appropriation,
          TotalAmount: values?.totalAmount,
          AppropriationBalance: values?.charges,
          Charges: values?.charges,
          January: values?.january,
          February: values?.february,
          March: values?.march,
          April: values?.april,
          May: values?.may,
          June: values?.june,
          July: values?.july,
          August: values?.august,
          September: values?.september,
          October: values?.october,
          November: values?.november,
          December: values?.december,
          CreatedBy: user?.UserName,
          CreatedDate: new Date().toISOString(),
          ModifyBy: user?.UserName,
          ModifyDate: new Date().toISOString(),
        }),
      });
      const res = await response.json();
      if (res) {
        fetchBudgetDetails();
        setIsModalOpen(false);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleSubmit = async (values) => {
    if (selectedRecord) {
      handleUpdate(values);
    } else {
      handleCreate(values);
    }
  };

  const departments = [
    'all',
    'Office of the Mayor',
    'Accounting',
    'Treasury',
    'Municipal Social Welfare',
    'Municipal Engineering',
  ];
  const subDepartments = [
    'all',
    'Network Operations',
    'Payroll',
    'No Subdepartments',
  ];
  const accounts = [
    'all',
    'Cash - Local Treasury',
    'Investments',
    'Allowance for Bad Debts',
    'Prepaid Registration',
    'Welfare Goods',
    'Office Equipment',
    'Due to LGUs',
  ];
  const funds = [
    'all',
    'General Fund',
    'Trust Fund',
    'Special Fund',
    'Capital Fund',
  ];

  const filteredItems = budgetDetails?.filter((item) => {
    const matchesSearch =
      item?.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item?.Department?.Name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === 'all' || item?.Department?.Name === filterDepartment;
    const matchesSubDepartment =
      filterSubDepartment === 'all' ||
      item?.SubDepartment?.Name === filterSubDepartment;
    const matchesAccount =
      filterAccount === 'all' || item?.ChartofAccountsID === filterAccount;
    const matchesFund = filterFund === 'all' || item.fund === filterFund;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesSubDepartment &&
      matchesAccount &&
      matchesFund
    );
  });

  useEffect(() => {
    fetchBudgetDetails();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Budget Details Management
          </h2>
          <p className="text-gray-600">
            Comprehensive budget planning and allocation tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Table
            </button>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Budget
          </button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-600">Total Budgets</p>
              <p className="text-2xl font-bold text-gray-900">
                {budgetStats?.totalbudgets}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {filteredItems.filter((b) => b.status === 'active').length}{' '}
                active
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-600">
                Total Appropriation
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${budgetStats?.totalappropriations}
              </p>
              <p className="text-sm text-gray-500 mt-1">Across all budgets</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-600">
                Total Allotment
              </p>
              <p className="text-2xl font-bold text-blue-600">
                ${budgetStats?.totalallotement}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {budgetStats?.totalappropriations > 0
                  ? (
                      (budgetStats?.totalallotement /
                        budgetStats?.totalappropriations) *
                      100
                    ).toFixed(1)
                  : 0}
                % allocated
              </p>
            </div>
            <PieChart className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-600">Total Charges</p>
              <p className="text-2xl font-bold text-purple-600">
                ${budgetStats?.totalcharges}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {budgetStats?.totalallotement > 0
                  ? (
                      (budgetStats?.totalcharges /
                        budgetStats?.totalallotement) *
                      100
                    ).toFixed(1)
                  : 0}
                % utilized
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-600">
                Available Balance
              </p>
              <p className="text-2xl font-bold text-green-600">
                ${budgetStats?.totalbalance}
              </p>
              <p className="text-sm text-gray-500 mt-1">Remaining funds</p>
            </div>
            <Building2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 pt-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, code, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
            <select
              value={filterSubDepartment}
              onChange={(e) => setFilterSubDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subDepartments.map((subDept) => (
                <option key={subDept} value={subDept}>
                  {subDept === 'all' ? 'All Sub Departments' : subDept}
                </option>
              ))}
            </select>
            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {accounts.map((account) => (
                <option key={account} value={account}>
                  {account === 'all' ? 'All Accounts' : account}
                </option>
              ))}
            </select>
            <select
              value={filterFund}
              onChange={(e) => setFilterFund(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {funds.map((fund) => (
                <option key={fund} value={fund}>
                  {fund === 'all' ? 'All Funds' : fund}
                </option>
              ))}
            </select>
            <div className="flex items-center">
              <Filter className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                {filteredItems.length} results
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Items List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {budgetDetails?.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedBudget(item)}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all ${
                selectedBudget?.id === item.id
                  ? 'ring-2 ring-blue-500 border-blue-500'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.Name}
                  </h3>
                  <p className="text-sm text-gray-600">{item.code}</p>
                  <p className="text-sm text-gray-500">{item.department}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Appropriation</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${item?.Appropriation?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Allotment</span>
                  <span className="text-sm font-medium text-blue-600">
                    ${item?.AllotmentBalance?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Charges</span>
                  <span className="text-sm font-medium text-purple-600">
                    ${item?.ChargedAllotment?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Balance</span>
                  <span className="text-sm font-medium text-green-600">
                    ${item?.AppropriationBalance?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  Updated {new Date(item?.ModifyDate).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-800 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appropriation
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgetDetails?.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer`}
                    onClick={() => setSelectedBudget(item)}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm capitalize font-medium text-gray-900">
                        {item?.Name}
                      </p>
                      <p className="text-sm text-gray-500">{item?.ID}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm capitalize text-gray-900">
                        {departments[Number(item?.DepartmentID)]}
                      </div>
                      <div className="text-sm capitalize text-gray-500">
                        {subDepartments[Number(item?.SubDepartmentID)]}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      ${item?.Appropriation.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-green-600">
                      ${item?.AppropriationBalance?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button className="text-green-600 hover:text-green-800 transition-colors">
                          <Edit2
                            className="w-4 h-4"
                            onClick={() => handleEdit(item)}
                          />
                        </button>
                        <button className="text-red-600 hover:text-red-800 transition-colors">
                          <Trash2
                            className="w-4 h-4"
                            onClick={() => handleDelete(item?.ID)}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        size="lg"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRecord ? 'Edit Budget' : 'Add New Budget'}
      >
        <BudgetForm
          onSubmit={handleSubmit}
          initialData={selectedRecord}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default BudgetDetails;
