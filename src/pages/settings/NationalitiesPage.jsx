import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import NationalitiesForm from '../../components/forms/NationalitiesForm';
import {
  fetchNationalities,
  addNationality,
  updateNationality,
  deleteNationality,
} from '../../features/settings/nationalitiesSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function NationalitiesPage() {
  const dispatch = useDispatch();
  const { nationalities, isLoading } = useSelector(
    (state) => state.nationalities
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (NationalitiesPage - MODULE ID = 94 )
  const { Add, Edit, Delete } = useModulePermissions(94);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNationality, setCurrentNationality] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [nationalityToDelete, setNationalityToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchNationalities());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentNationality(null);
    setIsModalOpen(true);
  };

  const handleEdit = (nationality) => {
    setCurrentNationality(nationality);
    setIsModalOpen(true);
  };

  const handleDelete = (nationality) => {
    setNationalityToDelete(nationality);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (nationalityToDelete) {
      try {
        await dispatch(deleteNationality(nationalityToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setNationalityToDelete(null);
        toast.success('Nationality deleted successfully');
      } catch (error) {
        console.error('Failed to delete nationality:', error);
        toast.error('Failed to delete nationality. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentNationality) {
        await dispatch(
          updateNationality({ ...values, ID: currentNationality.ID })
        ).unwrap();
        toast.success('Nationality updated successfully');
      } else {
        await dispatch(addNationality(values)).unwrap();
        toast.success('Nationality saved successfully');
      }
      dispatch(fetchNationalities());
    } catch (error) {
      console.error('Failed to save nationality:', error);
      toast.error('Failed to save nationality. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'Name',
      header: 'Nationality',
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
            <h1>Nationalities</h1>
            <p>Manage Nationalities</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Nationality
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={nationalities}
          actions={actions}
          loading={isLoading}
          emptyMessage="No nationalities found. Click 'Add Nationality' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentNationality ? 'Edit Nationality' : 'Add Nationality'}
      >
        <NationalitiesForm
          initialData={currentNationality}
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
            Are you sure you want to delete the nationality "
            {nationalityToDelete?.Name}"?
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

export default NationalitiesPage;
