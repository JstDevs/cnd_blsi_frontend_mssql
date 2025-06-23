import { Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function FiscalYearForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    Code: Yup.string().required('Code is required'),
    Name: Yup.string().required('Name is required'),
    Year: Yup.number()
      .required('Year is required')
      .min(2000, 'Year must be 2000 or later'),
    MonthStart: Yup.string().required('Month Start is required'),
    MonthEnd: Yup.string()
      .required('Month End is required')
  });

  const months = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  { value: 'March', label: 'March' },
  { value: 'April', label: 'April' },
  { value: 'May', label: 'May' },
  { value: 'June', label: 'June' },
  { value: 'July', label: 'July' },
  { value: 'August', label: 'August' },
  { value: 'September', label: 'September' },
  { value: 'October', label: 'October' },
  { value: 'November', label: 'November' },
  { value: 'December', label: 'December' },
];

  return (
    <Formik
      initialValues={initialData || { Code: '', Name: '', Year: new Date().getFullYear(), MonthStart: '', MonthEnd: '' }}
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
            label="Name"
            name="Name"
            type="text"
            value={values.Name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Name}
            touched={touched.Name}
            required
          />
          <FormField
            label="Year"
            name="Year"
            type="number"
            value={values.Year}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Year}
            touched={touched.Year}
            required
          />
          <FormField
            label="Month Start"
            name="MonthStart"
            type="select"
            value={values.MonthStart}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.MonthStart}
            touched={touched.MonthStart}
            options={months}
            required
          />
          <FormField
            label="Month End"
            name="MonthEnd"
            type="select"
            value={values.MonthEnd}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.MonthEnd}
            touched={touched.MonthEnd}
            options={months}
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

export default FiscalYearForm;
