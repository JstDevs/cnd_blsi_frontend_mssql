import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ModeOfPaymentForm from '../../components/forms/ModeOfPaymentForm';
import {
  fetchModeOfPayments,
  addModeOfPayment,
  updateModeOfPayment,
  deleteModeOfPayment
} from '../../features/settings/modeOfPaymentSlice';

function ModeOfPaymentPage() {
  const dispatch = useDispatch();
  const { modeOfPayments, isLoading } = useSelector(state => state.modeOfPayments);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModeOfPayment, setCurrentModeOfPayment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modeOfPaymentToDelete, setModeOfPaymentToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchModeOfPayments());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentModeOfPayment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (modeOfPayment) => {
    setCurrentModeOfPayment(modeOfPayment);
    setIsModalOpen(true);
  };

  const handleDelete = (modeOfPayment) => {
    setModeOfPaymentToDelete(modeOfPayment);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (modeOfPaymentToDelete) {
      try {
        await dispatch(deleteModeOfPayment(modeOfPaymentToDelete.id)).unwrap();
        setIsDeleteModalOpen(false);
        setModeOfPaymentToDelete(null);
      } catch (error) {
        console.error('Failed to delete mode of payment:', error);
      }
    }
  };

  const handleSubmit = (values) => {
    if (currentModeOfPayment) {
      dispatch(updateModeOfPayment({ ...values, id: currentModeOfPayment.id }));
    } else {
      dispatch(addModeOfPayment(values));
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
            <h1>Mode of Payments</h1>
            <p>Manage mode of payments</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Mode of Payment
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={modeOfPayments}
          actions={actions}
          loading={isLoading}
          emptyMessage="No mode of payments found. Click 'Add Mode of Payment' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentModeOfPayment ? "Edit Mode of Payment" : "Add Mode of Payment"}
      >
        <ModeOfPaymentForm
          initialData={currentModeOfPayment}
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
            Are you sure you want to delete the mode of payment "{modeOfPaymentToDelete?.name}"?
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

export default ModeOfPaymentPage; 