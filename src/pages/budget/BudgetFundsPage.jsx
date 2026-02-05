import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@/components/common/Modal';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import BudgetFundForm from '@/components/forms/BudgetFundForm';
import DataTable from '@/components/common/DataTable';
import {
  Plus,
  PencilIcon,
  TrashIcon,
  FileText,
  // DollarSign,
  Wallet,
  PhilippinePeso,
} from 'lucide-react';
import {
  createBudgetFund,
  deleteBudgetFund,
  fetchFunds,
  updateBudgetFund,
} from '@/features/budget/fundsSlice';
import { useModulePermissions } from '@/utils/useModulePremission';
import { formatCurrency } from '@/utils/currencyFormater';

const BudgetFundsPage = () => {
  const dispatch = useDispatch();
  const { funds, loading } = useSelector((state) => state.funds);
  const [isOpen, setIsOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  // ---------------------USE MODULE PERMISSIONS------------------START (BudgetSubFundsPage - MODULE ID =  48 )
  const { Add, Edit, Delete } = useModulePermissions(17);

  const activeFunds = useMemo(() => {
    return funds?.filter((fund) => Number(fund.Active) === 1) || [];
  }, [funds]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = activeFunds?.length || 0;
    const totalAmount = activeFunds?.reduce((sum, fund) => {
      // Try multiple possible field names for current balance
      const amount = parseFloat(fund?.Balance || fund?.Total || fund?.Amount || fund?.balance || 0);
      return sum + amount;
    }, 0) || 0;
    const averageAmount = total > 0 ? totalAmount / total : 0;

    return {
      total,
      totalAmount,
      averageAmount,
    };
  }, [funds]);

  const columns = [
    {
      key: 'Code',
      header: 'Fund Code',
      sortable: true,
      className: 'text-neutral-900 font-medium',
      render: (value) => (
        <span className="text-neutral-900 font-medium">{value || '—'}</span>
      ),
    },
    {
      key: 'Name',
      header: 'Fund Name',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-neutral-700">{value || '—'}</span>
      ),
    },
    {
      key: 'OriginalAmount',
      header: 'Original Amount',
      sortable: true,
      className: 'text-right font-semibold',
      render: (value) => (
        <span className="text-right font-semibold text-primary-600">
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: 'Balance',
      header: 'Current Balance',
      sortable: true,
      className: 'text-right font-semibold',
      render: (value, record) => (
        <span className="text-right font-semibold text-green-700">
          {formatCurrency(record.Balance || record.Total || record.Amount || record.balance || value)}
        </span>
      ),
    },
    {
      key: 'Description',
      header: 'Description',
      sortable: true,
      render: (value) => (
        <span className="text-neutral-600 max-w-md">
          {value || (
            <span className="text-neutral-400 italic">No description</span>
          )}
        </span>
      ),
    },
  ];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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
    try {
      await dispatch(deleteBudgetFund(itemToDelete.ID)).unwrap();
      dispatch(fetchFunds());
      toast.success('Fund deleted successfully');
    } catch (error) {
      toast.error('Failed to delete fund');
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-sm hover:shadow',
      disabled: false,
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className:
        'text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow',
      disabled: false,
    },
  ].filter(Boolean);

  const handleSubmit = async (values) => {
    if (activeRow) {
      await dispatch(updateBudgetFund(values)).unwrap();
    } else {
      await dispatch(createBudgetFund(values)).unwrap();
    }
    dispatch(fetchFunds());
    setIsOpen(false);
    setActiveRow(null);
  };

  const handleViewReceipt = (row) => {
    setActiveRow(row);
    setIsReadOnly(true);
    setIsOpen(true);
  };

  useEffect(() => {
    dispatch(fetchFunds());
  }, [dispatch]);

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Wallet className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Budget Funds
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Manage budget funds and their allocations
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {Add && (
              <button
                type="button"
                onClick={() => {
                  setActiveRow(null);
                  setIsReadOnly(false);
                  setIsOpen(true);
                }}
                className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <Plus className="h-5 w-5" />
                Add Fund
              </button>
            )}
          </div>
        </div>

        {/* Summary Statistics Cards */}
        {!loading && activeFunds?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Funds</p>
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
                  <p className="text-sm font-medium text-green-700 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(summaryStats.totalAmount)}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-lg">
                  <PhilippinePeso className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Average Amount</p>
                  <p className="text-2xl font-bold text-purple-900">{formatCurrency(summaryStats.averageAmount)}</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-lg">
                  <Wallet className="h-6 w-6 text-purple-700" />
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
            Fund Entries
            <span className="ml-2 text-sm font-normal text-neutral-600">
              ({activeFunds?.length || 0} {(activeFunds?.length || 0) === 1 ? 'entry' : 'entries'})
            </span>
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={activeFunds || []}
          actions={actions}
          loading={loading}
          onRowClick={handleViewReceipt}
          pagination={true}
        />
      </div>

      {/* Modal */}
      <Modal
        size="sm"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setActiveRow(null);
          setIsReadOnly(false);
        }}
        title={
          isReadOnly
            ? 'View Budget Fund'
            : activeRow
              ? 'Edit Budget Fund'
              : 'Add New Budget Fund'
        }
      >
        <BudgetFundForm
          onSubmit={handleSubmit}
          initialData={activeRow}
          readOnly={isReadOnly}
          onClose={() => {
            setIsOpen(false);
            setActiveRow(null);
            setIsReadOnly(false);
          }}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Fund"
        message={`Are you sure you want to delete the fund "${itemToDelete?.Name}"? This action cannot be undone.`}
        isDestructive={true}
        confirmText="Delete"
      />
    </div>
  );
};

export default BudgetFundsPage;
