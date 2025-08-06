import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import SubFundsForm from '../../components/forms/SubFundsForm';
import {
  fetchSubFunds,
  addSubFund,
  updateSubFund,
  deleteSubFund,
} from '../../features/budget/subFundsSlice';

function SubFundsPage() {
  const dispatch = useDispatch();
  const { subFunds, isLoading } = useSelector((state) => state.subFunds);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubFund, setCurrentSubFund] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subFundToDelete, setSubFundToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchSubFunds());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentSubFund(null);
    setIsModalOpen(true);
  };

  const handleEdit = (subFund) => {
    setCurrentSubFund(subFund);
    setIsModalOpen(true);
  };

  const handleDelete = (subFund) => {
    setSubFundToDelete(subFund);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (subFundToDelete) {
      try {
        await dispatch(deleteSubFund(subFundToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setSubFundToDelete(null);
      } catch (error) {
        console.error('Failed to delete sub fund:', error);
      }
    }
  };

  const handleSubmit = (values) => {
    if (currentSubFund) {
      dispatch(updateSubFund({ ...values, ID: currentSubFund.ID }));
    } else {
      dispatch(addSubFund(values));
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'Name',
      header: 'Name',
      sortable: true,
    },
  ];

  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    {
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
        <div className="flex justify-between items-center">
          <div>
            <h1>Sub Funds</h1>
            <p>Manage Sub Funds</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Sub Fund
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={subFunds}
          actions={actions}
          loading={isLoading}
          emptyMessage="No sub funds found. Click 'Add Sub Fund' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSubFund ? 'Edit Sub Fund' : 'Add Sub Fund'}
      >
        <SubFundsForm
          initialData={currentSubFund}
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
            Are you sure you want to delete the sub fund "
            {subFundToDelete?.Name}"?
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

export default SubFundsPage;
