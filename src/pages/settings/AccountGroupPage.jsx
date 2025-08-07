import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import Modal from '../../components/common/Modal';
import {
  fetchAccountGroups,
  addAccountGroup,
  updateAccountGroup,
  deleteAccountGroup,
} from '../../features/settings/accountGroupSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

// Validation schema for account group form
const accountGroupSchema = Yup.object().shape({
  Code: Yup.string()
    .required('Code is required')
    .max(10, 'Code must be at most 10 characters'),
  Name: Yup.string()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
});

function AccountGroupPage() {
  const dispatch = useDispatch();
  const { accountGroups, isLoading, error } = useSelector(
    (state) => state.accountGroups
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (Industry Page  - MODULE ID = 53 )
  const { Add, Edit, Delete } = useModulePermissions(88);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAccountGroup, setCurrentAccountGroup] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountGroupToDelete, setAccountGroupToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchAccountGroups());
  }, [dispatch]);

  const handleAddAccountGroup = () => {
    setCurrentAccountGroup(null);
    setIsModalOpen(true);
  };

  const handleEditAccountGroup = (accountGroup) => {
    setCurrentAccountGroup(accountGroup);
    setIsModalOpen(true);
  };

  const handleDeleteAccountGroup = (accountGroup) => {
    setAccountGroupToDelete(accountGroup);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (accountGroupToDelete) {
        await dispatch(deleteAccountGroup(accountGroupToDelete.ID)).unwrap();
        toast.success('Account group deleted successfully');
        setIsDeleteModalOpen(false);
        setAccountGroupToDelete(null);
      }
    } catch (error) {
      console.error('Failed to delete account group:', error);
      toast.error('Failed to delete account group. Please try again.');
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (currentAccountGroup) {
        await dispatch(
          updateAccountGroup({ ...values, ID: currentAccountGroup.ID })
        ).unwrap();
        toast.success('Account group updated successfully');
      } else {
        await dispatch(addAccountGroup(values)).unwrap();
        toast.success('Account group added successfully');
      }
      dispatch(fetchAccountGroups());
    } catch (error) {
      console.error('Error submitting account group:', error);
      toast.error('Failed to submit account group. Please try again.');
    } finally {
      setIsModalOpen(false);
      resetForm();
    }
  };

  // Table columns definition
  const columns = [
    {
      key: 'Code',
      header: 'Code',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'Name',
      header: 'Account Type',
      sortable: true,
    },
  ];

  // Actions for table rows
  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditAccountGroup,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteAccountGroup,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Account Types</h1>
            <p>Manage account types and their details</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAddAccountGroup}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Account Type
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={accountGroups}
          actions={actions}
          loading={isLoading}
        />
      </div>

      {/* Account Group Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentAccountGroup ? 'Edit Account Type' : 'Add Account Type'}
      >
        <Formik
          initialValues={{
            Code: currentAccountGroup?.Code || '',
            Name: currentAccountGroup?.Name || '',
          }}
          validationSchema={accountGroupSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form className="space-y-4">
              <FormField
                className="p-3 focus:outline-none"
                label="Code"
                name="Code"
                type="text"
                required
                placeholder="Enter code"
                value={values.Code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Code}
                touched={touched.Code}
              />
              <FormField
                className="p-3 focus:outline-none"
                label="Name"
                name="Name"
                type="text"
                required
                placeholder="Enter name"
                value={values.Name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Name}
                touched={touched.Name}
              />
              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="py-3">
          <p className="text-neutral-700">
            Are you sure you want to delete{' '}
            <span className="font-medium">{accountGroupToDelete?.Name}</span>?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone and may affect related records in the
            system.
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

export default AccountGroupPage;
