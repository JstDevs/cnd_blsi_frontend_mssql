import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, deleteItem } from '../../features/settings/itemSlice';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ItemForm from '../../components/forms/ItemForm';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { fetchItemUnits } from '@/features/settings/itemUnitsSlice';
import { fetchTaxCodes } from '@/features/settings/taxCodeSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

const ItemPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.items);
  const { itemUnits, isLoading: itemUnitsLoading } = useSelector(
    (state) => state.itemUnits
  );
  const { taxCodes, isLoading: taxCodesLoading } = useSelector(
    (state) => state.taxCodes
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (Item Page  - MODULE ID = 55 )
  const { Add, Edit, Delete } = useModulePermissions(55);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchItems());
    dispatch(fetchItemUnits());
    dispatch(fetchTaxCodes());
  }, [dispatch]);

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await dispatch(deleteItem(itemToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        toast.success('Item deleted successfully');
      } catch (error) {
        console.error('Failed to delete item:', error);
        toast.error('Failed to delete item. Please try again.');
        // Optionally show an error message to the user
      }
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
    {
      key: 'PurchaseOrSales',
      header: 'Type',
      sortable: true,
    },
    {
      key: 'TAXCodeValue',
      header: 'Tax Code',
      sortable: true,
    },
    {
      key: 'unitName',
      header: 'Unit Name',
      sortable: true,
    },
    {
      key: 'EWT',
      header: 'EWT',
      sortable: true,
    },
    {
      key: 'Vatable',
      header: 'Vatable',
      sortable: true,
      render: (value) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            value === true
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];
  const data = items.map((item) => ({
    ...item,
    unitName: itemUnits?.find((unit) => unit.ID === item.UnitID)?.Name || 'N/A',
    TAXCodeValue:
      taxCodes?.find((tax) => tax.ID === item.TAXCodeID)?.Code || 'N/A',
  }));
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
    <div className="container mx-auto">
      <div className="flex justify-between sm:items-center max-sm:flex-col gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Item List</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage inventory items, assets, and services
          </p>
        </div>
        {Add && (
          <button onClick={handleAdd} className="btn btn-primary max-sm:w-full">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Item
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data}
        actions={actions}
        loading={isLoading || itemUnitsLoading || taxCodesLoading}
        emptyMessage="No items found. Click 'Add Item' to create one."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Item' : 'Add Item'}
        size="lg"
      >
        <ItemForm item={selectedItem} onClose={() => setIsModalOpen(false)} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to delete the item{' '}
            <span className="font-medium">{itemToDelete?.Name}</span>?
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
};

export default ItemPage;
