import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectTypes } from '../../features/settings/projectTypesSlice'; // adjust path if needed

function ProjectDetailsForm({ initialData, onSubmit, onClose }) {
  const dispatch = useDispatch();
  const { projectTypes, loading } = useSelector((state) => state.projectTypes);
  useEffect(() => {
    dispatch(fetchProjectTypes());
  }, [dispatch]);

  const validationSchema = Yup.object({
    Title: Yup.string().required('Title is required'),
    ProjectTypeID: Yup.string().required('Project Type is required'),
    StartDate: Yup.date().required('Start Date is required'),
    EndDate: Yup.date().required('End Date is required'),
    Description: Yup.string().required('Description is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      Title: '',
      ProjectTypeID: '',
      StartDate: '',
      EndDate: '',
      Description: '',
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
        name="Title"
        type="text"
        value={formik.values.Title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.Title}
        touched={formik.touched.Title}
        required
      />

      <FormField
        label="Project Type"
        name="ProjectTypeID"
        type="select"
        options={projectTypes.map((type) => ({
          label: type.Type,
          value: type.ID,
        }))}
        value={formik.values.ProjectTypeID}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.ProjectTypeID}
        touched={formik.touched.ProjectTypeID}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Start Date"
          name="StartDate"
          type="date"
          value={formik.values.StartDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.StartDate}
          touched={formik.touched.StartDate}
          required
        />

        <FormField
          label="End Date"
          name="EndDate"
          type="date"
          value={formik.values.EndDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.EndDate}
          touched={formik.touched.EndDate}
          required
        />
      </div>

      <FormField
        label="Description"
        name="Description"
        type="textarea"
        rows={3}
        value={formik.values.Description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.Description}
        touched={formik.touched.Description}
        required
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onClose} className="btn btn-outline">
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
