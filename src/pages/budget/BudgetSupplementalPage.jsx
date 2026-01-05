import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckLine, PencilIcon, PrinterIcon, TrashIcon, X, FileText, FilterIcon, XIcon, Calendar, CheckCircle2, PhilippinePeso } from 'lucide-react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/common/Modal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import BudgetSupplementalForm from '@/components/forms/BudgetSupplementalForm';
import { toast } from 'react-hot-toast';
import DataTable from '@/components/common/DataTable';
import { useEffect } from 'react';
import { fetchDepartments } from '@/features/settings/departmentSlice';
import { fetchSubdepartments } from '@/features/settings/subdepartmentSlice';
import { fetchAccounts } from '@/features/settings/chartOfAccountsSlice';
import axiosInstance from '@/utils/axiosInstance';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';
import { fetchFunds } from '@/features/budget/fundsSlice';
import { fetchProjectDetails } from '@/features/settings/projectDetailsSlice';
import { useModulePermissions } from '@/utils/useModulePremission';
import { formatCurrency } from '@/utils/currencyFormater';
import { useReactToPrint } from 'react-to-print';

const BudgetSupplementalPage = () => {
  const dispatch = useDispatch();

  const { departments } = useSelector((state) => state.departments);
  const { subdepartments } = useSelector((state) => state.subdepartments);
  const chartOfAccounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );
  const { fiscalYears } = useSelector((state) => state.fiscalYears);
  const { funds } = useSelector((state) => state.funds);
  const { projectDetails } = useSelector((state) => state.projectDetails);
  const [data, setData] = useState([]);
  const [budgetList, setBudgetList] = useState([]);
  const [isLoading, setIsLoading] = useState('');
  // ---------------------USE MODULE PERMISSIONS------------------START (BudgetSupplementalPage - MODULE ID =  26 )
  const { Add, Edit, Delete, Print } = useModulePermissions(26);
  useEffect(() => {
    dispatch(fetchFiscalYears());
    dispatch(fetchFunds());
    dispatch(fetchProjectDetails());
    dispatch(fetchDepartments());
    dispatch(fetchSubdepartments());
    dispatch(fetchAccounts());
    fetchBudgetSupplementals();
    fetchBudgetList();
  }, []);

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Budget Supplemental',
  });
  const fetchBudgetSupplementals = async () => {
    try {
      const res = await axiosInstance('/budgetSupplemental/list');

      setData(res?.data);
    } catch (error) {
      toast.error('Failed to load data');
      toast.error(error.message);
    }
  };
  const fetchBudgetList = async () => {
    try {
      const res = await axiosInstance('/budgetSupplemental/budgetList');

      setBudgetList(res?.data);
    } catch (error) {
      toast.error('Failed to load data');
      toast.error(error.message);
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    subDepartment: '',
    chartOfAccounts: '',
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleEdit = (row) => {
    setActiveRow(row);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    setItemToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const response = await axiosInstance.post(
        `/budgetSupplemental/delete`,
        { ID: itemToDelete.ID }
      );
      if (response.data) {
        toast.success(response.data.message || 'Budget Supplemental Deleted Successfully');
        fetchBudgetSupplementals();
      } else {
        toast.error('Failed to delete Budget Supplemental');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete Budget Supplemental');
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Make API call using your axiosInstance
      const response = await axiosInstance.post(
        'budgetSupplemental/save',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data) {
        toast.success(
          activeRow
            ? 'Supplemental updated successfully'
            : 'New supplemental added'
        );

        fetchBudgetSupplementals();
      } else {
        toast.error('Failed to save supplemental');
      }
    } catch (error) {
      console.error('Error submitting supplemental:', error);
      toast.error(error.message || 'Failed to save supplemental');
    } finally {
      setIsModalOpen(false);
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

  // Apply filters to data
  const filteredData = data.filter((item) => {
    const { Budget } = item;
    return (
      (!filters.department || Budget?.DepartmentID == filters.department) &&
      (!filters.subDepartment ||
        Budget?.SubDepartmentID == filters.subDepartment) &&
      (!filters.chartOfAccounts ||
        Budget?.ChartofAccountsID == filters.chartOfAccounts)
    );
  });

  // Calculate summary statistics
  const summaryStats = React.useMemo(() => {
    const total = filteredData?.length || 0;
    const totalAmount = filteredData?.reduce((sum, item) => {
      const amount = parseFloat(item?.Total || 0);
      return sum + amount;
    }, 0) || 0;
    const requested = filteredData?.filter(item => item.Status?.toLowerCase().includes('requested')).length || 0;
    const approved = filteredData?.filter(item => item.Status?.toLowerCase().includes('approved')).length || 0;
    const rejected = filteredData?.filter(item => item.Status?.toLowerCase().includes('rejected')).length || 0;

    return {
      total,
      totalAmount,
      requested,
      approved,
      rejected,
    };
  }, [filteredData]);

  const columns = [
    {
      key: 'Status',
      header: 'Status',
      render: (value) => {
        const status = value?.toLowerCase() || '';
        const statusColors = {
          requested: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          approved: 'bg-green-100 text-green-800 border-green-200',
          rejected: 'bg-red-100 text-red-800 border-red-200',
        };
        const colorClass = statusColors[status] || 'bg-neutral-100 text-neutral-800 border-neutral-200';
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
            {value || 'N/A'}
          </span>
        );
      },
    },
    {
      key: 'InvoiceNumber',
      header: 'Invoice Number',
      className: 'text-neutral-900 font-medium',
      render: (_, row) => (
        <span className="text-neutral-900 font-medium">{row.InvoiceNumber || 'N/A'}</span>
      ),
    },
    {
      key: 'Budget',
      header: 'Budget Name',
      render: (_, row) => (
        <span className="text-neutral-700">{row.Budget?.Name || 'N/A'}</span>
      ),
    },
    {
      key: 'InvoiceDate',
      header: 'Invoice Date',
      render: (_, row) => {
        if (!row.InvoiceDate) return <span className="text-neutral-400">N/A</span>;
        const date = new Date(row.InvoiceDate);
        return (
          <span className="text-neutral-700">
            {date.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      key: 'Total',
      header: 'Total Amount',
      className: 'text-right font-semibold',
      render: (_, row) => {
        const total = parseFloat(row?.Total || 0);
        return (
          <span className="text-right font-semibold text-blue-700">
            {formatCurrency(total)}
          </span>
        );
      },
    },
  ];

  // const actions = [
  //   Edit && {
  //     icon: PencilIcon,
  //     title: 'Edit',
  //     onClick: handleEdit,
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   },
  //   Delete && {
  //     icon: TrashIcon,
  //     title: 'Delete',
  //     onClick: handleDelete,
  //     className:
  //       'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
  //   },
  // ];
  const handleBSPAction = async (info, action) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `/budgetSupplemental/${action}`,
        { ID: info.ID, LinkID: info.LinkID, Reason: 'This is the reason' }
      );
      console.log(`${action}d:`, response.data);

      // Update local state to reflect change immediately
      setData((prev) =>
        prev.map((item) =>
          item.ID === info.ID
            ? { ...item, Status: action === 'approve' ? 'Approved' : 'Rejected' }
            : item
        )
      );

      await fetchBudgetSupplementals();
      if (action === 'reject') {
        toast.error(`Budget Supplemental ${action}ed successfully`);
      } else {
        toast.success(`Budget Supplemental ${action}d successfully`);
      }
    } catch (error) {
      console.error(`Error ${action}ing Budget Supplemental:`, error);
      toast.error(`Error ${action}ing Budget Supplemental`);
    } finally {
      setIsLoading(false);
    }
  };
  const actions = (row) => {
    const actionList = [];

    if (row.Status.toLowerCase().includes('rejected') && Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: handleEdit,
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
      actionList.push({
        icon: TrashIcon,
        title: 'Delete',
        onClick: () => handleDelete(row),
        className:
          'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    } else if (row.Status === 'Requested') {
      actionList.push(
        {
          icon: CheckLine,
          title: 'Approve',
          onClick: () => handleBSPAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleBSPAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
        }
      );
    }

    return actionList;
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
                  Budget Supplemental
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Manage supplemental budget requests and approvals
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
                onClick={() => handleEdit(null)}
                className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <PlusIcon className="h-5 w-5" />
                Add Supplemental
              </button>
            )}
            {Print && activeRow && (
              <button
                onClick={handlePrint}
                className="btn btn-outline flex items-center gap-2"
              >
                <PrinterIcon className="h-5 w-5" />
                Print
              </button>
            )}
          </div>
        </div>

        {/* Summary Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Total Supplementals</p>
                <p className="text-2xl font-bold text-blue-900">{summaryStats.total}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-lg">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-medium text-green-700 mb-1">Total Amount</p>
                <p className="text-xl sm:text-2xl font-bold text-green-900 break-words">{formatCurrency(summaryStats.totalAmount)}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-lg flex-shrink-0">
                <PhilippinePeso className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">Requested</p>
                <p className="text-2xl font-bold text-yellow-900">{summaryStats.requested}</p>
              </div>
              <div className="p-3 bg-yellow-200 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700 mb-1">Approved</p>
                <p className="text-2xl font-bold text-emerald-900">{summaryStats.approved}</p>
              </div>
              <div className="p-3 bg-emerald-200 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-emerald-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Rejected</p>
                <p className="text-2xl font-bold text-red-900">{summaryStats.rejected}</p>
              </div>
              <div className="p-3 bg-red-200 rounded-lg">
                <XIcon className="h-6 w-6 text-red-700" />
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
                  {subdepartments?.map((sd) => (
                    <option key={sd.ID} value={sd.ID}>
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
                  {chartOfAccounts?.map((c) => (
                    <option key={c.ID} value={c.ID}>
                      {c.Name}
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
            Supplemental Entries
            <span className="ml-2 text-sm font-normal text-neutral-600">
              ({filteredData?.length || 0} {filteredData?.length === 1 ? 'entry' : 'entries'})
            </span>
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          loading={isLoading}
          actions={actions}
          pagination={true}
          onRowClick={(row) => {
            setActiveRow(row);
          }}
          selectedRow={activeRow}
        />
      </div>

      {/* Modal */}
      <Modal
        size="md"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={activeRow ? 'Edit Supplemental' : 'Add New Supplemental'}
      >
        <BudgetSupplementalForm
          budgetList={budgetList}
          departmentOptions={departments.map((dept) => ({
            value: dept.ID,
            label: dept.Name,
          }))}
          subDepartmentOptions={subdepartments.map((subDept) => ({
            value: subDept.ID,
            label: subDept.Name,
          }))}
          chartOfAccountsOptions={chartOfAccounts.map((account) => ({
            value: account.ID,
            label: account.Name,
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
        title="Delete Supplemental"
        message={`Are you sure you want to delete this supplemental budget? This action cannot be undone.`}
        isDestructive={true}
        confirmText="Delete"
      />

      {/* Hidden print area */}
      <div style={{ display: 'none' }}>
        <BudgetSupplementalPrint ref={printRef} row={activeRow} />
      </div>
    </div>
  );
};

export default BudgetSupplementalPage;

const BudgetSupplementalPrint = React.forwardRef(({ row }, ref) => {
  if (!row) return null;

  const supplemental = row.Budget || {};

  return (
    <div ref={ref} className="p-8 bg-white">
      <h2 className="text-xl font-bold text-center mb-2">
        MUNICIPALITY OF DUEÑAS
      </h2>
      <h3 className="text-center mb-2">
        BUDGET SUPPLEMENTAL ENTRY
      </h3>

      <table className="w-full mb-4 text-sm border">
        <tbody>
          <tr>
            <td className="font-semibold border px-2">Invoice Number:</td>
            <td className="border px-2">{row.InvoiceNumber || 'N/A'}</td>
          </tr>
          <tr>
            <td className="font-semibold border px-2">Budget:</td>
            <td className="border px-2">{supplemental.Name || 'N/A'}</td>
          </tr>
          <tr>
            <td className="font-semibold border px-2">Invoice Date:</td>
            <td className="border px-2">
              {row.InvoiceDate
                ? new Date(row.InvoiceDate).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })
                : 'N/A'}
            </td>
          </tr>
          <tr>
            <td className="font-semibold border px-2">Total Amount:</td>
            <td className="border px-2">
              {parseFloat(row.Total || 0).toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </td>
          </tr>
          <tr>
            <td className="font-semibold border px-2">Status:</td>
            <td className="border px-2">{row.Status || 'N/A'}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-8">
        <div>
          <div className="mb-1 font-bold">Budget S. Head</div>
          <div className="text-xs">Budget Head</div>
        </div>
        <div>
          <div className="mb-1 font-bold">Juan S. Dela Cruz</div>
          <div className="text-xs">Mayor</div>
        </div>
      </div>
    </div>
  );
});
