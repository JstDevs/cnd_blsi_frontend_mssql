import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import PositionForm from '../../components/forms/PositionForm';
import {
  fetchPositions,
  addPosition,
  updatePosition,
  deletePosition
} from '../../features/settings/positionSlice';

function PositionPage() {
  const dispatch = useDispatch();
  const { positions, isLoading } = useSelector(state => state.positions);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchPositions());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentPosition(null);
    setIsModalOpen(true);
  };

  const handleEdit = (position) => {
    setCurrentPosition(position);
    setIsModalOpen(true);
  };

  const handleDelete = (position) => {
    setPositionToDelete(position);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (positionToDelete) {
      try {
        await dispatch(deletePosition(positionToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setPositionToDelete(null);
      } catch (error) {
        console.error('Failed to delete position:', error);
      }
    }
  };

  const handleSubmit = (values) => {
    if (currentPosition) {
      dispatch(updatePosition({ ...values, ID: currentPosition.ID }));
    } else {
      dispatch(addPosition(values));
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'Name',
      header: 'Position',
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
            <h1>Position</h1>
            <p>Manage Positions</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Position
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={positions}
          actions={actions}
          loading={isLoading}
          emptyMessage="No positions found. Click 'Add Position' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPosition ? "Edit Position" : "Add Position"}
      >
        <PositionForm
          initialData={currentPosition}
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
            Are you sure you want to delete the position "{positionToDelete?.name}"?
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

export default PositionPage;