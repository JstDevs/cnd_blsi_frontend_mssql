import { Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function FinancialStatementForm({ initialData, onSubmit, onClose }) {
  const validationSchema = Yup.object({
    Code: Yup.string().required('Code is required'),
    Name: Yup.string().required('Name is required'),
  });

  return (
    <Formik
      initialValues={initialData || { Code: '', Name: '' }}
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

export default FinancialStatementForm;
