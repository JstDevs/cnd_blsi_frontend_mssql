import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus,
  PencilIcon,
  TrashIcon,
  Briefcase,
  FileText,
} from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import PositionForm from '../../components/forms/PositionForm';
import {
  fetchPositions,
  addPosition,
  updatePosition,
  deletePosition,
} from '../../features/settings/positionSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function PositionPage() {
  const dispatch = useDispatch();
  const { positions, isLoading } = useSelector((state) => state.positions);
  // ---------------------USE MODULE PERMISSIONS------------------START (PositionPage - MODULE ID = 36 )
  const { Add, Edit, Delete } = useModulePermissions(36);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchPositions());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentPosition(null);
    setIsModalOpen(true);
  };

  const handleEdit = (position) => {
    setCurrentPosition(position);
    setIsModalOpen(true);
  };

  const handleDelete = (position) => {
    setPositionToDelete(position);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (positionToDelete) {
      try {
        await dispatch(deletePosition(positionToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setPositionToDelete(null);
        toast.success('Position deleted successfully');
      } catch (error) {
        console.error('Failed to delete position:', error);
        toast.error('Failed to delete position. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentPosition) {
        await dispatch(
          updatePosition({ ...values, ID: currentPosition.ID })
        ).unwrap();
        toast.success('Position updated successfully');
      } else {
        await dispatch(addPosition(values)).unwrap();
        toast.success('Position saved successfully');
      }
      dispatch(fetchPositions());
    } catch (error) {
      console.error('Failed to save position:', error);
      toast.error('Failed to save position. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const summaryStats = useMemo(() => {
    return {
      total: positions?.length || 0,
    };
  }, [positions]);

  const columns = [
    {
      key: 'Name',
      header: 'Position',
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
                <Briefcase className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Positions
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Manage job positions and titles
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
                Add Position
              </button>
            )}
          </div>
        </div>

        {/* Summary Statistics Cards */}
        {!isLoading && positions?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-1">Total Positions</p>
                  <p className="text-2xl font-bold text-purple-900">{summaryStats.total}</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-700" />
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
            Position Records
            <span className="ml-2 text-sm font-normal text-neutral-600">
              ({positions?.length || 0} {(positions?.length || 0) === 1 ? 'position' : 'positions'})
            </span>
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={positions || []}
          actions={actions}
          loading={isLoading}
          pagination={true}
          emptyMessage="No positions found. Click 'Add Position' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPosition ? 'Edit Position' : 'Add Position'}
      >
        <PositionForm
          initialData={currentPosition}
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
            Are you sure you want to delete the position "
            {positionToDelete?.Name}"?
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

export default PositionPage;
