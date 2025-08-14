import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ProjectTypeForm from '../../components/forms/ProjectTypeForm';
import {
  fetchProjectTypes,
  addProjectType,
  updateProjectType,
  deleteProjectType
} from '../../features/settings/projectTypesSlice';

function ProjectTypePage() {
  const dispatch = useDispatch();
  const { projectTypes, isLoading } = useSelector(state => state.projectTypes);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProjectType, setCurrentProjectType] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectTypeToDelete, setProjectTypeToDelete] = useState(null);
  
  useEffect(() => {
    dispatch(fetchProjectTypes());
  }, [dispatch]);
  
  const handleAdd = () => {
    setCurrentProjectType(null);
    setIsModalOpen(true);
  };
  
  const handleEdit = (projectType) => {
    setCurrentProjectType(projectType);
    setIsModalOpen(true);
  };
  
  const handleDelete = (projectType) => {
    setProjectTypeToDelete(projectType);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (projectTypeToDelete) {
      try {
        await dispatch(deleteProjectType(projectTypeToDelete.id)).unwrap();
        setIsDeleteModalOpen(false);
        setProjectTypeToDelete(null);
      } catch (error) {
        console.error('Failed to delete project type:', error);
      }
    }
  };
  
  const handleSubmit = (values) => {
    if (currentProjectType) {
      dispatch(updateProjectType({ ...values, id: currentProjectType.id }));
    } else {
      dispatch(addProjectType(values));
    }
    setIsModalOpen(false);
  };

  const columns = [
    {
      key: 'code',
      header: 'Code',
      sortable: true
    },
    {
      key: 'name',
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
            <h1>Project Types</h1>
            <p>Manage project types</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Project Type
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={projectTypes}
          actions={actions}
          loading={isLoading}
          emptyMessage="No project types found. Click 'Add Project Type' to create one."
        />
      </div>
      
      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProjectType ? "Edit Project Type" : "Add Project Type"}
      >
        <ProjectTypeForm
          initialData={currentProjectType}
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
            Are you sure you want to delete the project type "{projectTypeToDelete?.name}"?
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

export default ProjectTypePage; 