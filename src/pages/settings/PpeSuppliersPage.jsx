import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import PpeSuppliersForm from '../../components/forms/PpeSuppliersForm';
import {
  fetchPpeSuppliers,
  addPpeSupplier,
  updatePpeSupplier,
  deletePpeSupplier,
} from '../../features/settings/ppeSuppliersSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function PpeSuppliersPage() {
  const dispatch = useDispatch();
  const { ppeSuppliers, isLoading } = useSelector(
    (state) => state.ppeSuppliers
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (PpeSuppliersPage - MODULE ID = 96 )
  const { Add, Edit, Delete } = useModulePermissions(96);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPpeSupplier, setCurrentPpeSupplier] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ppeSupplierToDelete, setPpeSupplierToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchPpeSuppliers());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentPpeSupplier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ppeSupplier) => {
    setCurrentPpeSupplier(ppeSupplier);
    setIsModalOpen(true);
  };

  const handleDelete = (ppeSupplier) => {
    setPpeSupplierToDelete(ppeSupplier);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (ppeSupplierToDelete) {
      try {
        await dispatch(deletePpeSupplier(ppeSupplierToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setPpeSupplierToDelete(null);
        toast.success('PPE supplier deleted successfully');
      } catch (error) {
        console.error('Failed to delete PPE supplier:', error);
        toast.error('Failed to delete PPE supplier. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentPpeSupplier) {
        await dispatch(
          updatePpeSupplier({ ...values, ID: currentPpeSupplier.ID })
        ).unwrap();
        toast.success('PPE supplier updated successfully');
      } else {
        await dispatch(addPpeSupplier(values)).unwrap();
        toast.success('PPE supplier saved successfully');
      }
      dispatch(fetchPpeSuppliers());
    } catch (error) {
      console.error('Failed to save PPE supplier:', error);
      toast.error('Failed to save PPE supplier. Please try again.');
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
            <h1>PPE Suppliers</h1>
            <p>Manage PPE Suppliers</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add PPE Supplier
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={ppeSuppliers}
          actions={actions}
          loading={isLoading}
          emptyMessage="No PPE suppliers found. Click 'Add PPE Supplier' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPpeSupplier ? 'Edit PPE Supplier' : 'Add PPE Supplier'}
      >
        <PpeSuppliersForm
          initialData={currentPpeSupplier}
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
            Are you sure you want to delete the PPE supplier "
            {ppeSupplierToDelete?.Name}"?
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

export default PpeSuppliersPage;
