import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function BudgetDetailsForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    code: Yup.string().required('Code is required'),
    name: Yup.string().required('Name is required'),
    year: Yup.string().required('Year is required'),
    amount: Yup.number()
      .required('Amount is required')
      .min(0, 'Amount must be positive')
  });

  const formik = useFormik({
    initialValues: initialData || {
      code: '',
      name: '',
      year: new Date().getFullYear().toString(),
      amount: ''
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
      <FormField
        label="Year"
        name="year"
        type="text"
        formik={formik}
      />
      <FormField
        label="Amount"
        name="amount"
        type="number"
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

export default BudgetDetailsForm; 