import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import Modal from '../../components/common/Modal';
import {
  fetchDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from '../../features/settings/departmentSlice';
import { useModulePermissions } from '@/utils/useModulePremission';

function DepartmentPage() {
  const dispatch = useDispatch();
  const { departments, isLoading, error } = useSelector(
    (state) => state.departments
  );
  // ---------------------USE MODULE PERMISSIONS------------------START ( DEPARTMENT - MODULE ID = 39 )
  const { Add, Edit, Delete } = useModulePermissions(39);
  // console.log('View:', View, 'Add:', Add, 'Edit:', Edit, 'Delete:', Delete);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);
  // Validation schema for department form
  const departmentSchema = Yup.object().shape({
    Code: Yup.string()
      .required('Department code is required')
      .max(10, 'Department code must be at most 10 characters')
      .test('unique-code', 'Department code already exists', function (value) {
        if (!value) return true;

        const duplicate = departments.some(
          (dept) =>
            dept.Code.trim().toLowerCase() === value.trim().toLowerCase() &&
            (!currentDepartment || dept.ID !== currentDepartment.ID)
        );
        return !duplicate;
      }),
    Name: Yup.string()
      .required('Department name is required')
      .max(100, 'Department name must be at most 100 characters')
      .test('unique-name', 'Department name already exists', function (value) {
        if (!value) return true;

        const duplicate = departments.some(
          (dept) =>
            dept.Name.trim().toLowerCase() === value.trim().toLowerCase() &&
            (!currentDepartment || dept.ID !== currentDepartment.ID)
        );
        return !duplicate;
      }),
  });
  const handleAddDepartment = () => {
    setCurrentDepartment(null);
    setIsModalOpen(true);
  };

  const handleEditDepartment = (department) => {
    setCurrentDepartment(department);
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = (department) => {
    setDepartmentToDelete(department);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (departmentToDelete) {
      dispatch(deleteDepartment(departmentToDelete.ID));
      setIsDeleteModalOpen(false);
      setDepartmentToDelete(null);
    }
  };

  const handleSubmit = (values, { resetForm }) => {
    if (currentDepartment) {
      dispatch(updateDepartment({ ...values, ID: currentDepartment.ID }));
    } else {
      dispatch(addDepartment(values));
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
      header: 'Department Name',
      sortable: true,
    },
  ];

  // Actions for table rows
  // const actions = [
  //   Edit && {
  //     icon: PencilIcon,
  //     title: 'Edit',
  //     onClick: handleEditDepartment,
  //     className:
  //       'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
  //   },
  //   Delete && {
  //     icon: TrashIcon,
  //     title: 'Delete',
  //     onClick: handleDeleteDepartment,
  //     className:
  //       'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
  //   },
  // ];
  const actions = (row) => {
    const baseActions = [];
    if (Edit) {
      baseActions.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: () => handleEditDepartment(row),
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
    }
    if (Delete && row.ID > 4) {
      baseActions.push({
        icon: TrashIcon,
        title: 'Delete',
        onClick: () => handleDeleteDepartment(row),
        className:
          'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    }
    return baseActions;
  };
  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Departments</h1>
            <p>Manage LGU departments and their details</p>
          </div>
          {/* // SHOW ONLY IF USER HAS VIEW PERMISSION  */}
          {Add && (
            <button
              type="button"
              onClick={handleAddDepartment}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Department
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={departments}
          actions={actions}
          loading={isLoading}
        />
      </div>

      {/* Department Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentDepartment ? 'Edit Department' : 'Add Department'}
      >
        <Formik
          initialValues={{
            Code: currentDepartment?.Code || '',
            Name: currentDepartment?.Name || '',
          }}
          validationSchema={departmentSchema}
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
                label="Department Code"
                name="Code"
                type="text"
                required
                placeholder="Enter department code"
                value={values.Code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Code}
                touched={touched.Code}
              />
              <FormField
                className="p-3 focus:outline-none"
                label="Department Name"
                name="Name"
                type="text"
                required
                placeholder="Enter department name"
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
            Are you sure you want to delete the department{' '}
            <span className="font-medium">
              {departmentToDelete?.departmentName}
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

export default DepartmentPage;
