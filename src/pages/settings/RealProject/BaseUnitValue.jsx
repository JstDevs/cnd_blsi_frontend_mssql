import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../../components/common/DataTable';
import Modal from '../../../components/common/Modal';
import BaseUnitForm from '../../../components/forms/BaseUnitForm';
import {
  fetchBaseUnits,
  addBaseUnit,
  updateBaseUnit,
  deleteBaseUnit,
} from '../../../features/settings/baseUnitSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function BaseUnitValue() {
  const dispatch = useDispatch();
  const { baseUnits, isLoading } = useSelector((state) => state.baseUnits);
  // ---------------------USE MODULE PERMISSIONS------------------START ( Base Unit Value Page  - MODULE ID = 20 )
  const { Add, Edit, Delete } = useModulePermissions(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBaseUnit, setCurrentBaseUnit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [baseUnitToDelete, setBaseUnitToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchBaseUnits());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentBaseUnit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (baseUnit) => {
    setCurrentBaseUnit(baseUnit);
    setIsModalOpen(true);
  };

  const handleDelete = (baseUnit) => {
    setBaseUnitToDelete(baseUnit);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (baseUnitToDelete) {
      try {
        await dispatch(deleteBaseUnit(baseUnitToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setBaseUnitToDelete(null);
        toast.success('Base unit deleted successfully');
      } catch (error) {
        console.error('Failed to delete base unit:', error);
        toast.error('Failed to delete base unit. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentBaseUnit) {
        await dispatch(
          updateBaseUnit({ ...values, ID: currentBaseUnit.ID })
        ).unwrap();
        toast.success('Base unit updated successfully');
      } else {
        await dispatch(addBaseUnit(values)).unwrap();
        toast.success('Base unit added successfully');
      }
      dispatch(fetchBaseUnits());
    } catch (error) {
      console.error('Failed to save base unit:', error);
      toast.error('Failed to save base unit. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'GeneralRevisionYear',
      header: 'General Revision Year',
      sortable: true,
    },
    {
      key: 'Classification',
      header: 'Classification',
      sortable: true,
    },
    {
      key: 'Location',
      header: 'Location',
      sortable: true,
    },
    {
      key: 'Unit',
      header: 'Unit',
      sortable: true,
    },
    {
      key: 'ActualUse',
      header: 'Actual Use',
      sortable: true,
    },
    {
      key: 'SubClassification',
      header: 'Sub Classification',
      sortable: true,
    },
    {
      key: 'Price',
      header: 'Sub Classification',
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
            <h1>Base Units</h1>
            <p>Manage Base Units</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Base Unit
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={baseUnits}
          actions={actions}
          loading={isLoading}
          emptyMessage="No base units found. Click 'Add Base Unit' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentBaseUnit ? 'Edit Base Unit' : 'Add Base Unit'}
      >
        <BaseUnitForm
          initialData={currentBaseUnit}
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
            Are you sure you want to delete the base unit "
            {baseUnitToDelete?.Unit}"?
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

export default BaseUnitValue;
