import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import ProjectDetailsForm from '../../components/forms/ProjectDetailsForm';
import {
  fetchProjectDetails,
  addProjectDetail,
  updateProjectDetail,
  deleteProjectDetail,
} from '../../features/settings/projectDetailsSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';
function ProjectDetailsPage() {
  const dispatch = useDispatch();
  const { projectDetails, isLoading } = useSelector(
    (state) => state.projectDetails
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (Project Details Page  - MODULE ID = 65 )
  const { Add, Edit, Delete } = useModulePermissions(65);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchProjectDetails());
  }, [dispatch]);

  const handleAdd = () => {
    setCurrentProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setCurrentProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        await dispatch(deleteProjectDetail(projectToDelete.ID)).unwrap();
        setIsDeleteModalOpen(false);
        setProjectToDelete(null);
        toast.success('Project detail deleted successfully.');
      } catch (error) {
        console.error('Failed to delete project detail:', error);
        toast.error('Failed to delete project detail. Please try again.');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (currentProject) {
        await dispatch(
          updateProjectDetail({ ...values, ID: currentProject.ID })
        ).unwrap();
        toast.success('Project detail updated successfully.');
      } else {
        await dispatch(addProjectDetail(values)).unwrap();
        toast.success('Project detail added successfully.');
      }
      dispatch(fetchProjectDetails());
    } catch (error) {
      console.error('Failed to save project detail:', error);
      toast.error('Failed to save project detail. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      key: 'Title',
      header: 'Project Title',
      sortable: true,
    },
    {
      key: 'StartDate',
      header: 'Start Date',
      sortable: true,
      // Optional: Add render function to format date if needed
    },
    {
      key: 'EndDate',
      header: 'End Date',
      sortable: true,
      // Optional: Add render function to format date if needed
    },
    {
      key: 'ProjectTypeID',
      header: 'Project Type',
      sortable: true,
      render: (value, row) => {
        const projectType = row?.ProjectType?.Type;
        return <span>{projectType || value || 'N/A'}</span>;
      },
    },
    {
      key: 'Description',
      header: 'Description',
      sortable: false, // Description might be long, sorting might not be useful
    },
  ];

  const actions = [
    Edit && {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    Delete && {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between sm:items-center max-sm:flex-col gap-4">
          <div>
            <h1>Project Details</h1>
            <p>Manage project details</p>
          </div>
          {Add && (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary max-sm:w-full"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              Add Project Detail
            </button>
          )}
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={projectDetails}
          actions={actions}
          loading={isLoading}
          emptyMessage="No project details found. Click 'Add Project Detail' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProject ? 'Edit Project Detail' : 'Add Project Detail'}
        size="lg"
      >
        <ProjectDetailsForm
          initialData={currentProject}
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
            Are you sure you want to delete the project "
            {projectToDelete?.Title}"?
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

export default ProjectDetailsPage;
