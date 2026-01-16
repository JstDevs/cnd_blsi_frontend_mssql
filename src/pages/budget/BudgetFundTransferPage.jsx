import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  CheckLine,
  PencilIcon,
  TrashIcon,
  X,
  FileText,
  // DollarSign,
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PhilippinePeso,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import BudgetFundTransferForm from '../../components/forms/BudgetFundTransferForm';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import DataTable from '../../components/common/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFundOptions,
  fetchFundTransfers,
  createFundTransfer,
} from '@/features/budget/fundTransferSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';
import axiosInstance from '@/utils/axiosInstance';
import { formatCurrency } from '@/utils/currencyFormater';
import { fetchFiscalYears } from '@/features/settings/fiscalYearSlice';

const BudgetFundTransferPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------USE MODULE PERMISSIONS------------------START (BudgetFundTransferPage - MODULE ID =  46 )
  const { Add, Edit } = useModulePermissions(46);
  const {
    transfers: data,
    fundOptions,
    loading,
    error,
  } = useSelector((state) => state.fundTransfer);

  const { fiscalYears } = useSelector((state) => state.fiscalYears);

  useEffect(() => {
    dispatch(fetchFundOptions());
    dispatch(fetchFundTransfers());
    dispatch(fetchFiscalYears());
  }, [dispatch]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = data?.length || 0;
    const totalAmount = data?.reduce((sum, item) => {
      const amount = parseFloat(item?.Total || 0);
      return sum + amount;
    }, 0) || 0;
    const requested = data?.filter(item => item.Status?.toLowerCase().includes('requested')).length || 0;
    const approved = data?.filter(item => item.Status?.toLowerCase().includes('approved')).length || 0;
    const posted = data?.filter(item => item.Status?.toLowerCase().includes('posted')).length || 0;
    const rejected = data?.filter(item => item.Status?.toLowerCase().includes('rejected')).length || 0;

    return {
      total,
      totalAmount,
      requested,
      approved,
      posted,
      rejected,
    };
  }, [data]);

  const columns = [
    {
      key: 'InvoiceNumber',
      header: 'Invoice Number',
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
      key: 'FundsID',
      header: 'Fund Source',
      sortable: true,
      render: (value, record) => (
        <span className="text-neutral-700">
          {fundOptions?.find((f) => f.ID == value)?.Name || record?.Funds?.Name || value || '—'}
        </span>
      ),
    },
    {
      key: 'TargetID',
      header: 'Fund Target',
      sortable: true,
      render: (value, record) => (
        <span className="text-neutral-700">
          {fundOptions?.find((f) => f.ID == value)?.Name || record?.targetFunds?.Name || value || '—'}
        </span>
      ),
    },
    {
      key: 'Remarks',
      header: 'Remarks',
      sortable: true,
      render: (value) => (
        <span className="text-neutral-600 max-w-xs truncate block">
          {value || '—'}
        </span>
      ),
    },
  ];

  const handleBFTAction = async (info, action) => {
    setIsLoading(true);
    // Properly format action strings for messages
    const actionPast = action === 'approve' ? 'approved' : 'rejected';
    const actionPresent = action === 'approve' ? 'approving' : 'rejecting';

    try {
      const response = await axiosInstance.post(`/fundTransfer/${action}`, {
        ID: info.ID,
        LinkID: info.LinkID,
        Reason: 'This is the reason',
      });
      console.log(`${actionPast}:`, response.data);
      dispatch(fetchFundTransfers());
      toast.success(`Budget Fund Transfer ${actionPast} successfully`);
    } catch (error) {
      console.error(`Error ${actionPresent} Budget Fund Transfer:`, error);
      toast.error(`Error ${actionPresent} Budget Fund Transfer`);
    } finally {
      setIsLoading(false);
    }
  };
  const actions = (row) => {
    const actionList = [];
    const status = row?.Status?.toLowerCase() || '';

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
          onClick: () => handleBFTAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-all duration-200 shadow-sm hover:shadow',
          disabled: false,
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleBFTAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow',
          disabled: false,
        }
      );
    }
    return actionList;
  };
  const handleSubmit = async (values) => {
    try {
      if (activeRow) {
        // console.log('Updated:', { values });
        await dispatch(createFundTransfer(values)).unwrap();
        await dispatch(fetchFundTransfers()).unwrap();
        toast.success('Transfer updated successfully');
      } else {
        // console.log('Created:', { values });
        await dispatch(createFundTransfer(values)).unwrap();
        await dispatch(fetchFundTransfers()).unwrap();
        toast.success('Transfer created successfully');
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    }
  };

  const handleEdit = (data) => {
    setActiveRow(data);
    setIsReadOnly(false);
    setIsOpen(true);
  };

  const handleDelete = (row) => {
    setItemToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/fundTransfer/void`, {
        ID: itemToDelete.ID,
      });
      if (response.data) {
        toast.success(response.data.message || 'Budget Fund Transfer Voided Successfully');
        dispatch(fetchFundTransfers());
      } else {
        toast.error('Failed to void Budget Fund Transfer');
      }
    } catch (error) {
      console.error('Error voiding Budget Fund Transfer:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to void Budget Fund Transfer');
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleViewTransfer = (row) => {
    setActiveRow(row);
    setIsReadOnly(true);
    setIsOpen(true);
  };

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <ArrowRightLeft className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Fund Transfer
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Transfer monetary assets from one fund to another.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {Add && (
              <button
                type="button"
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
        {!loading && data?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1">Total Transfers</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-900 break-words">{summaryStats.total}</p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-200 rounded-lg flex-shrink-0">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-green-700 mb-1">Total Amount</p>
                  <p className="text-base sm:text-lg lg:text-xl font-bold text-green-900 break-words leading-tight">
                    {formatCurrency(summaryStats.totalAmount)}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-green-200 rounded-lg flex-shrink-0">
                  <PhilippinePeso className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
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
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-red-700 mb-1">Rejected</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-900 break-words">{summaryStats.rejected}</p>
                </div>
                <div className="p-2 sm:p-3 bg-red-200 rounded-lg flex-shrink-0">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-700" />
                </div>
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
              ({data?.length || 0} {(data?.length || 0) === 1 ? 'entry' : 'entries'})
            </span>
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={data || []}
          actions={actions}
          loading={isLoading || loading}
          onRowClick={handleViewTransfer}
          pagination={true}
        />
      </div>

      {/* Modal */}
      <Modal
        size="xl"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setActiveRow(null);
          setIsReadOnly(false);
        }}
        title={
          isReadOnly
            ? 'View Fund Transfer'
            : activeRow
              ? 'Edit Fund Transfer'
              : 'Add Fund Transfer'
        }
      >
        <BudgetFundTransferForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          readOnly={isReadOnly}
          onClose={() => {
            setIsOpen(false);
            setActiveRow(null);
            setIsReadOnly(false);
          }}
          fundOptions={fundOptions}
          fiscalYearOptions={fiscalYears?.map((f) => ({
            label: f.Name,
            value: f.ID,
          }))}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Void Budget Fund Transfer"
        message="Are you sure you want to void this budget fund transfer? This action cannot be undone."
        confirmText="Void"
        isDestructive={true}
      />
    </div>
  );
};

export default BudgetFundTransferPage;
