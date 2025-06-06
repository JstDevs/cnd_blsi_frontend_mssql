import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import TaxCodeForm from '../../components/forms/TaxCodeForm';
import {
  fetchTaxCodes,
  addTaxCode,
  updateTaxCode,
  deleteTaxCode
} from '../../features/settings/taxCodeSlice';

function TaxCodePage() {
  const dispatch = useDispatch();
  const { taxCodes, isLoading } = useSelector(state => state.taxCodes);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTaxCode, setCurrentTaxCode] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taxCodeToDelete, setTaxCodeToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchTaxCodes());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentTaxCode(null);
    setIsModalOpen(true);
  };

  const handleEdit = (taxCode) => {
    setCurrentTaxCode(taxCode);
    setIsModalOpen(true);
  };

  const handleDelete = (taxCode) => {
    setTaxCodeToDelete(taxCode);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taxCodeToDelete) {
      try {
        await dispatch(deleteTaxCode(taxCodeToDelete.id)).unwrap();
        setIsDeleteModalOpen(false);
        setTaxCodeToDelete(null);
      } catch (error) {
        console.error('Failed to delete tax code:', error);
      }
    }
  };

  const handleSubmit = (values) => {
    // Assuming rate is stored as a decimal, convert to percentage for display if needed later
    // When submitting, ensure it's in the correct format for your backend (decimal usually)
    if (currentTaxCode) {
      dispatch(updateTaxCode({ ...values, id: currentTaxCode.id }));
    } else {
      dispatch(addTaxCode(values));
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      // Optional: Add render function to display label instead of value if needed
    },
    {
      key: 'code',
      header: 'Code',
      sortable: true
    },
    {
      key: 'natureOfPayment',
      header: 'Nature of Payment',
      sortable: true
    },
    {
      key: 'rate',
      header: 'Rate (%)',
      sortable: true,
      render: (value) => `${(value * 100).toFixed(2)}%`
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
            <h1>Tax Codes</h1>
            <p>Manage tax codes</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Tax Code
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={taxCodes}
          actions={actions}
          loading={isLoading}
          emptyMessage="No tax codes found. Click 'Add Tax Code' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentTaxCode ? "Edit Tax Code" : "Add Tax Code"}
      >
        <TaxCodeForm
          initialData={currentTaxCode}
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
            Are you sure you want to delete the tax code "{taxCodeToDelete?.code}"?
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

export default TaxCodePage; 