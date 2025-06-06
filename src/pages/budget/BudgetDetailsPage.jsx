import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import BudgetDetailsForm from '../../components/forms/BudgetDetailsForm';
import {
  fetchBudgetDetails,
  addBudgetDetail,
  updateBudgetDetail,
  deleteBudgetDetail
} from '../../features/budget/budgetDetailsSlice';

function BudgetDetailsPage() {
  const dispatch = useDispatch();
  const { budgetDetails, isLoading } = useSelector(state => state.budgetDetails);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBudgetDetail, setCurrentBudgetDetail] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [budgetDetailToDelete, setBudgetDetailToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchBudgetDetails());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentBudgetDetail(null);
    setIsModalOpen(true);
  };

  const handleEdit = (budgetDetail) => {
    setCurrentBudgetDetail(budgetDetail);
    setIsModalOpen(true);
  };

  const handleDelete = (budgetDetail) => {
    setBudgetDetailToDelete(budgetDetail);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (budgetDetailToDelete) {
      try {
        await dispatch(deleteBudgetDetail(budgetDetailToDelete.id)).unwrap();
        setIsDeleteModalOpen(false);
        setBudgetDetailToDelete(null);
      } catch (error) {
        console.error('Failed to delete budget detail:', error);
      }
    }
  };

  const handleSubmit = (values) => {
    if (currentBudgetDetail) {
      dispatch(updateBudgetDetail({ ...values, id: currentBudgetDetail.id }));
    } else {
      dispatch(addBudgetDetail(values));
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
    },
    {
      key: 'year',
      header: 'Year',
      sortable: true
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP'
      }).format(value)
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
            <h1>Budget Details</h1>
            <p>Manage budget details</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Budget Detail
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={budgetDetails}
          actions={actions}
          loading={isLoading}
          emptyMessage="No budget details found. Click 'Add Budget Detail' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentBudgetDetail ? "Edit Budget Detail" : "Add Budget Detail"}
      >
        <BudgetDetailsForm
          initialData={currentBudgetDetail}
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
            Are you sure you want to delete the budget detail "{budgetDetailToDelete?.name}"?
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

export default BudgetDetailsPage; 