import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function UserrolesForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    Description: Yup.string().required('User Role is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
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
        label="Role"
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

export default UserrolesForm;
