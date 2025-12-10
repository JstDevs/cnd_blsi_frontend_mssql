import React, { useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import Select from 'react-select';

function FinancialStatementsForm({ onView, onGenerateJournal, onExportExcel }) {
  const submitAction = useRef(null);

  const validationSchema = Yup.object({
    year: Yup.string().required('Year is required'),
  });

  const initialValues = {
    year: new Date().getFullYear() - 1, // Default to last year
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const action = submitAction.current;

    if (action === 'view') {
      onView(values);
    } else if (action === 'generate') {
      onGenerateJournal(values);
    } else if (action === 'export') {
      onExportExcel(values);
    }

    setSubmitting(false);
    submitAction.current = null; // clear after use
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnMount={true}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
        setFieldValue,
      }) => (
        <Form className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <FormField
              label="Year"
              name="year"
              type="number"
              value={values.year}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.year}
              touched={touched.year}
              required
            />
          </div>

          {/* Row 3: Buttons */}
          <div className="flex justify-end pt-4 border-t border-neutral-200 max-sm:flex-col  gap-4">
            <button
              type="submit"
              className="btn btn-primary "
              disabled={isSubmitting}
              onClick={() => (submitAction.current = 'view')}
            >
              View
            </button>
            <button
              type="button"
              className="btn btn-secondary text-center"
              disabled={isSubmitting}
              // onClick={() => (submitAction.current = 'generate')}
            >
              Generate FSP
            </button>
            <button
              type="submit"
              className="btn btn-outline"
              disabled={isSubmitting}
              onClick={() => (submitAction.current = 'export')}
            >
              Export to Excel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default FinancialStatementsForm;
