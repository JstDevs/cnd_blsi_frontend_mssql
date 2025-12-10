import React, { useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

function GeneralJournalForm({
  funds = [],
  onView,
  onGenerateJournal,
  onExportExcel,
}) {
  const submitAction = useRef(null); // ✅ to track which button was clicked

  const validationSchema = Yup.object({
    DateStart: Yup.string().required('Start Date is required'),
    DateEnd: Yup.string().required('End Date is required'),
    FundID: Yup.string().required('Fund is required'),
  });

  const initialValues = {
    DateStart: '',
    DateEnd: '',
    FundID: '',
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
      }) => (
        <Form className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 sm:gap-4">
            <FormField
              label="Start Date"
              name="DateStart"
              type="date"
              value={values.DateStart}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.DateStart}
              touched={touched.DateStart}
              required
            />
            <FormField
              label="End Date"
              name="DateEnd"
              type="date"
              value={values.DateEnd}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.DateEnd}
              touched={touched.DateEnd}
              required
            />
            <FormField
              type="select"
              label="Fund"
              name="FundID"
              options={funds.map((item) => ({
                value: item.ID,
                label: item.Name,
              }))}
              value={values.FundID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.FundID}
              touched={touched.FundID}
              required
            />
          </div>

          {/* Row 3: Buttons */}
          <div className="flex justify-end max-sm:flex-col gap-3 pt-4 border-t border-neutral-200">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              onClick={() => (submitAction.current = 'view')}
            >
              View
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isSubmitting}
              // onClick={() => (submitAction.current = 'generate')}
            >
              Generate Journal
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

export default GeneralJournalForm;
