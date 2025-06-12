import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import Modal from '../../components/common/Modal';
import { fetchSubdepartments, addSubdepartment, updateSubdepartment, deleteSubdepartment } from '../../features/settings/subdepartmentSlice';
import { fetchDepartments } from '../../features/settings/departmentSlice';

// Validation schema for subdepartment form
const subdepartmentSchema = Yup.object().shape({
  subdepartmentCode: Yup.string()
    .required('Subdepartment code is required')
    .max(15, 'Subdepartment code must be at most 15 characters'),
  subdepartmentName: Yup.string()
    .required('Subdepartment name is required')
    .max(100, 'Subdepartment name must be at most 100 characters'),
  departmentId: Yup.number()
    .required('Department is required'),
});

function SubdepartmentPage() {
  const dispatch = useDispatch();
  const { subdepartments, isLoading } = useSelector(state => state.subdepartments);
  const { departments } = useSelector(state => state.departments);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubdepartment, setCurrentSubdepartment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subdepartmentToDelete, setSubdepartmentToDelete] = useState(null);
  
  useEffect(() => {
    dispatch(fetchSubdepartments());
    dispatch(fetchDepartments());
  }, [dispatch]);
  
  const handleAddSubdepartment = () => {
    setCurrentSubdepartment(null);
    setIsModalOpen(true);
  };
  
  const handleEditSubdepartment = (subdepartment) => {
    setCurrentSubdepartment(subdepartment);
    setIsModalOpen(true);
  };
  
  const handleDeleteSubdepartment = (subdepartment) => {
    setSubdepartmentToDelete(subdepartment);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    if (subdepartmentToDelete) {
      dispatch(deleteSubdepartment(subdepartmentToDelete.id));
      setIsDeleteModalOpen(false);
      setSubdepartmentToDelete(null);
    }
  };
  
  const handleSubmit = (values, { resetForm }) => {
    const departmentName = departments.find(d => d.id === Number(values.departmentId))?.departmentName || '';
    
    const submissionData = {
      ...values,
      departmentId: Number(values.departmentId),
      departmentName
    };
    
    if (currentSubdepartment) {
      dispatch(updateSubdepartment({ ...submissionData, id: currentSubdepartment.id }));
    } else {
      dispatch(addSubdepartment(submissionData));
    }
    setIsModalOpen(false);
    resetForm();
  };
  
  // Table columns definition
  const columns = [
    {
      key: 'subdepartmentCode',
      header: 'Code',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'subdepartmentName',
      header: 'Subdepartment Name',
      sortable: true,
    },
    {
      key: 'departmentName',
      header: 'Department',
      sortable: true,
    },
  ];
  
  // Actions for table rows
  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditSubdepartment,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteSubdepartment,
      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Subdepartments</h1>
            <p>Manage LGU subdepartments and their details</p>
          </div>
          <button
            type="button"
            onClick={handleAddSubdepartment}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Subdepartment
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={subdepartments}
          actions={actions}
          loading={isLoading}
        />
      </div>
      
      {/* Subdepartment Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSubdepartment ? "Edit Subdepartment" : "Add Subdepartment"}
      >
        <Formik
          initialValues={{
            subdepartmentCode: currentSubdepartment?.subdepartmentCode || '',
            subdepartmentName: currentSubdepartment?.subdepartmentName || '',
            departmentId: currentSubdepartment?.departmentId || '',
          }}
          validationSchema={subdepartmentSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="space-y-4">
              <FormField
                className='p-3 focus:outline-none'
                label="Subdepartment Code"
                name="subdepartmentCode"
                type="text"
                required
                placeholder="Enter subdepartment code"
                value={values.subdepartmentCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.subdepartmentCode}
                touched={touched.subdepartmentCode}
              />
              <FormField
                className='p-3 focus:outline-none'
                label="Subdepartment Name"
                name="subdepartmentName"
                type="text"
                required
                placeholder="Enter subdepartment name"
                value={values.subdepartmentName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.subdepartmentName}
                touched={touched.subdepartmentName}
              />
              <FormField
                className='p-3 focus:outline-none'
                label="Department"
                name="departmentId"
                type="select"
                required
                value={values.departmentId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.departmentId}
                touched={touched.departmentId}
                options={departments.map(dept => ({
                  value: dept.id,
                  label: dept.departmentName
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
            Are you sure you want to delete the subdepartment <span className="font-medium">{subdepartmentToDelete?.subdepartmentName}</span>?
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

export default SubdepartmentPage;