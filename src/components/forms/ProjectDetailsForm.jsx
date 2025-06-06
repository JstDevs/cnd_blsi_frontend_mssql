import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useSelector } from 'react-redux';

function ProjectDetailsForm({ initialData, onSubmit, onClose }) {
  const { projectTypes } = useSelector(state => state.projectDetails);

  const validationSchema = Yup.object({
    projectTitle: Yup.string().required('Project Title is required'),
    startDate: Yup.date().required('Start Date is required'),
    endDate: Yup.date()
      .required('End Date is required')
      .min(Yup.ref('startDate'), 'End Date must be after Start Date'),
    projectType: Yup.string().required('Project Type is required'),
    description: Yup.string().required('Description is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      projectTitle: '',
      startDate: '',
      endDate: '',
      projectType: '',
      description: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <FormField
        label="Project Title"
        name="projectTitle"
        type="text"
        formik={formik}
      />
      <FormField
        label="Start Date"
        name="startDate"
        type="date"
        formik={formik}
      />
      <FormField
        label="End Date"
        name="endDate"
        type="date"
        formik={formik}
      />
      <FormField
        label="Project Type"
        name="projectType"
        type="select"
        options={projectTypes}
        formik={formik}
      />
      <FormField
        label="Description"
        name="description"
        type="textarea"
        formik={formik}
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default ProjectDetailsForm; 