import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon, FilterIcon, XIcon, DollarSign, TrendingUp, FileText, Calendar, PhilippinePeso } from 'lucide-react';
import { toast } from 'react-hot-toast';

import Modal from '@/components/common/Modal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import DataTable from '@/components/common/DataTable';
import BudgetForm from '@/components/forms/BudgetForm';

import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchSubdepartments } from '@/features/settings/subdepartmentSlice';
import { fetchAccounts } from '@/features/settings/chartOfAccountsSlice';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';
import { fetchFunds } from '@/features/budget/fundsSlice';
import { fetchProjectDetails } from '@/features/settings/projectDetailsSlice';
import { useModulePermissions } from '@/utils/useModulePremission';
import { formatCurrency } from '@/utils/currencyFormater';

const API_URL = import.meta.env.VITE_API_URL;
const mapFormToPayload = (values) => {
  return {
    IsNew: !values?.ID,
    ID: values?.ID || '',
    Name: values.Name,
    FiscalYearID: Number(values.FiscalYearID),
    DepartmentID: Number(values.DepartmentID),
    SubDepartmentID: Number(values.SubDepartmentID),
    ChartOfAccountsID: Number(values.ChartofAccountsID),
    FundID: Number(values.FundID),
    ProjectID: Number(values.ProjectID),
    Appropriation: Number(values.Appropriation),
    Charges: Number(values.Charges),
    January: Number(values.January),
    February: Number(values.February),
    March: Number(values.March),
    April: Number(values.April),
    May: Number(values.May),
    June: Number(values.June),
    July: Number(values.July),
    August: Number(values.August),
    September: Number(values.September),
    October: Number(values.October),
    November: Number(values.November),
    December: Number(values.December),
  };
};

const BudgetDetailsPage = () => {
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.auth);
  const { departments } = useSelector((state) => state.departments);
  const { subdepartments } = useSelector((state) => state.subdepartments);
  const accounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );
  const { fiscalYears } = useSelector((state) => state.fiscalYears);
  const { funds } = useSelector((state) => state.funds);
  const { projectDetails } = useSelector((state) => state.projectDetails);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    subDepartment: '',
    chartOfAccounts: '',
  });

  // ---------------------USE MODULE PERMISSIONS------------------START (BudgetDetailsPage - MODULE ID =  22 )
  const { Add, Edit, Delete } = useModulePermissions(22);
  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchSubdepartments());
    dispatch(fetchAccounts());
    dispatch(fetchFiscalYears());
    dispatch(fetchFunds());
    dispatch(fetchProjectDetails());
    fetchBudgetDetails();
  }, []);

  const fetchBudgetDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/budget`);
      const json = await res.json();
      if (json?.status) {
        setData(json?.items || []);
      } else {
        toast.error('Failed to fetch budget details');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      department: '',
      subDepartment: '',
      chartOfAccounts: '',
    });
  };

  const hasActiveFilters = filters.department || filters.subDepartment || filters.chartOfAccounts;

  const handleSubmit = (values) => {
    activeRow ? handleUpdate(values) : handleCreate(values);
  };

  const handleCreate = async (values) => {
    try {
      const res = await fetch(`${API_URL}/budgetDetails/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(mapFormToPayload(values)),
      });
      const json = await res.json();
      if (json) {
        fetchBudgetDetails();
        setIsModalOpen(false);
        toast.success('Budget added successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (values) => {
    try {
      const res = await fetch(`${API_URL}/budgetDetails/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(mapFormToPayload(values)),
      });
      const json = await res.json();
      if (json) {
        fetchBudgetDetails();
        setIsModalOpen(false);
        toast.success('Budget updated successfully');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = (row) => {
    setItemToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`${API_URL}/budget/${itemToDelete.ID}`, { method: 'DELETE' });
      const json = await res.json();
      if (json) {
        fetchBudgetDetails();
        toast.success('Budget deleted');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const columns = [
    {
      key: 'Name',
      header: 'Budget Name',
      className: 'text-neutral-900 font-medium',
      render: (value) => (
        <span className="text-neutral-900 font-medium">{value || 'N/A'}</span>
      ),
    },
    {
      key: 'FiscalYearID',
      header: 'Fiscal Year',
      render: (_, row) => {
        const fiscalYear = row?.FiscalYear?.Name;
        return fiscalYear ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {fiscalYear}
          </span>
        ) : (
          <span className="text-neutral-400">N/A</span>
        );
      },
    },
    {
      key: 'DepartmentID',
      header: 'Department',
      render: (_, row) => {
        const deptName = row?.Department?.Name;
        return deptName ? (
          <span className="text-neutral-700">{deptName}</span>
        ) : (
          <span className="text-neutral-400">N/A</span>
        );
      },
    },
    {
      key: 'SubDepartmentID',
      header: 'Sub Department',
      render: (_, row) => {
        const subDeptName = row?.SubDepartment?.Name;
        return subDeptName ? (
          <span className="text-neutral-700">{subDeptName}</span>
        ) : (
          <span className="text-neutral-400">N/A</span>
        );
      },
    },
    {
      key: 'ChartofAccountsID',
      header: 'Chart of Accounts',
      render: (_, row) => {
        const accountName = row?.ChartofAccounts?.Name;
        return accountName ? (
          <span className="text-neutral-700">{accountName}</span>
        ) : (
          <span className="text-neutral-400">N/A</span>
        );
      },
    },
    {
      key: 'FundID',
      header: 'Fund',
      render: (_, row) => {
        const fundName = row?.Funds?.Name;
        return fundName ? (
          <span className="text-neutral-700">{fundName}</span>
        ) : (
          <span className="text-neutral-400">N/A</span>
        );
      },
    },
    {
      key: 'ProjectID',
      header: 'Project',
      render: (_, row) => {
        const projectTitle = row?.Project?.Title;
        return projectTitle ? (
          <span className="text-neutral-700">{projectTitle}</span>
        ) : (
          <span className="text-neutral-400">N/A</span>
        );
      },
    },
    // COMMENTED OUT FOR SIMPLIFIED VIEW - CAN BE RESTORED FOR FUTURE USE
    // {
    //   key: 'Appropriation',
    //   header: 'Appropriation',
    //   className: 'text-right font-semibold',
    //   render: (value) => (
    //     <span className="text-right font-semibold text-green-700">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'AppropriationBalance',
    //   header: 'Appropriation Balance',
    //   className: 'text-right',
    //   render: (value) => {
    //     const numValue = Number(value) || 0;
    //     const isPositive = numValue >= 0;
    //     return (
    //       <span className={`text-right font-medium ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
    //         {formatCurrency(value)}
    //       </span>
    //     );
    //   },
    // },
    // {
    //   key: 'TotalAmount',
    //   header: 'Total Amount',
    //   className: 'text-right font-semibold',
    //   render: (value) => (
    //     <span className="text-right font-semibold text-blue-700">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'AllotmentBalance',
    //   header: 'Allotment Balance',
    //   className: 'text-right',
    //   render: (value) => {
    //     const numValue = Number(value) || 0;
    //     const isPositive = numValue >= 0;
    //     return (
    //       <span className={`text-right font-medium ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
    //         {formatCurrency(value)}
    //       </span>
    //     );
    //   },
    // },
    // {
    //   key: 'ChargedAllotment',
    //   header: 'Charges',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right font-medium text-orange-700">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'PreEncumbrance',
    //   header: 'Pre Encumbrance',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right font-medium text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'Encumbrance',
    //   header: 'Encumbrance',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right font-medium text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'January',
    //   header: 'Jan',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'February',
    //   header: 'Feb',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'March',
    //   header: 'Mar',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'April',
    //   header: 'Apr',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'May',
    //   header: 'May',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'June',
    //   header: 'Jun',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'July',
    //   header: 'Jul',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'August',
    //   header: 'Aug',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'September',
    //   header: 'Sep',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'October',
    //   header: 'Oct',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'November',
    //   header: 'Nov',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
    // {
    //   key: 'December',
    //   header: 'Dec',
    //   className: 'text-right',
    //   render: (value) => (
    //     <span className="text-right text-neutral-600">
    //       {formatCurrency(value)}
    //     </span>
    //   ),
    // },
  ];

  // Actions always visible but disabled based on permissions
  // IMPORTANT: This array should ALWAYS have items to ensure Actions column is always visible
  const actions = [
    {
      icon: PencilIcon,
      title: Edit ? 'Edit Budget' : 'Edit (No Permission)',
      onClick: Edit
        ? (row) => {
          setActiveRow(row);
          setIsModalOpen(true);
        }
        : () => {
          toast.error('You do not have permission to edit');
        },
      className: Edit
        ? 'text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-sm hover:shadow'
        : 'text-neutral-400 cursor-not-allowed p-2 rounded-lg opacity-50',
      disabled: !Edit,
    },
    {
      icon: TrashIcon,
      title: Delete ? 'Delete Budget' : 'Delete (No Permission)',
      onClick: Delete
        ? (row) => handleDelete(row)
        : () => {
          toast.error('You do not have permission to delete');
        },
      className: Delete
        ? 'text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow'
        : 'text-neutral-400 cursor-not-allowed p-2 rounded-lg opacity-50',
      disabled: !Delete,
    },
  ].filter(Boolean); // Ensure no null/undefined items

  const filteredData = data.filter((item) => {
    return (
      (!filters.department || item.Department?.ID == filters.department) &&
      (!filters.subDepartment ||
        item.SubDepartment?.ID == filters.subDepartment) &&
      (!filters.chartOfAccounts ||
        item.ChartofAccounts?.ID == filters.chartOfAccounts)
    );
  });

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = filteredData.length;
    const totalAppropriation = filteredData.reduce((sum, item) => sum + (Number(item.Appropriation) || 0), 0);
    const totalCharges = filteredData.reduce((sum, item) => sum + (Number(item.ChargedAllotment) || 0), 0);
    const totalBalance = filteredData.reduce((sum, item) => sum + ((Number(item.Released) || 0) - (Number(item.Charges) || 0)), 0);

    return {
      total,
      totalAppropriation,
      totalCharges,
      totalBalance,
    };
  }, [filteredData]);

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Budget Appropriations
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  View and manage detailed budget entries
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn btn-outline flex items-center gap-2 transition-all ${showFilters || hasActiveFilters
                ? 'bg-primary-50 border-primary-300 text-primary-700 shadow-sm'
                : 'hover:bg-neutral-50'
                }`}
            >
              <FilterIcon className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-primary-600 text-white rounded-full">
                  {[filters.department, filters.subDepartment, filters.chartOfAccounts].filter(Boolean).length}
                </span>
              )}
            </button>
            {Add && (
              <button
                onClick={() => {
                  setActiveRow(null);
                  setIsModalOpen(true);
                }}
                className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <PlusIcon className="h-5 w-5" />
                Add Budget
              </button>
            )}
          </div>
        </div>

        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Total Entries</p>
                <p className="text-2xl font-bold text-blue-900">{summaryStats.total}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Total Appropriation</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(summaryStats.totalAppropriation)}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg">
                <PhilippinePeso className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 mb-1">Total Charges</p>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(summaryStats.totalCharges)}</p>
              </div>
              <div className="p-3 bg-orange-200 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Total Balance</p>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(summaryStats.totalBalance)}</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {(showFilters || hasActiveFilters) && (
          <div className="bg-white border border-neutral-200 rounded-xl shadow-md p-5 mb-6 transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <FilterIcon className="h-5 w-5 text-primary-600" />
                <h3 className="text-base font-semibold text-neutral-800">Filter Options</h3>
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors border border-neutral-200"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="Close filters"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Department
                </label>
                <select
                  name="department"
                  value={filters.department}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-all hover:border-neutral-400"
                >
                  <option value="">All Departments</option>
                  {departments?.map((d) => (
                    <option key={d.ID} value={d.ID}>
                      {d.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Sub Department
                </label>
                <select
                  name="subDepartment"
                  value={filters.subDepartment}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-all hover:border-neutral-400"
                >
                  <option value="">All Sub Departments</option>
                  {subdepartments?.map((s) => (
                    <option key={s.ID} value={s.ID}>
                      {s.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Chart of Accounts
                </label>
                <select
                  name="chartOfAccounts"
                  value={filters.chartOfAccounts}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-all hover:border-neutral-400"
                >
                  <option value="">All Accounts</option>
                  {accounts?.map((a) => (
                    <option key={a.ID} value={a.ID}>
                      {a.Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="text-lg font-semibold text-neutral-900">
            Budget Entries
            <span className="ml-2 text-sm font-normal text-neutral-600">
              ({filteredData.length} {filteredData.length === 1 ? 'entry' : 'entries'})
            </span>
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          actions={actions} // Always has 2 items (Edit & Delete) - Actions column will always be visible
          pagination
          onRowClick={(row) => {
            setActiveRow(row);
            setIsViewModalOpen(true);
          }}
          selectedRow={activeRow}
        />
      </div>

      {/* Modal */}
      <Modal
        size="lg"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeRow ? 'Edit Budget' : 'Add Budget'}
      >
        <BudgetForm
          departmentOptions={departments.map((dept) => ({
            value: dept.ID,
            label: dept.Name,
          }))}
          subDepartmentOptions={subdepartments.map((subDept) => ({
            value: subDept.ID,
            label: subDept.Name,
          }))}
          chartOfAccountsOptions={[...accounts]
            .sort((a, b) => (a.AccountCode || '').localeCompare(b.AccountCode || ''))
            .map((account) => ({
              value: account.ID,
              label: `${account.AccountCode} - ${account.Name}`,
          }))}
          fundOptions={funds.map((fund) => ({
            value: fund.ID,
            label: fund.Name,
          }))}
          projectOptions={projectDetails.map((project) => ({
            value: project.ID,
            label: project.Title,
          }))}
          fiscalYearOptions={fiscalYears.map((fiscalYear) => ({
            value: fiscalYear.ID,
            label: fiscalYear.Name,
          }))}
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Budget"
        message={`Are you sure you want to delete the budget "${itemToDelete?.Name}"? This action cannot be undone.`}
        isDestructive={true}
        confirmText="Delete"
      />

      {/* View Details Modal */}
      <Modal
        size="xxxl"
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Budget Details"
      >
        {activeRow && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Budget Name</label>
                <p className="text-base font-semibold text-neutral-900">{activeRow.Name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Fiscal Year</label>
                <p className="text-base text-neutral-900">{activeRow.FiscalYear?.Name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Department</label>
                <p className="text-base text-neutral-900">{activeRow.Department?.Name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Sub Department</label>
                <p className="text-base text-neutral-900">{activeRow.SubDepartment?.Name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Chart of Accounts</label>
                <p className="text-base text-neutral-900">{activeRow.ChartofAccounts?.Name || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Fund</label>
                <p className="text-base text-neutral-900">{activeRow.Funds?.Name || 'N/A'}</p>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Project</label>
                <p className="text-base text-neutral-900">{activeRow.Project?.Title || 'N/A'}</p>
              </div>
            </div>

            <hr className="border-neutral-200" />

            {/* Financial Summary */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Financial Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-green-700 mb-1">Appropriation</label>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(activeRow.Appropriation)}</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-blue-700 mb-1">Total Allotted</label>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(activeRow.Released)}</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-orange-700 mb-1">Charges</label>
                  <p className="text-2xl font-bold text-orange-900">{formatCurrency(activeRow.Charges)}</p>
                </div>
                <div className={`border rounded-lg p-4 ${Number(activeRow.AppropriationBalance) >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <label className={`block text-sm font-medium mb-1 ${Number(activeRow.AppropriationBalance) >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>Appropriation Balance</label>
                  <p className={`text-2xl font-bold ${Number(activeRow.Appropriation) + Number(activeRow.Supplemental || 0) + Number(activeRow.Transfer || 0) - Number(activeRow.Released) >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>{formatCurrency(Number(activeRow.Appropriation) + Number(activeRow.Supplemental || 0) + Number(activeRow.Transfer || 0) - Number(activeRow.Released))}</p>
                </div>
                <div className={`border rounded-lg p-4 ${(Number(activeRow.Released) - Number(activeRow.Charges)) >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <label className={`block text-sm font-medium mb-1 ${(Number(activeRow.Released) - Number(activeRow.Charges)) >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>Allotment Balance</label>
                  <p className={`text-2xl font-bold ${(Number(activeRow.Released) - Number(activeRow.Charges)) >= 0 ? 'text-emerald-900' : 'text-red-900'}`}>{formatCurrency(Number(activeRow.Released) - Number(activeRow.Charges))}</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Pre Encumbrance</label>
                  <p className="text-2xl font-bold text-neutral-900">{formatCurrency(activeRow.PreEncumbrance)}</p>
                </div>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Encumbrance</label>
                  <p className="text-2xl font-bold text-neutral-900">{formatCurrency(activeRow.Encumbrance)}</p>
                </div>
              </div>
            </div>

            <hr className="border-neutral-200" />

            {/* Monthly Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Monthly Breakdown</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                  <div key={month} className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                    <label className="block text-xs font-medium text-neutral-600 mb-1">{month}</label>
                    <p className="text-sm font-semibold text-neutral-900">{formatCurrency(activeRow[month])}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BudgetDetailsPage;

