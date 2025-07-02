import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import DataTable from "@/components/common/DataTable";
import FormField from "@/components/common/FormField";
import Modal from "@/components/common/Modal";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "@/features/settings/userSlice";
import { fetchEmployees } from '../../features/settings/employeeSlice';
// import EmployeeForm from "./EmployeeForm";
import { fetchUserroles } from "../../features/settings/userrolesSlice";

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
  UserName: Yup.string().required("User name is required"),
  UserAccessID: Yup.string().required("User Access is required"),
  Password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  ConfirmPassword: Yup.string()
    .oneOf([Yup.ref("Password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  EmployeeID: Yup.string().required("Choose Employee is required"),
});

function UserPage() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);
  const { departments } = useSelector((state) => state.departments);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchEmployees());
    dispatch(fetchUserroles());
  }, [dispatch]);

  const { userroles, isLoading: isLoadingRoles } = useSelector((state) => state.userroles);


  const userAccessOptions = userroles.map((role) => ({
    value: role.ID,
    label: role.Description,
  }));

  const { employees } = useSelector((state) => state.employees);
  const isLoadingEmployees = useSelector((state) => state.employees.isLoading);
  const employeeOptions = employees.map((emp) => ({
    value: emp.ID,
    label: `${emp.FirstName} ${emp.LastName}`,
  }));

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
      dispatch(deleteUser(userToDelete.ID));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
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

  const handleSubmit = async (values, { resetForm, setErrors, setSubmitting }) => {
    const submissionData = { ...values };

    try {
      if (currentUser) {
        const result = await dispatch(updateUser({ ...submissionData, ID: currentUser.ID }));

        if (updateUser.fulfilled.match(result)) {
          setIsModalOpen(false);
          resetForm();
        } else if (updateUser.rejected.match(result)) {
          setErrors({ general: result.payload || "Failed to update user." });
        }
      } else {
        const result = await dispatch(addUser(submissionData));

        if (addUser.fulfilled.match(result)) {
          setIsModalOpen(false);
          resetForm();
        } else if (addUser.rejected.match(result)) {
          setErrors({ general: result.payload || "Failed to add user." });
        }
      }
    } catch (error) {
      console.log(error);
      setErrors({ general: "Unexpected error occurred." });
    } finally {
      setSubmitting(false);
    }
  };




  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
  };

  // Table columns definition
  const columns = [
    { key: "UserName", header: "User Name", sortable: true },
    { key: "UserAccessID", header: "User Access", sortable: true },
    { key: "Employee", header: "Employee", sortable: true },
  ];

  // Actions for table rows
  const actions = [
    {
      icon: PencilIcon,
      title: "Edit",
      onClick: handleEditUser,
      className:
        "text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50",
    },
    {
      icon: TrashIcon,
      title: "Delete",
      onClick: handleDeleteUser,
      className:
        "text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50",
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
            UserName: currentUser?.UserName || "",
            UserAccessID: currentUser?.UserAccessID || "",
            Password: "",
            ConfirmPassword: "",
            EmployeeID: currentUser?.EmployeeID || "",
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
                  {isSubmitting ? "Saving..." : currentUser ? "Update" : "Save"}
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
            Are you sure you want to delete the user{" "}
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
