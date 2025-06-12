import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, deleteItem } from '../../features/settings/itemSlice';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ItemForm from '../../components/forms/ItemForm';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const ItemPage = () => {
  const dispatch = useDispatch();
  const { items, isLoading } = useSelector((state) => state.items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchItems());
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
        await dispatch(deleteItem(itemToDelete.id)).unwrap();
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      } catch (error) {
        console.error('Failed to delete item:', error);
        // Optionally show an error message to the user
      }
    }
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
    },
    {
      key: 'chargeAccount',
      header: 'Charge Account',
      sortable: true
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true
    },
    {
      key: 'taxCode',
      header: 'Tax Code',
      sortable: true
    },
    {
      key: 'taxRate',
      header: 'Tax Rate',
      sortable: true
    },
    {
      key: 'ewt',
      header: 'EWT',
      sortable: true
    },
    {
      key: 'vatable',
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
      )
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Item List</h1>
          <p className="mt-1 text-sm text-gray-500">Manage inventory items, assets, and services</p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Item
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        actions={actions}
        loading={isLoading}
        emptyMessage="No items found. Click 'Add Item' to create one."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedItem ? 'Edit Item' : 'Add Item'}
        size="lg"
      >
        <ItemForm
          item={selectedItem}
          onClose={() => setIsModalOpen(false)}
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
            Are you sure you want to delete the item <span className="font-medium">{itemToDelete?.name}</span>?
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