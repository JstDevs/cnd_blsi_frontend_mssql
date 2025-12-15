import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus,
  PencilIcon,
  TrashIcon,
  Users,
  FileText,
  Building,
  Briefcase,
} from 'lucide-react';
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

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const total = employees?.length || 0;
    const departments = new Set(employees?.map((emp) => emp.Department?.Name).filter(Boolean)).size;
    const positions = new Set(employees?.map((emp) => emp.Position?.Name).filter(Boolean)).size;
    
    return {
      total,
      departments,
      positions,
    };
  }, [employees]);

  // Table columns definition
  const columns = [
    {
      key: 'IDNumber',
      header: 'ID Number',
      sortable: true,
      className: 'text-neutral-900 font-medium',
      render: (value) => (
        <span className="text-neutral-900 font-medium">{value || '—'}</span>
      ),
    },
    {
      key: 'FirstName',
      header: 'First Name',
      sortable: true,
      render: (value) => <span className="text-neutral-700">{value || '—'}</span>,
    },
    {
      key: 'MiddleName',
      header: 'Middle Name',
      sortable: true,
      render: (value) => <span className="text-neutral-600">{value || '—'}</span>,
    },
    {
      key: 'LastName',
      header: 'Last Name',
      sortable: true,
      render: (value) => <span className="text-neutral-700 font-medium">{value || '—'}</span>,
    },
    {
      key: 'Department',
      header: 'Department',
      sortable: true,
      render: (value) => (
        <span className="text-neutral-700">{value?.Name || '—'}</span>
      ),
    },
    {
      key: 'Position',
      header: 'Position',
      sortable: true,
      render: (value) => (
        <span className="text-neutral-700">{value?.Name || '—'}</span>
      ),
    },
    {
      key: 'EmploymentStatus',
      header: 'Employment Status',
      sortable: true,
      render: (value) => {
        const status = value?.Name;
        if (!status) return <span className="text-neutral-400">—</span>;
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {status}
          </span>
        );
      },
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
        'text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-sm hover:shadow',
      disabled: false,
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDeleteEmployee,
      className:
        'text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow',
      disabled: false,
    },
  ].filter(Boolean);

  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Employees
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Manage employee information and records
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {Add && (
              <button
                type="button"
                onClick={handleAddEmployee}
                className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <Plus className="h-5 w-5" />
                Add Employee
              </button>
            )}
          </div>
        </div>

        {/* Summary Statistics Cards */}
        {!isLoading && employees?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Employees</p>
                  <p className="text-2xl font-bold text-blue-900">{summaryStats.total}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <Users className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Departments</p>
                  <p className="text-2xl font-bold text-green-900">{summaryStats.departments}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-lg">
                  <Building className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Positions</p>
                  <p className="text-2xl font-bold text-purple-900">{summaryStats.positions}</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-lg">
                  <Briefcase className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="text-lg font-semibold text-neutral-900">
            Employee Records
            <span className="ml-2 text-sm font-normal text-neutral-600">
              ({employees?.length || 0} {(employees?.length || 0) === 1 ? 'employee' : 'employees'})
            </span>
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={employees || []}
          actions={actions}
          loading={isLoading}
          pagination={true}
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
