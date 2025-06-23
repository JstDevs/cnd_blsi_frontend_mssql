import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import Modal from '../../components/common/Modal';
import { fetchSubMajorAccountGroups, addSubMajorAccountGroup, updateSubMajorAccountGroup, deleteSubMajorAccountGroup } from '../../features/settings/subMajorAccountGroupSlice';
import { fetchMajorAccountGroups } from '../../features/settings/majorAccountGroupSlice';

// Validation schema for sub major account group form
const subMajorAccountGroupSchema = Yup.object().shape({
  Code: Yup.string()
    .required('Code is required')
    .max(15, 'Code must be at most 15 characters'),
  Name: Yup.string()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
  AccountSubTypeID: Yup.number()
    .required('Account Sub Type is required'),
});

function SubMajorAccountGroupPage() {
  const dispatch = useDispatch();
  const { subMajorAccountGroups, isLoading } = useSelector(state => state.subMajorAccountGroups);
  const { majorAccountGroups } = useSelector(state => state.majorAccountGroups);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubMajorAccountGroup, setCurrentSubMajorAccountGroup] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subMajorAccountGroupToDelete, setSubMajorAccountGroupToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchSubMajorAccountGroups());
    dispatch(fetchMajorAccountGroups());
  }, [dispatch]);

  const enrichedSubMajorAccountGroups = subMajorAccountGroups.map(group => ({
    ...group,
    accountSubTypeName: group.AccountSubType?.Name || ''
  }));

  const handleAddSubMajorAccountGroup = () => {
    setCurrentSubMajorAccountGroup(null);
    setIsModalOpen(true);
  };

  const handleEditSubMajorAccountGroup = (subMajorAccountGroup) => {
    setCurrentSubMajorAccountGroup(subMajorAccountGroup);
    setIsModalOpen(true);
  };

  const handleDeleteSubMajorAccountGroup = (subMajorAccountGroup) => {
    setSubMajorAccountGroupToDelete(subMajorAccountGroup);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (subMajorAccountGroupToDelete) {
      dispatch(deleteSubMajorAccountGroup(subMajorAccountGroupToDelete.ID));
      setIsDeleteModalOpen(false);
      setSubMajorAccountGroupToDelete(null);
    }
  };
  
  const handleSubmit = (values, { resetForm }) => {
    const accountSubTypeName = majorAccountGroups.find(d => d.ID === Number(values.AccountSubTypeID))?.Name || '';

    const submissionData = {
      ...values,
      accountSubTypeName
    };

    if (currentSubMajorAccountGroup) {
      dispatch(updateSubMajorAccountGroup({ ...submissionData, ID: currentSubMajorAccountGroup.ID }));
    } else {
      dispatch(addSubMajorAccountGroup(submissionData));
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
      key: 'accountSubTypeName',
      header: 'Account Type',
      sortable: true,
    },
  ];
  
  // Actions for table rows
  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditSubMajorAccountGroup,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteSubMajorAccountGroup,
      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Account Category</h1>
            <p>Manage account categories and their details</p>
          </div>
          <button
            type="button"
            onClick={handleAddSubMajorAccountGroup}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Account Category
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={enrichedSubMajorAccountGroups}
          actions={actions}
          loading={isLoading}
        />
      </div>

      {/* Sub Major Account Group Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSubMajorAccountGroup ? "Edit Account Category" : "Add Account Category"}
      >
        <Formik
          initialValues={{
            Code: currentSubMajorAccountGroup?.Code || '',
            Name: currentSubMajorAccountGroup?.Name || '',
            AccountTypeID: currentSubMajorAccountGroup?.AccountTypeID || '',
          }}
          validationSchema={subMajorAccountGroupSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="space-y-4">
              <FormField
                className='p-3 focus:outline-none'
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
                className='p-3 focus:outline-none'
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
                className='p-3 focus:outline-none'
                label="Account Type"
                name="AccountSubTypeID"
                type="select"
                required
                value={values.AccountSubTypeID}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.AccountSubTypeID}
                touched={touched.AccountSubTypeID}
                options={majorAccountGroups.map(type => ({
                  value: type.ID,
                  label: type.Name
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
            Are you sure you want to delete <span className="font-medium">{subMajorAccountGroupToDelete?.Name}</span>?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone and may affect related records in the system.
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

export default SubMajorAccountGroupPage;