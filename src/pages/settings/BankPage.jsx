import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import BankForm from '../../components/forms/BankForm';
import { fetchBanks, deleteBank } from '../../features/settings/bankSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

const BankPage = () => {
  const dispatch = useDispatch();
  const { banks = [], isLoading } = useSelector((state) => state.banks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBank, setCurrentBank] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState(null);
  // ---------------------USE MODULE PERMISSIONS------------------START ( Bank  Page  - MODULE ID = 18 )
  const { Add, Edit, Delete } = useModulePermissions(18);
  useEffect(() => {
    dispatch(fetchBanks());
  }, []);

  const handleAddBank = () => {
    setCurrentBank(null);
    setIsModalOpen(true);
  };

  const handleEditBank = (bank) => {
    setCurrentBank(bank);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentBank(null);
  };

  const handleDelete = (bank) => {
    setBankToDelete(bank);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (bankToDelete) {
      try {
        await dispatch(deleteBank(bankToDelete.ID)).unwrap();
        toast.success('Bank deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete bank');
        // Optionally show an error message to the user
      } finally {
        setIsDeleteModalOpen(false);
        setBankToDelete(null);
        dispatch(fetchBanks());
      }
    }
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'PHP',
    }).format(amount);
  };

  // Table columns definition
  const columns = [
    {
      key: 'BranchCode',
      header: 'Branch Code',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'Branch',
      header: 'Branch',
      sortable: true,
    },
    {
      key: 'Name',
      header: 'Bank Name',
      sortable: true,
    },
    {
      key: 'AccountNumber',
      header: 'Account Number',
      sortable: true,
    },
    {
      key: 'Balance',
      header: 'Balance',
      sortable: true,
      // render: (value, row) => formatCurrency(value, row.currency),
    },
    // {
    //   key: 'CurrencyID',
    //   header: 'CurrencyID',
    //   sortable: true,
    // },
    {
      key: 'Currency',
      header: 'Currency',
      sortable: true,
      render: (value) => value?.Code || 'N/A', // Display Currency.Code (e.g., "USD")
    },
  ];

  // Actions for table rows
  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditBank,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className:
        'text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50',
    },
  ];
  // console.log({ banks });
  return (
    <div className="container mx-auto">
      <div className="flex justify-between sm:items-center max-sm:flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bank Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage bank accounts and their details
          </p>
        </div>
        {Add && (
          <button
            onClick={handleAddBank}
            className="btn btn-primary max-sm:w-full"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Bank
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={banks}
        actions={actions}
        loading={isLoading}
        emptyMessage="No banks found. Click 'Add Bank' to create one."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentBank ? 'Edit Bank' : 'Add Bank'}
        size="lg"
      >
        <BankForm initialData={currentBank} onClose={handleCloseModal} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to delete the bank{' '}
            <span className="font-medium">{bankToDelete?.Name}</span>?
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
};

export default BankPage;
