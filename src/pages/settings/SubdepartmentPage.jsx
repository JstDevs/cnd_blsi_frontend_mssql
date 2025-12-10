import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import Modal from '../../components/common/Modal';
import {
  fetchSubdepartments,
  addSubdepartment,
  updateSubdepartment,
  deleteSubdepartment,
} from '../../features/settings/subdepartmentSlice';
import { fetchDepartments } from '../../features/settings/departmentSlice';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function SubdepartmentPage() {
  const dispatch = useDispatch();
  const { subdepartments, isLoading } = useSelector(
    (state) => state.subdepartments || {}
  );
  const { departments } = useSelector((state) => state.departments);
  // ---------------------USE MODULE PERMISSIONS------------------START ( DEPARTMENT - MODULE ID = 76 )
  const { Add, Edit, Delete } = useModulePermissions(76);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubdepartment, setCurrentSubdepartment] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subdepartmentToDelete, setSubdepartmentToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchSubdepartments());
    dispatch(fetchDepartments());
  }, [dispatch]);
  // Enhanced validation schema for subdepartment form with duplicate checks
  const subdepartmentSchema = Yup.object().shape({
    Code: Yup.string()
      .required('Subdepartment code is required')
      .max(15, 'Subdepartment code must be at most 15 characters')
      .test(
        'unique-code',
        'Subdepartment code already exists in this department',
        function (value) {
          if (!value || !this.parent.DepartmentID) return true;

          const trimmedValue = value.trim().toLowerCase();
          const duplicate = subdepartments?.some(
            (subdept) =>
              subdept.Code.trim().toLowerCase() === trimmedValue &&
              subdept.DepartmentID === this.parent.DepartmentID &&
              (!currentSubdepartment || subdept.ID !== currentSubdepartment.ID)
          );
          return !duplicate;
        }
      ),
    Name: Yup.string()
      .required('Subdepartment name is required')
      .max(100, 'Subdepartment name must be at most 100 characters')
      .test(
        'unique-name',
        'Subdepartment name already exists in this department',
        function (value) {
          if (!value || !this.parent.DepartmentID) return true;

          const trimmedValue = value.trim().toLowerCase();
          const duplicate = subdepartments?.some(
            (subdept) =>
              subdept.Name.trim().toLowerCase() === trimmedValue &&
              subdept.DepartmentID === this.parent.DepartmentID &&
              (!currentSubdepartment || subdept.ID !== currentSubdepartment.ID)
          );
          return !duplicate;
        }
      ),
    DepartmentID: Yup.number().required('Department is required'),
  });
  const enrichedSubdepartments = subdepartments.map((sub) => ({
    ...sub,
    departmentName:
      departments.find((d) => d.ID === sub.DepartmentID)?.Name || 'N/A',
  }));

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

  const confirmDelete = async () => {
    try {
      if (subdepartmentToDelete) {
        await dispatch(deleteSubdepartment(subdepartmentToDelete.ID)).unwrap();
        toast.success('Subdepartment deleted successfully.');
      }
    } catch (error) {
      console.error('Failed to delete subdepartment:', error);
      toast.error('Failed to delete subdepartment. Please try again.');
    } finally {
      setSubdepartmentToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const departmentName =
      departments.find((d) => d.ID === Number(values.DepartmentID))?.Name || '';

    const submissionData = {
      ...values,
      departmentName,
    };

    try {
      if (currentSubdepartment) {
        dispatch(
          updateSubdepartment({
            ...submissionData,
            ID: currentSubdepartment.ID,
          })
        );
      } else {
        dispatch(addSubdepartment(submissionData));
      }
      toast.success('Subdepartment saved successfully.');
    } catch (error) {
      console.log(error);
      toast.error('Failed to save subdepartment. Please try again.');
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
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditSubdepartment,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteSubdepartment,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Subdepartments</h1>
            <p>Manage LGU subdepartments and their details</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAddSubdepartment}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Subdepartment
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={enrichedSubdepartments}
          actions={actions}
          loading={isLoading}
        />
      </div>

      {/* Subdepartment Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentSubdepartment ? 'Edit Subdepartment' : 'Add Subdepartment'
        }
      >
        <Formik
          initialValues={{
            Code: currentSubdepartment?.Code || '',
            Name: currentSubdepartment?.Name || '',
            DepartmentID: currentSubdepartment?.DepartmentID || '',
          }}
          validationSchema={subdepartmentSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form className="space-y-4">
              <FormField
                className="p-3 focus:outline-none"
                label="Subdepartment Code"
                name="Code"
                type="text"
                required
                placeholder="Enter subdepartment code"
                value={values.Code}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Code}
                touched={touched.Code}
              />
              <FormField
                className="p-3 focus:outline-none"
                label="Subdepartment Name"
                name="Name"
                type="text"
                required
                placeholder="Enter subdepartment name"
                value={values.Name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Name}
                touched={touched.Name}
              />
              <SearchableDropdown
                // className="p-3 focus:outline-none"
                label="Department"
                name="DepartmentID"
                type="select"
                required
                selectedValue={values.DepartmentID}
                onSelect={(value) => setFieldValue('DepartmentID', value)}
                onBlur={handleBlur}
                error={errors.DepartmentID}
                touched={touched.DepartmentID}
                options={departments.map((dept) => ({
                  value: dept.ID,
                  label: dept.Name,
                }))}
              />
              {/* <FormField
                className="p-3 focus:outline-none"
                label="Department"
                name="DepartmentID"
                type="select"
                required
                value={values.DepartmentID}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.DepartmentID}
                touched={touched.DepartmentID}
                options={departments.map((dept) => ({
                  value: dept.ID,
                  label: dept.Name,
                }))}
              /> */}
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
            Are you sure you want to delete the subdepartment{' '}
            <span className="font-medium">
              {subdepartmentToDelete?.subdepartmentName}
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

export default SubdepartmentPage;
