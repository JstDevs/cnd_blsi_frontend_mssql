import { Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function ProjectTypeForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    Type: Yup.string().required('Type is required'),
    Description: Yup.string().required('Description is required'),
  });

  return (
    <Formik
      initialValues={initialData || { Type: '', Description: '' }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
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
            label="Type"
            name="Type"
            type="text"
            value={values.Type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Type}
            touched={touched.Type}
            required
          />
          <FormField
            label="Description"
            name="Description"
            type="textarea"
            value={values.Description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Description}
            touched={touched.Description}
            required
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
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
}

export default ProjectTypeForm;
