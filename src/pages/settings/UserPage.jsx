import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, PencilIcon, TrashIcon, KeyIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import FormField from '../../components/common/FormField';
import Modal from '../../components/common/Modal';
import { fetchUsers, addUser, updateUser, deleteUser } from '../../features/settings/userSlice';
import { fetchDepartments } from '../../features/settings/departmentSlice';

// User Access options
const userAccessOptions = [
  { value: 'Accounting admin', label: 'Accounting admin' },
  { value: 'Administrator', label: 'Administrator' },
  { value: 'BUdget Head', label: 'BUdget Head' },
  { value: 'Check Printing', label: 'Check Printing' },
  { value: "Melvin's Access", label: "Melvin's Access" },
  { value: 'Non Acounting Access', label: 'Non Acounting Access' },
  { value: 'Special Access', label: 'Special Access' },
];
const employeeOptions = [
  { value: 'emp1', label: 'John Doe' },
  { value: 'emp2', label: 'Jane Smith' },
  { value: 'emp3', label: 'Alice Johnson' },
  { value: 'emp4', label: 'Bob Williams' },
];

const userSchema = Yup.object().shape({
  username: Yup.string().required('User name is required'),
  userAccess: Yup.string().required('User Access is required'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  employee: Yup.string().required('Choose Employee is required'),
});

function UserPage() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector(state => state.users);
  const { departments } = useSelector(state => state.departments);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);
  
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDepartments());
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
  
  const confirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUser(userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };
  
  const handleSubmit = (values, { resetForm }) => {
    const departmentName = departments.find(d => d.id === Number(values.departmentId))?.departmentName || '';
    
    const submissionData = {
      ...values,
      departmentId: Number(values.departmentId),
      departmentName
    };
    
    if (currentUser) {
      dispatch(updateUser({ ...submissionData, id: currentUser.id }));
    } else {
      dispatch(addUser(submissionData));
    }
    setIsModalOpen(false);
    resetForm();
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };
  
  // Table columns definition
  const columns = [
    { key: 'username', header: 'User Name', sortable: true },
    { key: 'userAccess', header: 'User Access', sortable: true },
    { key: 'employee', header: 'Employee', sortable: true },
  ];
  
  // Actions for table rows
  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditUser,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteUser,
      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Users</h1>
            <p>Manage system users and their access rights</p>
          </div>
          <button
            type="button"
            onClick={handleAddUser}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add User
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={users}
          actions={actions}
          loading={isLoading}
        />
      </div>
      
      {/* User Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? "Edit User" : "Add User"}
      >
        <Formik
          initialValues={{
            username: currentUser?.username || '',
            userAccess: currentUser?.userAccess || '',
            password: '',
            confirmPassword: '',
            employee: currentUser?.employee || '',
          }}
          validationSchema={userSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="space-y-4">
              <FormField
                className='p-3 focus:outline-none'
                label="User Name"
                name="username"
                type="text"
                required
                placeholder="Enter user name"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.username}
                touched={touched.username}
              />
              <FormField
                className='p-3 focus:outline-none'
                label="User Access"
                name="userAccess"
                type="select"
                required
                value={values.userAccess}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.userAccess}
                touched={touched.userAccess}
                options={userAccessOptions}
              />
              <FormField
                className='p-3 focus:outline-none'
                label="Password"
                name="password"
                type="password"
                required
                placeholder="Enter password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
              />
              <FormField
                className='p-3 focus:outline-none'
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
              />
              <FormField
                className='p-3 focus:outline-none'
                label="Choose Employee"
                name="employee"
                type="select"
                required
                value={values.employee}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.employee}
                touched={touched.employee}
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
            Are you sure you want to delete the user <span className="font-medium">{userToDelete?.username}</span>?
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

export default UserPage;