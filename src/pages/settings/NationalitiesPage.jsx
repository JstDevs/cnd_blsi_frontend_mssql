import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus,
  PencilIcon,
  TrashIcon,
  Globe,
  FileText,
} from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import NationalitiesForm from '../../components/forms/NationalitiesForm';
import {
  fetchNationalities,
  addNationality,
  updateNationality,
  deleteNationality,
} from '../../features/settings/nationalitiesSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

function NationalitiesPage() {
  const dispatch = useDispatch();
  const { nationalities, isLoading } = useSelector(
    (state) => state.nationalities
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (NationalitiesPage - MODULE ID = 94 )
  const { Add, Edit, Delete } = useModulePermissions(94);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNationality, setCurrentNationality] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [nationalityToDelete, setNationalityToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchNationalities());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentNationality(null);
    setIsModalOpen(true);
  };

  const handleEdit = (nationality) => {
    setCurrentNationality(nationality);
    setIsModalOpen(true);
  };

  const handleDelete = (nationality) => {
    setNationalityToDelete(nationality);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (nationalityToDelete) {
      try {
        await dispatch(deleteNationality(nationalityToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setNationalityToDelete(null);
        toast.success('Nationality deleted successfully');
      } catch (error) {
        console.error('Failed to delete nationality:', error);
        toast.error('Failed to delete nationality. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentNationality) {
        await dispatch(
          updateNationality({ ...values, ID: currentNationality.ID })
        ).unwrap();
        toast.success('Nationality updated successfully');
      } else {
        await dispatch(addNationality(values)).unwrap();
        toast.success('Nationality saved successfully');
      }
      dispatch(fetchNationalities());
    } catch (error) {
      console.error('Failed to save nationality:', error);
      toast.error('Failed to save nationality. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const summaryStats = useMemo(() => {
    return {
      total: nationalities?.length || 0,
    };
  }, [nationalities]);

  const columns = [
    {
      key: 'Name',
      header: 'Nationality',
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
                <Globe className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Nationalities
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Manage nationality classifications
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
                Add Nationality
              </button>
            )}
          </div>
        </div>

        {/* Summary Statistics Cards */}
        {!isLoading && nationalities?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Total Nationalities</p>
                  <p className="text-2xl font-bold text-green-900">{summaryStats.total}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-lg">
                  <FileText className="h-6 w-6 text-green-700" />
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
            Nationality Records
            <span className="ml-2 text-sm font-normal text-neutral-600">
              ({nationalities?.length || 0} {(nationalities?.length || 0) === 1 ? 'nationality' : 'nationalities'})
            </span>
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={nationalities || []}
          actions={actions}
          loading={isLoading}
          pagination={true}
          emptyMessage="No nationalities found. Click 'Add Nationality' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentNationality ? 'Edit Nationality' : 'Add Nationality'}
      >
        <NationalitiesForm
          initialData={currentNationality}
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
            Are you sure you want to delete the nationality "
            {nationalityToDelete?.Name}"?
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

export default NationalitiesPage;
