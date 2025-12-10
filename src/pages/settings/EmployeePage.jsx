import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import {
  fetchEmployees,
  deleteEmployee,
} from '../../features/settings/employeeSlice';
import EmployeeForm from './EmployeeForm';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function EmployeePage() {
  const dispatch = useDispatch();
  const { employees, isLoading } = useSelector((state) => state.employees);
  // ---------------------USE MODULE PERMISSIONS------------------START (EmployeePage - MODULE ID = 43 )
  const { Add, Edit, Delete } = useModulePermissions(43);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (employeeToDelete) {
        dispatch(deleteEmployee(employeeToDelete.ID));
        setIsDeleteModalOpen(false);
        setEmployeeToDelete(null);
        toast.success('Employee deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete employee:', error);
      toast.error('Failed to delete employee. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee(null);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Table columns definition
  const columns = [
    {
      key: 'IDNumber',
      header: 'ID Number',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'FirstName',
      header: 'First Name',
      sortable: true,
    },
    {
      key: 'MiddleName',
      header: 'Middle Name',
      sortable: true,
    },
    {
      key: 'LastName',
      header: 'Last Name',
      sortable: true,
    },
    {
      key: 'Department',
      header: 'Department',
      sortable: true,
      render: (value) => value?.Name || '',
    },
    {
      key: 'Position',
      header: 'Position',
      sortable: true,
      render: (value) => value?.Name || '',
    },
    {
      key: 'EmploymentStatus',
      header: 'Employment Status',
      sortable: true,
      render: (value) => value?.Name || '',
    },
    // {
    //   key: 'PositionName',
    //   header: 'Position',
    //   sortable: true,
    // },
    // {
    //   key: 'EmploymentStatus',
    //   header: 'Employment Status',
    //   sortable: true,
    // },
    // {
    //   key: 'DateHired',
    //   header: 'Date Hired',
    //   sortable: true,
    //   render: (value) => formatDate(value),
    // },
    // {
    //   key: 'Active',
    //   header: 'Status',
    //   sortable: true,
    //   render: (value) => (
    //     <span
    //       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
    //         value === '1'
    //           ? 'bg-success-100 text-success-800'
    //           : 'bg-neutral-100 text-neutral-800'
    //       }`}
    //     >
    //       {value == '1' ? 'Active' : 'Inactive'}
    //     </span>
    //   ),
    // },
  ];

  // Actions for table rows
  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditEmployee,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteEmployee,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Employees</h1>
            <p>Manage employee information and records</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAddEmployee}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Employee
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={employees}
          actions={actions}
          loading={isLoading}
        />
      </div>

      {/* Employee Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={currentEmployee ? 'Edit Employee' : 'Add Employee'}
        size="lg"
      >
        <EmployeeForm
          initialData={currentEmployee}
          onClose={handleCloseModal}
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
            Are you sure you want to delete the employee{' '}
            <span className="font-medium">
              {employeeToDelete?.FirstName} {employeeToDelete?.LastName}
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

export default EmployeePage;
