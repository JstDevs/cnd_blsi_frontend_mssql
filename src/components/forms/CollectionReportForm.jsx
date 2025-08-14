import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

const COLLECTION_REPORT_SCHEMA = Yup.object().shape({
  date: Yup.date()
    .required('Date is required'),
});

function CollectionReportForm({ onSubmit }) {
  const initialValues = {
    date: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={COLLECTION_REPORT_SCHEMA}
      onSubmit={onSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form className="space-y-4">
          <FormField
            label="Date"
            name="date"
            type="date"
            required
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.date}
            touched={touched.date}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => onSubmit({ ...values, action: 'view' })}
              className="btn btn-primary"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => onSubmit({ ...values, action: 'generate' })}
              className="btn btn-secondary"
            >
              Generate Journal
            </button>
            <button
              type="button"
              onClick={() => onSubmit({ ...values, action: 'export' })}
              className="btn btn-outline"
            >
              Export to Excel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CollectionReportForm; 