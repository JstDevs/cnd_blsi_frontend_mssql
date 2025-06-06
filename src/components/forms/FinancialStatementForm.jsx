import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function FinancialStatementForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    code: Yup.string().required('Code is required'),
    name: Yup.string().required('Name is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      code: '',
      name: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <FormField
        label="Code"
        name="code"
        type="text"
        formik={formik}
      />
      <FormField
        label="Name"
        name="name"
        type="text"
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

export default FinancialStatementForm; 