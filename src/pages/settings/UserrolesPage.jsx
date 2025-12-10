import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import UserrolesForm from '../../components/forms/UserrolesForm';
import {
  fetchUserroles,
  addUserrole,
  updateUserrole,
  deleteUserrole,
} from '../../features/settings/userrolesSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function UserrolesPage() {
  const dispatch = useDispatch();
  const { userroles, isLoading } = useSelector((state) => state.userroles);
  // ---------------------USE MODULE PERMISSIONS------------------START ( User Roles Page  - MODULE ID = 84 )
  const { Add, Edit, Delete } = useModulePermissions(84);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserrole, setCurrentUserrole] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userroleToDelete, setUserroleToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchUserroles());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentUserrole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (userrole) => {
    if (userrole.Description == 'Administrator') {
      toast.error("The 'Administrator' role cannot be edited.");
      return;
    }
    setCurrentUserrole(userrole);
    setIsModalOpen(true);
  };

  const handleDelete = (userrole) => {
    if (userrole.Description == 'Administrator') {
      toast.error("The 'Administrator' role cannot be deleted.");
      return;
    }
    setUserroleToDelete(userrole);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userroleToDelete) {
      try {
        await dispatch(deleteUserrole(userroleToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setUserroleToDelete(null);
        toast.success('User role deleted successfully');
      } catch (error) {
        console.error('Failed to delete user role:', error);
        toast.error('Failed to delete user role. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentUserrole) {
        await dispatch(
          updateUserrole({ ...values, ID: currentUserrole.ID })
        ).unwrap();
        dispatch(fetchUserroles());
        toast.success('User role updated successfully');
      } else {
        await dispatch(addUserrole(values)).unwrap();
        dispatch(fetchUserroles());
        toast.success('User role saved successfully');
      }
    } catch (error) {
      console.error('Failed to save user role:', error);
      toast.error('Failed to save user role. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'Description',
      header: 'User Role',
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
            <h1>User Roles</h1>
            <p>Manage User Roles</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add User Role
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={userroles}
          actions={actions}
          loading={isLoading}
          emptyMessage="No user roles found. Click 'Add User Role' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUserrole ? 'Edit User Role' : 'Add User Role'}
      >
        <UserrolesForm
          initialData={currentUserrole}
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
            Are you sure you want to delete the user role "
            {userroleToDelete?.Name}"?
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

export default UserrolesPage;
