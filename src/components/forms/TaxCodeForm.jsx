import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

// Mock data for Tax Type select
const mockTaxTypes = [
  { value: 'vat', label: 'VAT' },
  { value: 'ewt', label: 'EWT' },
  { value: 'other', label: 'Other' },
];

function TaxCodeForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    type: Yup.string().required('Type is required'),
    code: Yup.string().required('Code is required'),
    natureOfPayment: Yup.string().required('Nature of Payment is required'),
    rate: Yup.number()
      .required('Rate is required')
      .min(0, 'Rate cannot be negative')
      .max(1, 'Rate cannot exceed 1 (or 100%)'), // Assuming rate is stored as a decimal (e.g., 0.12 for 12%)
  });

  const formik = useFormik({
    initialValues: initialData || {
      type: '',
      code: '',
      natureOfPayment: '',
      rate: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <FormField
        label="Type"
        name="type"
        type="select"
        options={mockTaxTypes}
        formik={formik}
      />
      <FormField
        label="Code"
        name="code"
        type="text"
        formik={formik}
      />
      <FormField
        label="Nature of Payment"
        name="natureOfPayment"
        type="text"
        formik={formik}
      />
      <FormField
        label="Rate (%)"
        name="rate"
        type="number"
        formik={formik}
        step="0.01"
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

export default TaxCodeForm; 