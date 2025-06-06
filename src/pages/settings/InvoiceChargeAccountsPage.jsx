import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import InvoiceChargeAccountForm from '../../components/forms/InvoiceChargeAccountForm';
import {
  fetchInvoiceChargeAccounts,
  addInvoiceChargeAccount,
  updateInvoiceChargeAccount,
  deleteInvoiceChargeAccount
} from '../../features/settings/invoiceChargeAccountsSlice';

function InvoiceChargeAccountsPage() {
  const dispatch = useDispatch();
  const { invoiceChargeAccounts, isLoading } = useSelector(state => state.invoiceChargeAccounts);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  
  useEffect(() => {
    dispatch(fetchInvoiceChargeAccounts());
  }, [dispatch]);
  
  const handleAdd = () => {
    setCurrentAccount(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (account) => {
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
        await dispatch(deleteInvoiceChargeAccount(accountToDelete.id)).unwrap();
        setIsDeleteModalOpen(false);
        setAccountToDelete(null);
      } catch (error) {
        console.error('Failed to delete invoice charge account:', error);
      }
    }
  };
  
  const handleSubmit = (values) => {
    if (currentAccount) {
      dispatch(updateInvoiceChargeAccount({ ...values, id: currentAccount.id }));
    } else {
      dispatch(addInvoiceChargeAccount(values));
    }
    setIsModalOpen(false);
  };

  // Format rate as percentage
  const formatRate = (rate) => {
    return `${(rate * 100).toFixed(2)}%`;
  };
  
  const columns = [
    {
      key: 'marriageServiceInvoice',
      header: 'Marriage Service Invoice',
      sortable: true
    },
    {
      key: 'burialServiceInvoice',
      header: 'Burial Service Invoice',
      sortable: true
    },
    {
      key: 'dueFromLGU',
      header: 'Due From LGU',
      sortable: true
    },
    {
      key: 'dueFromRate',
      header: 'Due From Rate',
      sortable: true,
      render: (value) => formatRate(value)
    },
    {
      key: 'dueToLGU',
      header: 'Due To LGU',
      sortable: true
    },
    {
      key: 'dueToRate',
      header: 'Due To Rate',
      sortable: true,
      render: (value) => formatRate(value)
    },
    {
      key: 'specialEducationFund',
      header: 'Special Education Fund',
      sortable: true
    },
    {
      key: 'specialEducationRate',
      header: 'Special Education Rate',
      sortable: true,
      render: (value) => formatRate(value)
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'Active' ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'
        }`}>
          {value}
        </span>
      )
    }
  ];
  
  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Invoice Charge Accounts</h1>
            <p>Manage invoice charge accounts and their settings</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Invoice Charge Account
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={invoiceChargeAccounts}
          actions={actions}
          loading={isLoading}
          emptyMessage="No invoice charge accounts found. Click 'Add Invoice Charge Account' to create one."
        />
      </div>
      
      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentAccount ? "Edit Invoice Charge Account" : "Add Invoice Charge Account"}
        size="lg"
      >
        <InvoiceChargeAccountForm
          initialData={currentAccount}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
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
            Are you sure you want to delete this invoice charge account?
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

export default InvoiceChargeAccountsPage; 