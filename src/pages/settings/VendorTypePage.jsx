import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import VendorTypeForm from '../../components/forms/VendorTypeForm';
import {
  fetchVendorTypes,
  addVendorType,
  updateVendorType,
  deleteVendorType,
} from '../../features/settings/vendorTypeSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function VendorTypePage() {
  const dispatch = useDispatch();
  const { vendorTypes, isLoading } = useSelector((state) => state.vendorTypes);
  // ---------------------USE MODULE PERMISSIONS------------------START (Vendor Customer Type Page - MODULE ID = 92 )
  const { Add, Edit, Delete } = useModulePermissions(92);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendorType, setCurrentVendorType] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorTypeToDelete, setVendorTypeToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchVendorTypes());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentVendorType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vendorType) => {
    setCurrentVendorType(vendorType);
    setIsModalOpen(true);
  };

  const handleDelete = (vendorType) => {
    setVendorTypeToDelete(vendorType);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (vendorTypeToDelete) {
      try {
        await dispatch(deleteVendorType(vendorTypeToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setVendorTypeToDelete(null);
        toast.success('Vendor type deleted successfully');
      } catch (error) {
        console.error('Failed to delete vendor type:', error);
        toast.error('Failed to delete vendor type. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentVendorType) {
        await dispatch(
          updateVendorType({ ...values, ID: currentVendorType.ID })
        ).unwrap();
        toast.success('Vendor type updated successfully');
      } else {
        await dispatch(addVendorType(values)).unwrap();
        toast.success('Vendor type saved successfully');
      }
      dispatch(fetchVendorTypes());
    } catch (error) {
      console.error('Failed to save vendor type:', error);
      toast.error('Failed to save vendor type. Please try again.');
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
            <h1>Vendor Types</h1>
            <p>Manage Vendor Types</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Vendor Type
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={vendorTypes}
          actions={actions}
          loading={isLoading}
          emptyMessage="No vendor types found. Click 'Add Vendor Type' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentVendorType ? 'Edit Vendor Type' : 'Add Vendor Type'}
      >
        <VendorTypeForm
          initialData={currentVendorType}
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
            Are you sure you want to delete the vendor type "
            {vendorTypeToDelete?.Name}"?
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

export default VendorTypePage;
