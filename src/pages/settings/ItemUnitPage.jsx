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
  deleteItemUnit
} from '../../features/settings/itemUnitsSlice';

function ItemUnitPage() {
  const dispatch = useDispatch();
  const { itemUnits, isLoading } = useSelector(state => state.itemUnits);
  
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
        await dispatch(deleteItemUnit(itemUnitToDelete.id)).unwrap();
        setIsDeleteModalOpen(false);
        setItemUnitToDelete(null);
      } catch (error) {
        console.error('Failed to delete item unit:', error);
      }
    }
  };
  
  const handleSubmit = (values) => {
    if (currentItemUnit) {
      dispatch(updateItemUnit({ ...values, id: currentItemUnit.id }));
    } else {
      dispatch(addItemUnit(values));
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
            <h1>Item Units</h1>
            <p>Manage item units</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Item Unit
          </button>
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
        title={currentItemUnit ? "Edit Item Unit" : "Add Item Unit"}
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
            Are you sure you want to delete the item unit "{itemUnitToDelete?.name}"?
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