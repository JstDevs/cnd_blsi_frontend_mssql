import { Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

// Mock data for Tax Type select
const mockTaxTypes = [
  { value: 'Individual', label: 'Individual' },
  { value: 'Corporate', label: 'Corporate' },
];

function TaxCodeForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    Type: Yup.string().required('Type is required'),
    Code: Yup.string().required('Code is required'),
    Name: Yup.string().required('Nature of Payment is required'),
    Rate: Yup.number()
      .required('Rate is required')
      .min(0, 'Rate cannot be negative')
      .max(100, 'Rate cannot exceed 100%'),
  });

  return (
    <Formik
      initialValues={initialData || {
        Type: '',
        Code: '',
        Name: '',
        Rate: 0,
      }}
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
            type="select"
            options={mockTaxTypes}
            value={values.Type}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Type}
            touched={touched.Type}
            required
          />
          <FormField
            label="Code"
            name="Code"
            type="text"
            value={values.Code}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Code}
            touched={touched.Code}
            required
          />
          <FormField
            label="Rate (%)"
            name="Rate"
            type="number"
            step="0.01"
            value={values.Rate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Rate}
            touched={touched.Rate}
            required
          />
          <FormField
            label="Nature of Payment"
            name="Name"
            type="textarea"
            value={values.Name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Name}
            touched={touched.Name}
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

export default TaxCodeForm;
