import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function FiscalYearForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    startDate: Yup.date().required('Start Date is required'),
    endDate: Yup.date()
      .required('End Date is required')
      .min(Yup.ref('startDate'), 'End Date must be after Start Date'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      startDate: '',
      endDate: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
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

export default FiscalYearForm; 