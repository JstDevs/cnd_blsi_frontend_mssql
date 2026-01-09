import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from '@/components/common/DataTable';
import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchSubdepartments } from '@/features/settings/subdepartmentSlice';
import { fetchAccounts } from '@/features/settings/chartOfAccountsSlice';
import Modal from '@/components/common/Modal';
import axiosInstance from '@/utils/axiosInstance';
import { formatCurrency } from '@/utils/currencyFormater';
import {
  FileText,
  // DollarSign,
  PhilippinePeso,
  FilterIcon,
  XIcon,
  TrendingUp,
  Calendar,
  BarChart3,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const BudgetSummaryPage = () => {
  const dispatch = useDispatch();

  const { departments, isLoading: departmentsLoading } = useSelector(
    (state) => state.departments
  );
  const { subdepartments, isLoading: subdepartmentsLoading } = useSelector(
    (state) => state.subdepartments
  );

  const accounts = useSelector((state) => state.chartOfAccounts?.accounts || []);

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    subDepartment: '',
    chartOfAccounts: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const handleClearFilters = () => {
    setFilters({ department: '', subDepartment: '', chartOfAccounts: '' });
  };

  const hasActiveFilters =
    filters.department || filters.subDepartment || filters.chartOfAccounts;

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchSubdepartments());
    dispatch(fetchAccounts());
    fetchBudgetSummaries();
  }, []);

  const fetchBudgetSummaries = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance(`/budgetSummary`);
      setData(response.data || []);
    } catch (error) {
      console.error('Error fetching budget summaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        (!filters.department || item.Department?.Name === filters.department) &&
        (!filters.subDepartment ||
          item.SubDepartment?.Name === filters.subDepartment) &&
        (!filters.chartOfAccounts ||
          item.ChartOfAccounts === filters.chartOfAccounts)
      );
    });
  }, [data, filters]);

  const summaryStats = useMemo(() => {
    const stats = filteredData.reduce(
      (acc, item) => {
        const appropriation = Number(item.Appropriation) || 0;
        const totalAmount = Number(item.TotalAmount) || 0;
        const supplemental = Number(item.Supplemental) || 0;
        const transfer = Number(item.Transfer) || 0;
        const released = Number(item.Released) || 0;
        const charges = Number(item.Charges) || 0;
        const preEncumbrance = Number(item.PreEncumbrance) || 0;
        const encumbrance = Number(item.Encumbrance) || 0;

        return {
          totalAppropriation: acc.totalAppropriation + appropriation,
          totalAppropriationBalance:
            acc.totalAppropriationBalance + (appropriation + supplemental + transfer - released),
          totalAmount: acc.totalAmount + totalAmount,
          totalAllotmentBalance:
            acc.totalAllotmentBalance + (released - charges),
          totalCharges: acc.totalCharges + charges,
          count: acc.count + 1,
        };
      },
      {
        totalAppropriation: 0,
        totalAppropriationBalance: 0,
        totalAmount: 0,
        totalAllotmentBalance: 0,
        totalCharges: 0,
        count: 0,
      }
    );

    return stats;
  }, [filteredData]);

  // Simplified columns: only show the fields requested by the UI redesign
  const columns = [
    {
      key: 'Name',
      header: 'Budget Name',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-neutral-900">{value || '—'}</span>
      ),
    },
    {
      key: 'FiscalYearID',
      header: 'Fiscal Year',
      sortable: true,
      render: (_, row) => (
        <span className="text-neutral-700">{row?.FiscalYear?.Name || '—'}</span>
      ),
    },
    {
      key: 'DepartmentID',
      header: 'Department',
      sortable: true,
      render: (_, row) => (
        <span className="text-neutral-700">{row?.Department?.Name || '—'}</span>
      ),
    },
    {
      key: 'SubDepartmentID',
      header: 'Sub Department',
      sortable: true,
      render: (_, row) => (
        <span className="text-neutral-600">{row?.SubDepartment?.Name || '—'}</span>
      ),
    },
    {
      key: 'ChartofAccountsID',
      header: 'Chart of Accounts',
      sortable: true,
      render: (_, row) => (
        <span className="text-neutral-700">{row?.ChartofAccounts?.Name || '—'}</span>
      ),
    },
    {
      key: 'FundsID',
      header: 'Fund',
      sortable: true,
      render: (_, row) => (
        <span className="text-neutral-700">{row?.Funds?.Name || '—'}</span>
      ),
    },
    {
      key: 'ProjectID',
      header: 'Project',
      sortable: true,
      render: (_, row) => (
        <span className="text-neutral-600">{row?.Project?.Title || '—'}</span>
      ),
    },
  ];

  /*
   ORIGINAL FULL COLUMNS (commented out for future use):

   const columns = [
     {
       key: 'Name',
       header: 'Budget Name',
       sortable: true,
       render: (value) => (
         <span className="font-medium text-neutral-900">{value || '—'}</span>
       ),
     },
     {
       key: 'FiscalYearID',
       header: 'Fiscal Year',
       sortable: true,
       render: (_, row) => (
         <span className="text-neutral-700">{row?.FiscalYear?.Name || '—'}</span>
       ),
     },
     {
       key: 'DepartmentID',
       header: 'Department',
       sortable: true,
       render: (_, row) => (
         <span className="text-neutral-700">{row?.Department?.Name || '—'}</span>
       ),
     },
     {
       key: 'SubDepartmentID',
       header: 'Sub Department',
       sortable: true,
       render: (_, row) => (
         <span className="text-neutral-600">{row?.SubDepartment?.Name || '—'}</span>
       ),
     },
     {
       key: 'ChartofAccountsID',
       header: 'Chart of Accounts',
       sortable: true,
       render: (_, row) => (
         <span className="text-neutral-700">{row?.ChartofAccounts?.Name || '—'}</span>
       ),
     },
     {
       key: 'FundsID',
       header: 'Fund',
       sortable: true,
       render: (_, row) => (
         <span className="text-neutral-700">{row?.Funds?.Name || '—'}</span>
       ),
     },
     {
       key: 'ProjectID',
       header: 'Project',
       sortable: true,
       render: (_, row) => (
         <span className="text-neutral-600">{row?.Project?.Title || '—'}</span>
       ),
     },
     {
       key: 'Appropriation',
       header: 'Appropriation',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right font-semibold text-green-700">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'AppropriationBalance',
       header: 'Appropriation Balance',
       sortable: true,
       className: 'text-right',
       render: (value) => {
         const numValue = Number(value) || 0;
         return (
           <span className={`text-right font-medium ${numValue >= 0 ? 'text-green-700' : 'text-red-600'}`}>
             {formatCurrency(value)}
           </span>
         );
       },
     },
     {
       key: 'TotalAmount',
       header: 'Total Amount',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right font-semibold text-blue-700">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'ChargedAllotment',
       header: 'Allotment',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right font-medium text-orange-700">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'AllotmentBalance',
       header: 'Allotment Balance',
       sortable: true,
       className: 'text-right',
       render: (value) => {
         const numValue = Number(value) || 0;
         return (
           <span className={`text-right font-medium ${numValue >= 0 ? 'text-green-700' : 'text-red-600'}`}>
             {formatCurrency(value)}
           </span>
         );
       },
     },
     {
       key: 'Change',
       header: 'Change',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'Supplemental',
       header: 'Supplemental',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'Released',
       header: 'Released',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'Charges',
       header: 'Charges',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right font-medium text-orange-700">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'PreEncumbrance',
       header: 'Pre Encumbr.',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'Encumbrance',
       header: 'Encumbrance',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'January',
       header: 'Jan',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'February',
       header: 'Feb',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'March',
       header: 'Mar',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'April',
       header: 'Apr',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'May',
       header: 'May',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'June',
       header: 'Jun',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'July',
       header: 'Jul',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'August',
       header: 'Aug',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'September',
       header: 'Sep',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'October',
       header: 'Oct',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'November',
       header: 'Nov',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
     {
       key: 'December',
       header: 'Dec',
       sortable: true,
       className: 'text-right',
       render: (value) => (
         <span className="text-right text-neutral-600">{formatCurrency(value)}</span>
       ),
     },
   ];
  */
  const handleRowClick = (row) => {
    setSelectedBudget(row);
    setIsModalOpen(true);
  };
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
                  Budget Summary
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Review and analyze budget performance across departments, months, and categories
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
          </div>
        </div>

        {/* Summary Statistics Cards */}
        {!loading && filteredData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-900">{formatCurrency(summaryStats.totalAmount)}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-700" />
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
                  <p className="text-sm font-medium text-purple-700 mb-1">Total Records</p>
                  <p className="text-2xl font-bold text-purple-900">{summaryStats.count}</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </div>
          </div>
        )}

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
                    <option key={d.ID} value={d.Name}>
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
                  {subdepartments?.map((sd) => (
                    <option key={sd.ID} value={sd.Name}>
                      {sd.Name}
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
                    <option key={a.ID} value={a.Name}>
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
            Budget Summary Entries
            <span className="ml-2 text-sm font-normal text-neutral-600">
              ({filteredData.length} {filteredData.length === 1 ? 'entry' : 'entries'})
            </span>
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          loading={loading || departmentsLoading || subdepartmentsLoading}
          pagination={true}
          onRowClick={handleRowClick}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Budget Summary Details"
        size="xxxl"
      >
        <BudgetSummaryDetail data={selectedBudget} />
      </Modal>
    </div>
  );
};

export default BudgetSummaryPage;
const BudgetSummaryDetail = ({ data }) => {
  if (!data) return null;

  const get = (val) => val || '—';

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-600" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Budget Name
            </p>
            <p className="text-sm font-semibold text-neutral-900">
              {get(data.Name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Fiscal Year
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {get(data.FiscalYear?.Name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Department
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {get(data.Department?.Name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Sub Department
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {get(data.SubDepartment?.Name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Chart of Accounts
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {get(data.ChartofAccounts?.Name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Fund
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {get(data.Funds?.Name)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Project
            </p>
            <p className="text-sm font-medium text-neutral-700">
              {get(data.Project?.Title)}
            </p>
          </div>
        </div>
      </div>

      {/* Financial Summary Section */}
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <PhilippinePeso className="h-5 w-5 text-primary-600" />
          Financial Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Appropriation (Original)
            </p>
            <p className="text-lg font-bold text-green-700">
              {formatCurrency(data.Appropriation)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Appropriation Balance
            </p>
            <p
              className={`text-lg font-bold ${Number(data.AppropriationBalance) >= 0
                ? 'text-green-700'
                : 'text-red-600'
                }`}
            >
              {formatCurrency(Number(data.Appropriation) + Number(data.Supplemental) + Number(data.Transfer) - Number(data.Released))}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Appropriation (Adjusted)
            </p>
            <p className="text-lg font-bold text-blue-700">
              {formatCurrency(Number(data.Appropriation) + Number(data.Supplemental) + Number(data.Transfer))}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Adjustments
            </p>
            <p className="text-lg font-semibold text-neutral-700">
              {formatCurrency(Number(data.Supplemental) + Number(data.Transfer))}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Total Allotment
            </p>
            <p className="text-lg font-bold text-orange-700">
              {formatCurrency(data.Released)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Allotment Balance
            </p>
            <p
              className={`text-lg font-bold ${(Number(data.Released) - Number(data.Charges)) >= 0
                ? 'text-green-700'
                : 'text-red-600'
                }`}
            >
              {formatCurrency(Number(data.Released) - Number(data.Charges))}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Pre Encumbrance
            </p>
            <p className="text-lg font-semibold text-neutral-700">
              {formatCurrency(data.PreEncumbrance)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Encumbrance
            </p>
            <p className="text-lg font-semibold text-neutral-700">
              {formatCurrency(data.Encumbrance)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-neutral-200">
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
              Charges
            </p>
            <p className="text-lg font-bold text-orange-700">
              {formatCurrency(data.Charges)}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Distribution Section */}
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary-600" />
          Monthly Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ].map((month) => (
            <div
              key={month}
              className="bg-white p-3 rounded-lg border border-neutral-200"
            >
              <p className="text-xs font-medium text-neutral-500 mb-1">
                {month.slice(0, 3)}
              </p>
              <p className="text-sm font-semibold text-neutral-900">
                {formatCurrency(data[month])}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-neutral-300 bg-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-700">Total Amount</p>
            <p className="text-xl font-bold text-blue-700">
              {formatCurrency(data.TotalAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
