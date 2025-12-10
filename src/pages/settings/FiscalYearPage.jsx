import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import FiscalYearForm from '../../components/forms/FiscalYearForm';
import {
  fetchFiscalYears,
  addFiscalYear,
  updateFiscalYear,
  deleteFiscalYear,
} from '../../features/settings/fiscalYearSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function FiscalYearPage() {
  const dispatch = useDispatch();
  const { fiscalYears, isLoading } = useSelector((state) => state.fiscalYears);
  // ---------------------USE MODULE PERMISSIONS------------------START (Fiscal Year Page  - MODULE ID = 45 )
  const { Add, Edit, Delete } = useModulePermissions(45);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFiscalYear, setCurrentFiscalYear] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fiscalYearToDelete, setFiscalYearToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchFiscalYears());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentFiscalYear(null);
    setIsModalOpen(true);
  };

  const handleEdit = (fiscalYear) => {
    setCurrentFiscalYear(fiscalYear);
    setIsModalOpen(true);
  };

  const handleDelete = (fiscalYear) => {
    setFiscalYearToDelete(fiscalYear);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (fiscalYearToDelete) {
      try {
        await dispatch(deleteFiscalYear(fiscalYearToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setFiscalYearToDelete(null);
        toast.success('Fiscal year deleted successfully.');
      } catch (error) {
        console.error('Failed to delete fiscal year:', error);
        toast.error('Failed to delete fiscal year. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentFiscalYear) {
        await dispatch(
          updateFiscalYear({ ...values, id: currentFiscalYear.ID })
        ).unwrap();
        toast.success('Fiscal year updated successfully.');
      } else {
        await dispatch(addFiscalYear(values)).unwrap();
        toast.success('Fiscal year added successfully.');
      }
      dispatch(fetchFiscalYears());
    } catch (error) {
      console.error('Failed to save fiscal year:', error);
      toast.error('Failed to save fiscal year. Please try again.');
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
    {
      key: 'Year',
      header: 'Year',
      sortable: true,
    },
    {
      key: 'MonthStart',
      header: 'Month Start',
      sortable: true,
    },
    {
      key: 'MonthEnd',
      header: 'Month End',
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
            <h1>Fiscal Years</h1>
            <p>Manage fiscal years</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Fiscal Year
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={fiscalYears}
          actions={actions}
          loading={isLoading}
          emptyMessage="No fiscal years found. Click 'Add Fiscal Year' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentFiscalYear ? 'Edit Fiscal Year' : 'Add Fiscal Year'}
      >
        <FiscalYearForm
          initialData={currentFiscalYear}
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
            Are you sure you want to delete the fiscal year "
            {fiscalYearToDelete?.Name}"?
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

export default FiscalYearPage;
