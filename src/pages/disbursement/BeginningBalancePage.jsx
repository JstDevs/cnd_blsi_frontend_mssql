import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import BeginningBalanceForm from '../../components/forms/BeginningBalanceForm';
import DataTable from '../../components/common/DataTable';
import {
  fetchBeginningBalance,
  addBeginningBalance,
  deleteBeginningBalance,
  updateBeginningBalance,
  transferBeginningBalance,
  resetBeginningBalanceState,
} from '../../features/disbursement/beginningBalanceSlice';
import { fetchFiscalYears } from '../../features/settings/fiscalYearSlice';
import BeginningBalanceAddForm from '../../components/forms/BeginningBalanceAddForm';
import BeginningBalanceTransferForm from '../../components/forms/BeginningBalanceTransferForm';
import Modal from '../../components/common/Modal';
import { fetchFunds } from '../../features/budget/fundsSlice';
import { fetchAccounts } from '../../features/settings/chartOfAccountsSlice';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useModulePermissions } from '@/utils/useModulePremission';

function truncate(str, maxLength) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

function BeginningBalancePage() {
  const chartOfAccounts = useSelector(
    (state) => state.chartOfAccounts?.accounts || []
  );
  const { funds } = useSelector((state) => state.funds);

  const dispatch = useDispatch();
  const { fiscalYears } = useSelector((state) => state.fiscalYears);
  const { beginningBalance, isLoading, error } = useSelector(
    (state) => state.beginningBalance
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [currentBeginningBalance, setCurrentBeginningBalance] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [beginningBalanceToDelete, setBeginningBalanceToDelete] =
    useState(null);
  const [searchFilters, setSearchFilters] = useState(null);
  // ---------------------USE MODULE PERMISSIONS------------------START (BeginningBalancePage - MODULE ID =  21 )
  const { Add, Edit, Delete } = useModulePermissions(21);
  useEffect(() => {
    dispatch(resetBeginningBalanceState());
    dispatch(fetchFiscalYears());
    dispatch(fetchFunds());
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleAddSubmit = async (values) => {
    try {
      if (currentBeginningBalance) {
        await dispatch(updateBeginningBalance(values)).unwrap();
      } else {
        await dispatch(addBeginningBalance(values)).unwrap();
      }

      toast.success('Success');

      if (searchFilters) {
        await dispatch(fetchBeginningBalance(searchFilters)).unwrap();
      }
    } catch (error) {
      toast.error(error || 'Failed');
    } finally {
      setShowAddModal(false);
    }
  };

  const handleTransferSubmit = async (values) => {
    try {
      await dispatch(transferBeginningBalance(values)).unwrap();

      dispatch(resetBeginningBalanceState());
      await dispatch(
        fetchBeginningBalance({ FiscalYearID: values.NextFiscalYearID })
      ).unwrap();

      if (searchFilters) {
        await dispatch(fetchBeginningBalance(searchFilters)).unwrap();
      }

      toast.success('Success');
    } catch (error) {
      toast.error(error || 'Transfer failed');
    } finally {
      setShowTransferModal(false);
    }
  };

  const handleAdd = () => {
    setCurrentBeginningBalance(null);
    setShowAddModal(true);
  };

  const handleEdit = (beginningBalance) => {
    setCurrentBeginningBalance(beginningBalance);
    setShowAddModal(true);
  };

  const handleDelete = (beginningBalance) => {
    setBeginningBalanceToDelete(beginningBalance);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (beginningBalanceToDelete) {
      try {
        await dispatch(
          deleteBeginningBalance(beginningBalanceToDelete.ID)
        ).unwrap();
        setIsDeleteModalOpen(false);
        setBeginningBalanceToDelete(null);

        toast.success('Deleted');
      } catch (error) {
        toast.error(error || 'Failed');
      }
    }
  };

  // Table columns definition
  const columns = [
    {
      key: 'FiscalYearName',
      header: 'Fiscal Year',
      sortable: true,
    },
    {
      key: 'FundName',
      header: 'Funds',
      sortable: true,
    },
    {
      key: 'AccountName',
      header: 'Account',
      sortable: true,
    },
    {
      key: 'BeginningBalance',
      header: 'Beginning Balance',
      sortable: true,
    },
  ];
  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSearchFilters(values);
      await dispatch(fetchBeginningBalance(values)).unwrap(); // ⬅️ wait for fetch to complete
    } catch (error) {
      console.error('Fetch failed:', error);
    } finally {
      setSubmitting(false); // ⬅️ ensures button is re-enabled after fetch
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Beginning Balance</h1>
        <p>Generate beginning balance reports.</p>
      </div>

      <div className="mt-4 p-3 sm:p-6 bg-white rounded-md shadow">
        <BeginningBalanceForm
          fiscalYears={fiscalYears.map((item) => ({
            value: item.ID,
            label: item.Name,
          }))}
          onSubmit={handleSubmit}
          onAddClick={handleAdd}
          onTransferClick={() => setShowTransferModal(true)}
          onClose={() => {}}
          Add={Add}
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={
          currentBeginningBalance
            ? 'Edit Beginning Balance'
            : 'Add Beginning Balance'
        }
        size="xl"
      >
        <BeginningBalanceAddForm
          onSubmit={handleAddSubmit}
          initialData={currentBeginningBalance}
          fiscalYears={fiscalYears.map((item) => ({
            value: item.ID,
            label: item.Name,
          }))}
          fundsOptions={funds.map((item) => ({
            value: item.ID,
            label: item.Name,
          }))}
          onClose={() => setShowAddModal(false)}
          chartOfAccountsOptions={chartOfAccounts.map((item) => ({
            value: item.ID,
            label: `${item.AccountCode} - ${item.Name} - [${truncate(
              item.Description,
              50
            )}]`,
          }))}
        />
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="Transfer Beginning Balance"
        size="lg"
      >
        <BeginningBalanceTransferForm
          onSubmit={handleTransferSubmit}
          fiscalYears={fiscalYears.map((item) => ({
            value: item.ID,
            label: item.Name,
          }))}
          onClose={() => setShowTransferModal(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to delete the beginning balance "
            {beginningBalanceToDelete?.Name}"?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </Modal>

      {error && (
        <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-md">
          <p className="text-error-700">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <DataTable
          columns={columns}
          actions={actions}
          data={beginningBalance}
          loading={isLoading}
          pagination={true}
        />
      </div>
    </div>
  );
}

export default BeginningBalancePage;
