import React, { useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import Select from 'react-select';

function StatementComparisonForm({
  fiscalYears = [],
  accLoading = false,
  onView,
  onGenerateJournal,
  onExportExcel,
}) {
  const submitAction = useRef(null);

  const validationSchema = Yup.object({
    fiscalYearID: Yup.string().required('Fiscal Year is required'),
  });

  const initialValues = {
    fiscalYearID: '',
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const action = submitAction.current;

    // if (action === 'view')           { onView(values) } 
    // else if (action === 'generate')  { onGenerateJournal(values) }
    // else if (action === 'export')    { onExportExcel(values) }

    switch (action) {
      case 'view':      onView(values);             break;
      case 'generate':  onGenerateJournal(values);  break;
      case 'export':    onExportExcel(values);      break;
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <FormField
              type="select"
              label="Fiscal Year"
              name="fiscalYearID"
              options={fiscalYears.map((item) => ({
                value: item.ID,
                label: item.Name,
              }))}
              value={values.fiscalYearID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fiscalYearID}
              touched={touched.fiscalYearID}
              defaultOption="  - - Select - -   "
              required
            />
          </div>

          {/* Row 3: Buttons */}
          <div className="flex justify-end gap-3 max-sm:flex-col pt-4 border-t border-neutral-200">
            <button
              type="submit"
              className="btn btn-secondary"
              disabled={isSubmitting}
              onClick={() => (submitAction.current = 'view')}
            >
              View
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              onClick={() => (submitAction.current = 'generate')}
            >
              Generate Journal
            </button>
            <button
              type="submit"
              className="btn btn-success"
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

export default StatementComparisonForm;
