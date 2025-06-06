import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import PaymentTermsForm from '../../components/forms/PaymentTermsForm';
import {
  fetchPaymentTerms,
  addPaymentTerm,
  updatePaymentTerm,
  deletePaymentTerm
} from '../../features/settings/paymentTermsSlice';

function PaymentTermsPage() {
  const dispatch = useDispatch();
  const { paymentTerms, isLoading } = useSelector(state => state.paymentTerms);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPaymentTerm, setCurrentPaymentTerm] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [paymentTermToDelete, setPaymentTermToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchPaymentTerms());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentPaymentTerm(null);
    setIsModalOpen(true);
  };

  const handleEdit = (paymentTerm) => {
    setCurrentPaymentTerm(paymentTerm);
    setIsModalOpen(true);
  };

  const handleDelete = (paymentTerm) => {
    setPaymentTermToDelete(paymentTerm);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (paymentTermToDelete) {
      try {
        await dispatch(deletePaymentTerm(paymentTermToDelete.id)).unwrap();
        setIsDeleteModalOpen(false);
        setPaymentTermToDelete(null);
      } catch (error) {
        console.error('Failed to delete payment term:', error);
      }
    }
  };

  const handleSubmit = (values) => {
    if (currentPaymentTerm) {
      dispatch(updatePaymentTerm({ ...values, id: currentPaymentTerm.id }));
    } else {
      dispatch(addPaymentTerm(values));
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'code',
      header: 'Code',
      sortable: true
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true
    },
    {
      key: 'numberOfDays',
      header: 'Number of Days',
      sortable: true
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
            <h1>Payment Terms</h1>
            <p>Manage payment terms</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Payment Term
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={paymentTerms}
          actions={actions}
          loading={isLoading}
          emptyMessage="No payment terms found. Click 'Add Payment Term' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPaymentTerm ? "Edit Payment Term" : "Add Payment Term"}
      >
        <PaymentTermsForm
          initialData={currentPaymentTerm}
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
            Are you sure you want to delete the payment term "{paymentTermToDelete?.name}"?
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

export default PaymentTermsPage; 