import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ItemUnitForm from '../../components/forms/ItemUnitForm';
import {
  fetchItemUnits,
  addItemUnit,
  updateItemUnit,
  deleteItemUnit,
} from '../../features/settings/itemUnitsSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function ItemUnitPage() {
  const dispatch = useDispatch();
  const { itemUnits, isLoading } = useSelector((state) => state.itemUnits);
  // ---------------------USE MODULE PERMISSIONS------------------START (Item Unit Page  - MODULE ID = 56 )
  const { Add, Edit, Delete } = useModulePermissions(56);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItemUnit, setCurrentItemUnit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemUnitToDelete, setItemUnitToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchItemUnits());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentItemUnit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (itemUnit) => {
    setCurrentItemUnit(itemUnit);
    setIsModalOpen(true);
  };

  const handleDelete = (itemUnit) => {
    setItemUnitToDelete(itemUnit);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemUnitToDelete) {
      try {
        await dispatch(deleteItemUnit(itemUnitToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setItemUnitToDelete(null);
        toast.success('Item unit deleted successfully');
      } catch (error) {
        console.error('Failed to delete item unit:', error);
        toast.error('Failed to delete item unit. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentItemUnit) {
        await dispatch(
          updateItemUnit({ ...values, ID: currentItemUnit.ID })
        ).unwrap();
        toast.success('Item unit updated successfully');
      } else {
        await dispatch(addItemUnit(values)).unwrap();
        toast.success('Item unit added successfully');
      }
      dispatch(fetchItemUnits());
    } catch (error) {
      console.error('Failed to save item unit:', error);
      toast.error('Failed to save item unit. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'Code',
      header: 'Code',
      sortable: true,
    },
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
            <h1>Item Units</h1>
            <p>Manage item units</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Item Unit
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={itemUnits}
          actions={actions}
          loading={isLoading}
          emptyMessage="No item units found. Click 'Add Item Unit' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentItemUnit ? 'Edit Item Unit' : 'Add Item Unit'}
      >
        <ItemUnitForm
          initialData={currentItemUnit}
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
            Are you sure you want to delete the item unit "
            {itemUnitToDelete?.Name}"?
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

export default ItemUnitPage;
