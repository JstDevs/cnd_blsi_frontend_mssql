import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import {
  deleteAccount,
  fetchAccounts,
} from '../../features/settings/chartOfAccountsSlice';
import ChartOfAccountsForm from './ChartOfAccountsForm';
import { Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function ChartOfAccountsPage() {
  const dispatch = useDispatch();
  const { accounts, isLoading } = useSelector((state) => state.chartOfAccounts);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  // ---------------------USE MODULE PERMISSIONS------------------START (Chart Of Accounts Page  - MODULE ID = 31 )
  const { Add, Edit, Delete } = useModulePermissions(31);
  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleAddAccount = () => {
    setCurrentAccount(null);
    setIsModalOpen(true);
  };

  const handleEditAccount = (account) => {
    setCurrentAccount(account);
    setIsModalOpen(true);
  };

  const handleDelete = (account) => {
    setAccountToDelete(account);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (accountToDelete) {
      try {
        await dispatch(deleteAccount(accountToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setAccountToDelete(null);
        toast.success('Account deleted successfully');
      } catch (error) {
        console.error('Failed to delete account:', error);
        toast.error('Failed to delete account. Please try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAccount(null);
  };

  // Format amount as Philippine Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Table columns definition
  const columns = [
    {
      key: 'Code',
      header: 'Code',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'AccountCode',
      header: 'Account Code',
      sortable: true,
    },
    {
      key: 'Name',
      header: 'Name',
      sortable: true,
    },
    {
      key: 'NormalBalance',
      header: 'Normal Balance',
      sortable: true,
    },
  ];

  // Actions for table rows
  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditAccount,
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

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Chart of Accounts</h1>
            <p>Manage account codes and their settings</p>
          </div>
          <div className="flex gap-4 items-center ">
            {Add && (
              <button
                type="button"
                onClick={handleAddAccount}
                className="btn btn-primary max-sm:w-full"
              >
                <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Add Account
              </button>
            )}
            {/* <button
              type="button"
              onClick={() => {}}
              className="btn btn-outline flex items-center"
            >
              <Settings className="h-5 w-5 mr-2" aria-hidden="true" />
            </button> */}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={accounts}
          actions={actions}
          loading={isLoading}
        />
      </div>

      {/* Account Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentAccount ? 'Edit Account' : 'Add Account'}
        size="lg"
      >
        <ChartOfAccountsForm
          initialData={currentAccount}
          onClose={handleCloseModal}
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
            Are you sure you want to delete the account "{accountToDelete?.Name}
            "?
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
    </div>
  );
}

export default ChartOfAccountsPage;
