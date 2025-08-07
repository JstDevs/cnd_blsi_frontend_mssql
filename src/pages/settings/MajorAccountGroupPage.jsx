import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import Modal from '../../components/common/Modal';
import {
  fetchMajorAccountGroups,
  addMajorAccountGroup,
  updateMajorAccountGroup,
  deleteMajorAccountGroup,
} from '../../features/settings/majorAccountGroupSlice';
import { fetchAccountGroups } from '../../features/settings/accountGroupSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

// Validation schema for major account group form
const majorAccountGroupSchema = Yup.object().shape({
  Code: Yup.string()
    .required('Code is required')
    .max(15, 'Code must be at most 15 characters'),
  Name: Yup.string()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
  AccountTypeID: Yup.number().required('Account Type is required'),
});

function MajorAccountGroupPage() {
  const dispatch = useDispatch();
  const { majorAccountGroups, isLoading } = useSelector(
    (state) => state.majorAccountGroups
  );
  const { accountGroups } = useSelector((state) => state.accountGroups);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMajorAccountGroup, setCurrentMajorAccountGroup] =
    useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [majorAccountGroupToDelete, setMajorAccountGroupToDelete] =
    useState(null);
  // ---------------------USE MODULE PERMISSIONS------------------START (MajorAccountGroupPage  - MODULE ID = 89 )
  const { Add, Edit, Delete } = useModulePermissions(89);
  useEffect(() => {
    dispatch(fetchMajorAccountGroups());
    dispatch(fetchAccountGroups());
  }, [dispatch]);

  const enrichedMajorAccountGroups = majorAccountGroups.map((group) => {
    const matchingAccountType = accountGroups.find(
      (accountType) => accountType.ID === group.AccountTypeID
    );
    return {
      ...group,
      accountTypeName: matchingAccountType ? matchingAccountType.Name : 'N/A',
    };
  });

  const handleAddMajorAccountGroup = () => {
    setCurrentMajorAccountGroup(null);
    setIsModalOpen(true);
  };

  const handleEditMajorAccountGroup = (majorAccountGroup) => {
    setCurrentMajorAccountGroup(majorAccountGroup);
    setIsModalOpen(true);
  };

  const handleDeleteMajorAccountGroup = (majorAccountGroup) => {
    setMajorAccountGroupToDelete(majorAccountGroup);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    try {
      if (majorAccountGroupToDelete) {
        dispatch(deleteMajorAccountGroup(majorAccountGroupToDelete.ID));

        toast.success('Major account group deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete major account group:', error);
      toast.error('Failed to delete major account group. Please try again.');
    } finally {
      setIsDeleteModalOpen(false);
      setMajorAccountGroupToDelete(null);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const accountTypeName =
      accountGroups.find((d) => d.ID === Number(values.AccountTypeID))?.Name ||
      '';

    const submissionData = {
      ...values,
      accountTypeName,
    };

    try {
      if (currentMajorAccountGroup) {
        await dispatch(
          updateMajorAccountGroup({
            ...submissionData,
            ID: currentMajorAccountGroup.ID,
          })
        ).unwrap();
        toast.success('Major account group updated successfully');
      } else {
        await dispatch(addMajorAccountGroup(submissionData)).unwrap();
        toast.success('Major account group added successfully');
      }
      dispatch(fetchMajorAccountGroups());
    } catch (error) {
      console.error('Failed to save major account group:', error);
      toast.error('Failed to save major account group. Please try again.');
    }
    setIsModalOpen(false);
    resetForm();
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
      header: 'Name',
      sortable: true,
    },
    {
      key: 'accountTypeName',
      header: 'Account Type',
      sortable: true,
    },
  ];

  // Actions for table rows
  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditMajorAccountGroup,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteMajorAccountGroup,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Account Sub-Types</h1>
            <p>Manage account sub-types and their details</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAddMajorAccountGroup}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Account Sub-Type
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={enrichedMajorAccountGroups}
          actions={actions}
          loading={isLoading}
        />
      </div>

      {/* Major Account Group Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentMajorAccountGroup
            ? 'Edit Account Sub-Type'
            : 'Add Account Sub-Type'
        }
      >
        <Formik
          initialValues={{
            Code: currentMajorAccountGroup?.Code || '',
            Name: currentMajorAccountGroup?.Name || '',
            AccountTypeID: currentMajorAccountGroup?.AccountTypeID || '',
          }}
          validationSchema={majorAccountGroupSchema}
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
              <FormField
                className="p-3 focus:outline-none"
                label="Account Type"
                name="AccountTypeID"
                type="select"
                required
                value={values.AccountTypeID}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.AccountTypeID}
                touched={touched.AccountTypeID}
                options={accountGroups.map((type) => ({
                  value: type.ID,
                  label: type.Name,
                }))}
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
            <span className="font-medium">
              {majorAccountGroupToDelete?.Name}
            </span>
            ?
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

export default MajorAccountGroupPage;
