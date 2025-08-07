import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import PpeCategoriesForm from '../../components/forms/PpeCategoriesForm';
import {
  fetchPpeCategories,
  addPpeCategory,
  updatePpeCategory,
  deletePpeCategory,
} from '../../features/settings/ppeCategoriesSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function PpeCategoriesPage() {
  const dispatch = useDispatch();
  const { ppeCategories, isLoading } = useSelector(
    (state) => state.ppeCategories
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (PpeCategoriesPage - MODULE ID = 95 )
  const { Add, Edit, Delete } = useModulePermissions(95);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPpeCategory, setCurrentPpeCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ppeCategoryToDelete, setPpeCategoryToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchPpeCategories());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentPpeCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ppeCategory) => {
    setCurrentPpeCategory(ppeCategory);
    setIsModalOpen(true);
  };

  const handleDelete = (ppeCategory) => {
    setPpeCategoryToDelete(ppeCategory);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (ppeCategoryToDelete) {
      try {
        await dispatch(deletePpeCategory(ppeCategoryToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setPpeCategoryToDelete(null);
        toast.success('PPE category deleted successfully');
      } catch (error) {
        console.error('Failed to delete PPE category:', error);
        toast.error('Failed to delete PPE category. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentPpeCategory) {
        await dispatch(
          updatePpeCategory({ ...values, ID: currentPpeCategory.ID })
        ).unwrap();
        toast.success('PPE category updated successfully');
      } else {
        await dispatch(addPpeCategory(values)).unwrap();
        toast.success('PPE category saved successfully');
      }
      dispatch(fetchPpeCategories());
    } catch (error) {
      console.error('Failed to save PPE category:', error);
      toast.error('Failed to save PPE category. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'Name',
      header: 'Name',
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

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>PPE Categories</h1>
            <p>Manage PPE Categories</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add PPE Category
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={ppeCategories}
          actions={actions}
          loading={isLoading}
          emptyMessage="No PPE categories found. Click 'Add PPE Category' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPpeCategory ? 'Edit PPE Category' : 'Add PPE Category'}
      >
        <PpeCategoriesForm
          initialData={currentPpeCategory}
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
            Are you sure you want to delete the PPE category "
            {ppeCategoryToDelete?.Name}"?
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

export default PpeCategoriesPage;
