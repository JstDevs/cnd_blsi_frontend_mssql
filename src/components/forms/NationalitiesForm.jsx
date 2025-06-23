import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function NationalitiesForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    Name: Yup.string().required('Nationality is required'),
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
        label="Nationality Name"
        name="Name"
        type="text"
        value={formik.values.Name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.Name}
        touched={formik.touched.Name}
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

export default NationalitiesForm;
