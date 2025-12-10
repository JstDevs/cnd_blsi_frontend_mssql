import { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '@/components/common/Modal';
import FormField from '@/components/common/FormField';
import DataTable from '@/components/common/DataTable';

const sampleProjects = [
  {
    title: 'Project A',
    type: 'Type A',
    description: 'This is Project A.',
    startDate: '2024-08-30',
    endDate: '2024-12-25',
  },
  {
    title: 'Project B',
    type: 'Type B',
    description: 'This is Project B.',
    startDate: '2024-08-30',
    endDate: '2024-12-31',
  },
];

function ProjectDetails() {
  const [projects, setProjects] = useState(sampleProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleAdd = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (projectToDelete) => {
    setProjects((prev) =>
      prev.filter((p) => p.title !== projectToDelete.title)
    );
  };

  const handleFormSubmit = (values, { setSubmitting }) => {
    if (selectedProject) {
      setProjects((prev) =>
        prev.map((p) => (p.title === selectedProject.title ? values : p))
      );
    } else {
      setProjects((prev) => [...prev, values]);
    }
    setSubmitting(false);
    setIsModalOpen(false);
  };

  const columns = [
    { key: 'title', header: 'Title', sortable: true },
    { key: 'type', header: 'Type', sortable: true },
    { key: 'description', header: 'Description' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
  ];

  const actions = [
    {
      icon: PencilIcon,
      title: 'Edit',
      onClick: handleEdit,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    },
    {
      icon: TrashIcon,
      title: 'Delete',
      onClick: handleDelete,
      className:
        'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
    },
  ];

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    type: Yup.string().required('Type is required'),
    description: Yup.string().required('Description is required'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End date is required'),
  });

  return (
    <div>
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>Projects</h1>
            <p>Manage project details</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
            Add Project
          </button>
        </div>
      </div>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={projects}
          actions={actions}
          emptyMessage="No projects found. Click 'Add Project' to create one."
        />
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProject ? 'Edit Project' : 'Add Project'}
      >
        <Formik
          enableReinitialize
          initialValues={{
            title: selectedProject?.title || '',
            type: selectedProject?.type || '',
            description: selectedProject?.description || '',
            startDate: selectedProject?.startDate || '',
            endDate: selectedProject?.endDate || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Project Title"
                name="title"
                type="text"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.title}
                touched={touched.title}
                required
              />

              <FormField
                label="Project Type"
                name="type"
                type="select"
                options={[
                  { label: 'Type A', value: 'Type A' },
                  { label: 'Type B', value: 'Type B' },
                ]}
                value={values.type}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.type}
                touched={touched.type}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={values.startDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.startDate}
                  touched={touched.startDate}
                  required
                />

                <FormField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={values.endDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.endDate}
                  touched={touched.endDate}
                  required
                />
              </div>

              <FormField
                label="Description"
                name="description"
                type="textarea"
                rows={3}
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.description}
                touched={touched.description}
                required
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
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {selectedProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

export default ProjectDetails;
