import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function ModulesForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    Description: Yup.string().required('Name is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      Name: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <FormField
        label="Name"
        name="Description"
        type="text"
        value={formik.values.Description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.Description}
        touched={formik.touched.Description}
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
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default ModulesForm;
