import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import VendorCustomerTypeForm from '../../components/forms/VendorCustomerTypeForm';
import {
  fetchVendorCustomerTypes,
  addVendorCustomerType,
  updateVendorCustomerType,
  deleteVendorCustomerType,
} from '../../features/settings/vendorCustomerTypeSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function VendorCustomerTypePage() {
  const dispatch = useDispatch();
  const { vendorCustomerTypes, isLoading } = useSelector(
    (state) => state.vendorCustomerTypes
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (Vendor Customer Type Page - MODULE ID = 91 )
  const { Add, Edit, Delete } = useModulePermissions(91);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendorCustomerType, setCurrentVendorCustomerType] =
    useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorCustomerTypeToDelete, setVendorCustomerTypeToDelete] =
    useState(null);

  useEffect(() => {
    dispatch(fetchVendorCustomerTypes());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentVendorCustomerType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vendorCustomerType) => {
    setCurrentVendorCustomerType(vendorCustomerType);
    setIsModalOpen(true);
  };

  const handleDelete = (vendorCustomerType) => {
    setVendorCustomerTypeToDelete(vendorCustomerType);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (vendorCustomerTypeToDelete) {
      try {
        await dispatch(
          deleteVendorCustomerType(vendorCustomerTypeToDelete.ID)
        ).unwrap();
        setIsDeleteModalOpen(false);
        setVendorCustomerTypeToDelete(null);
        toast.success('Vendor customer type deleted successfully');
      } catch (error) {
        console.error('Failed to delete vendor customer type:', error);
        toast.error('Failed to delete vendor customer type. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentVendorCustomerType) {
        await dispatch(
          updateVendorCustomerType({
            ...values,
            ID: currentVendorCustomerType.ID,
          })
        ).unwrap();
        toast.success('Vendor customer type updated successfully');
      } else {
        await dispatch(addVendorCustomerType(values)).unwrap();
        toast.success('Vendor customer type saved successfully');
      }
      dispatch(fetchVendorCustomerTypes());
    } catch (error) {
      console.error('Failed to save vendor customer type:', error);
      toast.error('Failed to save vendor customer type. Please try again.');
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
            <h1>Vendor Customer Types</h1>
            <p>Manage Vendor Customer Types</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Vendor Customer Type
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={vendorCustomerTypes}
          actions={actions}
          loading={isLoading}
          emptyMessage="No vendor customer types found. Click 'Add Vendor Customer Type' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentVendorCustomerType
            ? 'Edit Vendor Customer Type'
            : 'Add Vendor Customer Type'
        }
      >
        <VendorCustomerTypeForm
          initialData={currentVendorCustomerType}
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
            Are you sure you want to delete the vendor customer type "
            {vendorCustomerTypeToDelete?.Name}"?
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

export default VendorCustomerTypePage;
