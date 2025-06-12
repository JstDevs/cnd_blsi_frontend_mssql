import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { fetchEmployees } from '../../features/settings/employeeSlice';
import EmployeeForm from './EmployeeForm';

function EmployeePage() {
  const dispatch = useDispatch();
  const { employees, isLoading } = useSelector(state => state.employees);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  
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
      key: 'employeeCode',
      header: 'Code',
      sortable: true,
      className: 'font-medium text-neutral-900',
    },
    {
      key: 'lastName',
      header: 'Last Name',
      sortable: true,
    },
    {
      key: 'firstName',
      header: 'First Name',
      sortable: true,
    },
    {
      key: 'departmentName',
      header: 'Department',
      sortable: true,
    },
    {
      key: 'position',
      header: 'Position',
      sortable: true,
    },
    {
      key: 'employmentStatus',
      header: 'Employment Status',
      sortable: true,
    },
    {
      key: 'dateHired',
      header: 'Date Hired',
      sortable: true,
      render: (value) => formatDate(value),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'Active' ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'
        }`}>
          {value}
        </span>
      ),
    },
  ];
  
  // Actions for table rows
  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEditEmployee,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Employees</h1>
            <p>Manage employee information and records</p>
          </div>
          <button
            type="button"
            onClick={handleAddEmployee}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Employee
          </button>
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
        title={currentEmployee ? "Edit Employee" : "Add Employee"}
        size="lg"
      >
        <EmployeeForm 
          initialData={currentEmployee} 
          onClose={handleCloseModal} 
        />
      </Modal>
    </div>
  );
}

export default EmployeePage;