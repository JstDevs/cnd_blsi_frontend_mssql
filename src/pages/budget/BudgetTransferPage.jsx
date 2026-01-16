import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CheckLine,
  PencilIcon,
  TrashIcon,
  X,
  Plus,
  FileText,
  // DollarSign,
  FilterIcon,
  XIcon,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PhilippinePeso,
  Eye,
} from 'lucide-react';
import Modal from '@/components/common/Modal';
import BudgetTransferForm from '@/components/forms/BudgetTransferForm';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { toast } from 'react-hot-toast';
import DataTable from '@/components/common/DataTable';
import {
  createBudgetTransfer,
  fetchBudgetOptions,
  fetchBudgetTransfers,
} from '@/features/budget/budgetTransferSlice';
import { useModulePermissions } from '@/utils/useModulePremission';
import axiosInstance from '@/utils/axiosInstance';
import { formatCurrency } from '@/utils/currencyFormater';

const BudgetTransferPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    budget: '',
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const dispatch = useDispatch();
  // ---------------------USE MODULE PERMISSIONS------------------START (BudgetTransferPage - MODULE ID =  27 )
  const { Add, Edit } = useModulePermissions(27);
  const {
    transfers: data,
    budgetOptions,
    loading,
    error,
  } = useSelector((state) => state.budgetTransfer);

  const handleClearFilters = () => {
    setFilters({
      status: '',
      budget: '',
    });
  };

  const hasActiveFilters = filters.status || filters.budget;
  useEffect(() => {
    dispatch(fetchBudgetOptions());
    dispatch(fetchBudgetTransfers());
  }, []);
  const handleEdit = (row) => {
    setActiveRow(row);
    setIsViewOnly(false);
    setIsModalOpen(true);
  };

  const handleView = (row) => {
    setActiveRow(row);
    setIsViewOnly(true);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    setItemToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/budgetTransfer/void`, {
        ID: itemToDelete.ID || itemToDelete.id,
      });
      if (response.data) {
        toast.success(response.data.message || 'Budget Transfer Voided Successfully');
        await dispatch(fetchBudgetTransfers()).unwrap();
      } else {
        toast.error('Failed to void Budget Transfer');
      }
    } catch (error) {
      console.error('Error voiding Budget Transfer:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to void Budget Transfer');
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (activeRow) {
        // console.log('Updated:', { values });
        await dispatch(createBudgetTransfer(values)).unwrap();
        await dispatch(fetchBudgetTransfers()).unwrap();
        toast.success('Transfer updated successfully');
      } else {
        // console.log('Created:', { values });
        await dispatch(createBudgetTransfer(values)).unwrap();
        await dispatch(fetchBudgetTransfers()).unwrap();
        toast.success('Transfer created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error: ' + error?.error);
    }
  };

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      return (
        (!filters.status || item.Status === filters.status) &&
        (!filters.budget || item.BudgetID == filters.budget)
      );
    });
  }, [data, filters]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = filteredData?.length || 0;
    const totalAmount = filteredData?.reduce((sum, item) => {
      const amount = parseFloat(item?.Total || 0);
      return sum + amount;
    }, 0) || 0;
    const requested = filteredData?.filter(item => item.Status?.toLowerCase().includes('requested')).length || 0;
    const approved = filteredData?.filter(item => item.Status?.toLowerCase().includes('approved')).length || 0;
    const posted = filteredData?.filter(item => item.Status?.toLowerCase().includes('posted')).length || 0;
    const rejected = filteredData?.filter(item => item.Status?.toLowerCase().includes('rejected')).length || 0;

    return {
      total,
      totalAmount,
      requested,
      approved,
      posted,
      rejected,
    };
  }, [filteredData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const columns = [
    {
      key: 'InvoiceNumber',
      header: 'Invoice #',
      sortable: true,
      className: 'text-neutral-900 font-medium',
      render: (value) => (
        <span className="text-neutral-900 font-medium">{value || 'N/A'}</span>
      ),
    },
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded ${
            value === 'Requested'     ? 'bg-gradient-to-r from-warning-400 via-warning-300 to-warning-500 text-error-700'
              : value === 'Approved'  ? 'bg-gradient-to-r from-success-300 via-success-500 to-success-600 text-neutral-800'
              : value === 'Posted'    ? 'bg-gradient-to-r from-success-800 via-success-900 to-success-999 text-success-100'
              : value === 'Rejected'  ? 'bg-gradient-to-r from-error-700 via-error-800 to-error-999 text-neutral-100'
              : value === 'Void'      ? 'bg-gradient-to-r from-primary-900 via-primary-999 to-tertiary-999 text-neutral-300'
              : value === 'Cancelled' ? 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'InvoiceDate',
      header: 'Invoice Date',
      sortable: true,
      render: (value) => {
        if (!value) return <span className="text-neutral-400">N/A</span>;
        const date = new Date(value);
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
      header: 'Total',
      sortable: true,
      className: 'text-right font-semibold',
      render: (value) => (
        <span className="text-right font-semibold text-primary-700">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'BudgetID',
      header: 'Budget Source',
      sortable: true,
      render: (value, row) => (
        <span className="text-neutral-700">
          {budgetOptions?.find((b) => b.ID == value)?.Name || row?.Budget?.Name || value || '—'}
        </span>
      ),
    },
    {
      key: 'TargetID',
      header: 'Budget Target',
      sortable: true,
      render: (value, row) => (
        <span className="text-neutral-700">
          {budgetOptions?.find((b) => b.ID == value)?.Name || row?.targetBudget?.Name || row?.Target?.Name || value || '—'}
        </span>
      ),
    },
    {
      key: 'Remarks',
      header: 'Remarks',
      sortable: false,
      render: (value) => (
        <span className="text-neutral-600 max-w-xs truncate block">
          {value || '—'}
        </span>
      ),
    },
  ];

  // const actions = (row) => {
  //   const baseActions = [];
  //   // Only add Edit action if status is "Rejected" , use Requested to Test it
  //   if (row.Status === 'Rejected' && Edit) {
  //     baseActions.push({
  //       icon: PencilIcon,
  //       title: 'Edit',
  //       onClick: () => handleEdit(row),
  //       className:
  //         'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //     });
  //   }
  //   return baseActions;
  // };
  const handleBTPAction = async (info, action) => {
    setIsLoading(true);
    // Properly format action strings for messages
    const actionPast = action === 'approve' ? 'approved' : 'rejected';
    const actionPresent = action === 'approve' ? 'approving' : 'rejecting';
    try {
      const response = await axiosInstance.post(`/budgetTransfer/${action}`, {
        ID: info.ID || info.id,
        LinkID: info.LinkID,
        Reason: 'This is the reason',
      });
      console.log(`${action}d:`, response.data);

      // Update local state to reflect change immediately
      // Note: Since we are using standard React state for isLoading but Redux for data, 
      // we'll wait for the fetch to complete, but let's make sure it's awaited.

      await dispatch(fetchBudgetTransfers()).unwrap();
      if (action === 'reject') {
        toast.error(`Budget Transfer ${actionPast} successfully`);
      } else {
        toast.success(`Budget Transfer ${actionPast} successfully`);
      }
    } catch (error) {
      console.error(`Error ${actionPresent} Budget Transfer:`, error);
      const errorMessage = error.response?.data?.message || error.message || `Error ${actionPresent} Budget Transfer`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const actions = (row) => {
    const actionList = [];
    const status = row?.Status?.toLowerCase() || '';

    actionList.push({
      icon: Eye,
      title: 'View Details',
      onClick: () => handleView(row),
      className:
        'text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow',
      disabled: false,
    });

    if (status.includes('rejected') && Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: () => handleEdit(row),
        className:
          'text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-sm hover:shadow',
        disabled: false,
      });
      actionList.push({
        icon: TrashIcon,
        title: 'Void',
        onClick: () => handleDelete(row),
        className:
          'text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow',
        disabled: false,
      });
    } else if (status.includes('requested')) {
      actionList.push(
        {
          icon: CheckLine,
          title: 'Approve',
          onClick: () => handleBTPAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-all duration-200 shadow-sm hover:shadow',
          disabled: false,
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleBTPAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow',
          disabled: false,
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
                  Budget Transfer
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Augment budgets appropriated for specific purposes.
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
                  {[filters.status, filters.budget].filter(Boolean).length}
                </span>
              )}
            </button>
            {Add && (
              <button
                onClick={() => handleEdit(null)}
                className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <Plus className="h-5 w-5" />
                Add Transfer
              </button>
            )}
          </div>
        </div>

        {/* Summary Statistics Cards */}
        {!loading && filteredData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className='flex-1 min-w-0'>
                  <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1">Total Transfers</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-900">{summaryStats.total}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg flex-shrink-0">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className='flex-1 min-w-0'>
                  <p className="text-xs sm:text-sm font-medium text-green-700 mb-1">Total Amount</p>
                  <p className="text-base sm:text-lg lg:text-xl font-bold text-green-900 break-words leading-tight">
                    {formatCurrency(summaryStats.totalAmount)}</p>
                </div>
                <div className="p-2 sm:p-3 bg-green-200 rounded-lg flex-shrink-0">
                  <PhilippinePeso className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className='flex-1 min-w-0'>
                  <p className="text-xs sm:text-sm font-medium text-yellow-700 mb-1">Requested</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-900 break-words">{summaryStats.requested}</p>
                </div>
                <div className="p-2 sm:p-3 bg-yellow-200 rounded-lg flex-shrink-0">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-emerald-700 mb-1">Posted</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-900 break-words">{summaryStats.posted}</p>
                </div>
                <div className="p-2 sm:p-3 bg-emerald-200 rounded-lg flex-shrink-0">
                  <CheckCircle2 className="h-5 w=5 sm:h-6 sm:w-6 text-emerald-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className='flex-1 min-w-0'>
                  <p className="text-xs sm:text-sm font-medium text-red-700 mb-1">Rejected</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-900 break-words">{summaryStats.rejected}</p>
                </div>
                <div className="p-2 sm:p-3 bg-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-700" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-all hover:border-neutral-400"
                >
                  <option value="">All Statuses</option>
                  <option value="Requested">Requested</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700">
                  Budget
                </label>
                <select
                  name="budget"
                  value={filters.budget}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white transition-all hover:border-neutral-400"
                >
                  <option value="">All Budgets</option>
                  {budgetOptions?.map((budget) => (
                    <option key={budget.ID} value={budget.ID}>
                      {budget.Name}
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
            Transfer Entries
            <span className="ml-2 text-sm font-normal text-neutral-600">
              ({filteredData.length} {filteredData.length === 1 ? 'entry' : 'entries'})
            </span>
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          actions={actions}
          pagination={true}
          loading={isLoading || loading}
          onRowClick={(row) => {
            setActiveRow(row);
          }}
          selectedRow={activeRow}
        />
      </div>

      {/* Modal */}
      <Modal
        size="xl"
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveRow(null);
        }}
        title={isViewOnly ? 'View Transfer Details' : activeRow ? 'Edit Transfer' : 'Add New Transfer'}
      >
        <BudgetTransferForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          onClose={() => setIsModalOpen(false)}
          budgetOptions={budgetOptions}
          isViewOnly={isViewOnly}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Void Budget Transfer"
        message="Are you sure you want to void this budget transfer? This action cannot be undone."
        confirmText="Void"
        isDestructive={true}
      />
    </div>
  );
};

export default BudgetTransferPage;
