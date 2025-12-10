import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import IndustryForm from '../../components/forms/IndustryForm';
import {
  fetchIndustries,
  addIndustry,
  updateIndustry,
  deleteIndustry,
} from '../../features/settings/industrySlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function IndustryPage() {
  const dispatch = useDispatch();
  const { industries, isLoading } = useSelector((state) => state.industries);
  // ---------------------USE MODULE PERMISSIONS------------------START (Industry Page  - MODULE ID = 53 )
  const { Add, Edit, Delete } = useModulePermissions(53);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndustry, setCurrentIndustry] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [industryToDelete, setIndustryToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchIndustries());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentIndustry(null);
    setIsModalOpen(true);
  };

  const handleEdit = (industry) => {
    setCurrentIndustry(industry);
    setIsModalOpen(true);
  };

  const handleDelete = (industry) => {
    setIndustryToDelete(industry);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (industryToDelete) {
      try {
        await dispatch(deleteIndustry(industryToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setIndustryToDelete(null);
        toast.success('Industry deleted successfully.');
      } catch (error) {
        console.error('Failed to delete industry:', error);
        toast.error('Failed to delete industry. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentIndustry) {
        await dispatch(
          updateIndustry({ ...values, ID: currentIndustry.ID })
        ).unwrap();
        toast.success('Industry updated successfully.');
      } else {
        await dispatch(addIndustry(values)).unwrap();
        toast.success('Industry added successfully.');
      }
      dispatch(fetchIndustries());
    } catch (error) {
      console.error('Failed to save industry:', error);
      toast.error('Failed to save industry. Please try again.');
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
            <h1>Industries</h1>
            <p>Manage industries</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Industry
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={industries}
          actions={actions}
          loading={isLoading}
          emptyMessage="No industries found. Click 'Add Industry' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentIndustry ? 'Edit Industry' : 'Add Industry'}
      >
        <IndustryForm
          initialData={currentIndustry}
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
            Are you sure you want to delete the industry "
            {industryToDelete?.Name}"?
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

export default IndustryPage;
