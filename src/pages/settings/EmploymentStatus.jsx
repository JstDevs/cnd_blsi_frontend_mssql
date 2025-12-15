import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus,
  PencilIcon,
  TrashIcon,
  UserCheck,
  FileText,
} from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import EmploymentStatusForm from '../../components/forms/EmploymentStatusForm';
import {
  fetchEmploymentStatuses,
  addEmploymentStatus,
  updateEmploymentStatus,
  deleteEmploymentStatus,
} from '../../features/settings/employmentStatusSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function EmploymentStatus() {
  const dispatch = useDispatch();
  const { employmentStatuses, isLoading } = useSelector(
    (state) => state.employmentStatuses
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (EmploymentStatus Page - MODULE ID = 93 )
  const { Add, Edit, Delete } = useModulePermissions(93);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmploymentStatus, setCurrentEmploymentStatus] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employmentStatusToDelete, setEmploymentStatusToDelete] =
    useState(null);

  useEffect(() => {
    dispatch(fetchEmploymentStatuses());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentEmploymentStatus(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employmentStatus) => {
    setCurrentEmploymentStatus(employmentStatus);
    setIsModalOpen(true);
  };

  const handleDelete = (employmentStatus) => {
    setEmploymentStatusToDelete(employmentStatus);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (employmentStatusToDelete) {
      try {
        await dispatch(
          deleteEmploymentStatus(employmentStatusToDelete.ID)
        ).unwrap();
        setIsDeleteModalOpen(false);
        setEmploymentStatusToDelete(null);
        toast.success('Employment status deleted successfully');
      } catch (error) {
        console.error('Failed to delete employment status:', error);
        toast.error('Failed to delete employment status. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentEmploymentStatus) {
        await dispatch(
          updateEmploymentStatus({ ...values, ID: currentEmploymentStatus.ID })
        ).unwrap();
        toast.success('Employment status updated successfully');
      } else {
        await dispatch(addEmploymentStatus(values)).unwrap();
        toast.success('Employment status saved successfully');
      }
      dispatch(fetchEmploymentStatuses());
    } catch (error) {
      console.error('Failed to save employment status:', error);
      toast.error('Failed to save employment status. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const summaryStats = useMemo(() => {
    return {
      total: employmentStatuses?.length || 0,
    };
  }, [employmentStatuses]);

  const columns = [
    {
      key: 'Name',
      header: 'Employment Status',
      sortable: true,
      className: 'text-neutral-900 font-medium',
      render: (value) => (
        <span className="text-neutral-900 font-medium">{value || '—'}</span>
      ),
    },
  ];

  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-sm hover:shadow',
      disabled: false,
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
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
                <UserCheck className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Employment Status
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Manage employment status types and classifications
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {Add && (
              <button
                type="button"
                onClick={handleAdd}
                className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <Plus className="h-5 w-5" />
                Add Employment Status
              </button>
            )}
          </div>
        </div>

        {/* Summary Statistics Cards */}
        {!isLoading && employmentStatuses?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Statuses</p>
                  <p className="text-2xl font-bold text-blue-900">{summaryStats.total}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-700" />
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
            Employment Statuses
            <span className="ml-2 text-sm font-normal text-neutral-600">
              ({employmentStatuses?.length || 0} {(employmentStatuses?.length || 0) === 1 ? 'status' : 'statuses'})
            </span>
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={employmentStatuses || []}
          actions={actions}
          loading={isLoading}
          pagination={true}
          emptyMessage="No employment statuses found. Click 'Add Employment Status' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          currentEmploymentStatus
            ? 'Edit Employment Status'
            : 'Add Employment Status'
        }
      >
        <EmploymentStatusForm
          initialData={currentEmploymentStatus}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
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
            Are you sure you want to delete the employment status "
            {employmentStatusToDelete?.Name}"?
          </p>
          <p className="text-sm text-neutral-500 mt-2">
            This action cannot be undone.
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

export default EmploymentStatus;
