import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import DataTable from '@/components/common/DataTable';
import FormField from '@/components/common/FormField';
import Modal from '@/components/common/Modal';
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from '@/features/settings/userSlice';
import { fetchEmployees } from '../../features/settings/employeeSlice';
// import EmployeeForm from "./EmployeeForm";
import { fetchUserroles } from '../../features/settings/userrolesSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

// User Access options
// const userAccessOptions = [
//   { value: "Accounting admin", label: "Accounting admin" },
//   { value: "Administrator", label: "Administrator" },
//   { value: "Budget Head", label: "Budget Head" },
//   { value: "Check Printing", label: "Check Printing" },
//   { value: "Melvin's Access", label: "Melvin's Access" },
//   { value: "Non Acounting Access", label: "Non Acounting Access" },
//   { value: "Special Access", label: "Special Access" },
// ];
// const employeeOptions = [
//   { value: "emp1", label: "John Doe" },
//   { value: "emp2", label: "Jane Smith" },
//   { value: "emp3", label: "Alice Johnson" },
//   { value: "emp4", label: "Bob Williams" },
// ];

const userSchema = Yup.object().shape({
  UserName: Yup.string().required('User name is required'),
  UserAccessID: Yup.string().required('User Access is required'),
  Password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  ConfirmPassword: Yup.string()
    .oneOf([Yup.ref('Password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  EmployeeID: Yup.string().required('Choose Employee is required'),
});

function UserPage() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);
  // const { departments } = useSelector((state) => state.departments);
  // ---------------------USE MODULE PERMISSIONS------------------START ( User  Page  - MODULE ID =82 )
  const { Add, Edit, Delete } = useModulePermissions(82);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);

  const { userroles, isLoading: isLoadingRoles } = useSelector(
    (state) => state.userroles
  );

  const userAccessOptions = userroles.map((role) => ({
    value: role.ID,
    label: role.Description,
  }));

  const { employees, isLoading: isLoadingEmployees } = useSelector(
    (state) => state.employees
  );

  const employeeOptions = employees.map((emp) => ({
    value: emp.ID,
    label: `${emp.FirstName} ${emp.LastName}`,
  }));
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchEmployees());
    dispatch(fetchUserroles());
  }, [dispatch]);

  const handleAddUser = () => {
    setCurrentUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleResetPassword = (user) => {
    setUserToResetPassword(user);
    setIsResetPasswordModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (userToDelete) {
        await dispatch(deleteUser(userToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        toast.success('User deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      // Optionally show an error message to the user
      toast.error('Failed to delete user');
    }
  };

  // const handleSubmit = (values, { resetForm }) => {
  //   // const departmentName =
  //   //   departments.find((d) => d.ID === Number(values.departmentId))
  //   //     ?.departmentName || "";

  //   const submissionData = {
  //     ...values,
  //     // departmentId: Number(values.departmentId),
  //     // departmentName,
  //   };

  //   if (currentUser) {
  //     dispatch(updateUser({ ...submissionData, ID: currentUser.ID }));
  //   } else {
  //     dispatch(addUser(submissionData));
  //   }
  //   setIsModalOpen(false);
  //   resetForm();
  // };

  const handleSubmit = async (
    values,
    { resetForm, setErrors, setSubmitting }
  ) => {
    // const submissionData = { ...values };
    // console.log('Submission data:', submissionData);
    // TODO FOR NOW AS WE CAN ONLY SELECT ONE USER ACCESS ID THIS NEEDS TO BE FIXED LATER
    const payloadAddUser = {
      EmployeeID: values.EmployeeID,
      UserName: values.UserName,
      Password: values.Password,
      UserAccessArray: [values.UserAccessID],
    };
    console.log('Payload:', payloadAddUser);
    try {
      if (currentUser) {
        await dispatch(
          updateUser({ ...payloadAddUser, ID: currentUser.ID })
        ).unwrap();
      } else {
        await dispatch(addUser(payloadAddUser)).unwrap();
      }
      dispatch(fetchUsers());
      toast.success('User saved successfully.');
    } catch (error) {
      console.log(error);
      setErrors({ general: 'Unexpected error occurred.' });
      toast.error('Failed to save user. Please try again.');
    } finally {
      resetForm();
      setIsModalOpen(false);
      setSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  // Table columns definition
  const columns = [
    { key: 'UserName', header: 'User Name', sortable: true },
    {
      key: 'UserAccessValue',
      header: 'User Access',
      sortable: true,
      render: (value, row) => (
        <span>
          {value ||
            row?.accessList?.map((role) => role.Description).join(', ') ||
            'N/A'}
        </span>
      ),
    },
    // { key: 'Employee', header: 'Employee', sortable: true },
  ];

  // Actions for table rows
  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditUser,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteUser,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  // Modify users to include UserAccessValue
  const modifiedUsers = users.map((user) => ({
    ...user,
    UserAccessValue: userroles.find((role) => role.ID === user.UserAccessID)
      ?.Description,
  }));

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Users</h1>
            <p>Manage system users and their access rights</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAddUser}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add User
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={modifiedUsers}
          actions={actions}
          loading={isLoading || isLoadingRoles || isLoadingEmployees}
        />
      </div>

      {/* User Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? 'Edit User' : 'Add User'}
      >
        <Formik
          initialValues={{
            UserName: currentUser?.UserName || '',
            UserAccessID: currentUser?.UserAccessID || '',
            Password: '',
            ConfirmPassword: '',
            EmployeeID: currentUser?.EmployeeID || '',
          }}
          validationSchema={userSchema}
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
              {errors.general && (
                <div className="text-red-600 bg-red-50 p-2 rounded text-sm">
                  {errors.general}
                </div>
              )}
              <FormField
                className="p-3 focus:outline-none"
                label="User Name"
                name="UserName"
                type="text"
                required
                placeholder="Enter user name"
                value={values.UserName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.UserName}
                touched={touched.UserName}
              />
              <FormField
                className="p-3 focus:outline-none"
                label="User Access"
                name="UserAccessID"
                type="select"
                required
                value={values.UserAccessID}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.UserAccessID}
                touched={touched.UserAccessID}
                options={userAccessOptions}
              />
              <FormField
                className="p-3 focus:outline-none"
                label="Password"
                name="Password"
                type="password"
                required
                placeholder="Enter password"
                value={values.Password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Password}
                touched={touched.Password}
              />
              <FormField
                className="p-3 focus:outline-none"
                label="Confirm Password"
                name="ConfirmPassword"
                type="password"
                required
                placeholder="Confirm password"
                value={values.ConfirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.ConfirmPassword}
                touched={touched.ConfirmPassword}
              />
              <FormField
                className="p-3 focus:outline-none"
                label="Choose Employee"
                name="EmployeeID"
                type="select"
                required
                value={values.EmployeeID}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.EmployeeID}
                touched={touched.EmployeeID}
                options={employeeOptions}
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
                  {isSubmitting ? 'Saving...' : currentUser ? 'Update' : 'Save'}
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
            Are you sure you want to delete the user{' '}
            <span className="font-medium">{userToDelete?.UserName}</span>?
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

export default UserPage;
