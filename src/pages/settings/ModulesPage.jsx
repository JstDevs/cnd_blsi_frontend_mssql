import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ModulesForm from '../../components/forms/ModulesForm';
import {
  fetchModules,
  addModule,
  updateModule,
  deleteModule
} from '../../features/settings/modulesSlice';

function ModulesPage() {
  const dispatch = useDispatch();
  const { modules, isLoading } = useSelector(state => state.modules);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchModules());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentModule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (module) => {
    setCurrentModule(module);
    setIsModalOpen(true);
  };

  const handleDelete = (module) => {
    setModuleToDelete(module);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (moduleToDelete) {
      try {
        await dispatch(deleteModule(moduleToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setModuleToDelete(null);
      } catch (error) {
        console.error('Failed to delete module:', error);
      }
    }
  };

  const handleSubmit = (values) => {
    if (currentModule) {
      dispatch(updateModule({ ...values, ID: currentModule.ID }));
    } else {
      dispatch(addModule(values));
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'Description',
      header: 'Name',
      sortable: true
    }
  ];

  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className: 'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50'
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className: 'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50'
    }
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Modules</h1>
            <p>Manage Modules</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Module
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={modules}
          actions={actions}
          loading={isLoading}
          emptyMessage="No modules found. Click 'Add Module' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentModule ? "Edit Module" : "Add Module"}
      >
        <ModulesForm
          initialData={currentModule}
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
            Are you sure you want to delete the module "{moduleToDelete?.name}"?
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

export default ModulesPage;