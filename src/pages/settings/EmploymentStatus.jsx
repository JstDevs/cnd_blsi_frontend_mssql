import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import EmploymentStatusForm from '../../components/forms/EmploymentStatusForm';
import {
  fetchEmploymentStatuses,
  addEmploymentStatus,
  updateEmploymentStatus,
  deleteEmploymentStatus,
} from '../../features/settings/employmentStatusSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function EmploymentStatus() {
  const dispatch = useDispatch();
  const { employmentStatuses, isLoading } = useSelector(
    (state) => state.employmentStatuses
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (EmploymentStatus Page - MODULE ID = 93 )
  const { Add, Edit, Delete } = useModulePermissions(93);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmploymentStatus, setCurrentEmploymentStatus] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employmentStatusToDelete, setEmploymentStatusToDelete] =
    useState(null);

  useEffect(() => {
    dispatch(fetchEmploymentStatuses());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentEmploymentStatus(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employmentStatus) => {
    setCurrentEmploymentStatus(employmentStatus);
    setIsModalOpen(true);
  };

  const handleDelete = (employmentStatus) => {
    setEmploymentStatusToDelete(employmentStatus);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (employmentStatusToDelete) {
      try {
        await dispatch(
          deleteEmploymentStatus(employmentStatusToDelete.ID)
        ).unwrap();
        setIsDeleteModalOpen(false);
        setEmploymentStatusToDelete(null);
        toast.success('Employment status deleted successfully');
      } catch (error) {
        console.error('Failed to delete employment status:', error);
        toast.error('Failed to delete employment status. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentEmploymentStatus) {
        await dispatch(
          updateEmploymentStatus({ ...values, ID: currentEmploymentStatus.ID })
        ).unwrap();
        toast.success('Employment status updated successfully');
      } else {
        await dispatch(addEmploymentStatus(values)).unwrap();
        toast.success('Employment status saved successfully');
      }
      dispatch(fetchEmploymentStatuses());
    } catch (error) {
      console.error('Failed to save employment status:', error);
      toast.error('Failed to save employment status. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'Name',
      header: 'Employment Status',
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
            <h1>Employment Status</h1>
            <p>Manage Employment Statuses</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Employment Status
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={employmentStatuses}
          actions={actions}
          loading={isLoading}
          emptyMessage="No employment statuses found. Click 'Add Employment Status' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentEmploymentStatus
            ? 'Edit Employment Status'
            : 'Add Employment Status'
        }
      >
        <EmploymentStatusForm
          initialData={currentEmploymentStatus}
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
            Are you sure you want to delete the employment status "
            {employmentStatusToDelete?.Name}"?
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

export default EmploymentStatus;
