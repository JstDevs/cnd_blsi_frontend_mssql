import React, { useRef } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import Select from 'react-select';

function TrialBalanceForm({
  funds = [],
  employees = [],
  accLoading = false,
  onView,
  onGenerateJournal,
  onExportExcel,
}) {
  const submitAction = useRef(null);

  const validationSchema = Yup.object({
    endDate: Yup.string().required('Date End is required'),
    fundID: Yup.string().required('Fund is required'),
    approverID: Yup.string().required('Approver is required'),
    ledger: Yup.string().required('Ledger is required'),
  });

  const initialValues = {
    endDate: '',
    fundID: '',
    approverID: '',
    ledger: '',
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <FormField
              label="Date End"
              name="endDate"
              type="date"
              value={values.endDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.endDate}
              touched={touched.endDate}
              required
            />
            <FormField
              type="select"
              label="Fund"
              name="fundID"
              options={funds.map((item) => ({
                value: item.ID,
                label: item.Name,
              }))}
              value={values.fundID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fundID}
              touched={touched.fundID}
              required
            />
            <FormField
              label="Ledger"
              name="ledger"
              type="select"
              value={values.ledger}
              onChange={handleChange}
              onBlur={handleBlur}
              options={[
                { value: 'General Ledger', label: 'General Ledger' },
                { value: 'Subsidiary Ledger', label: 'Subsidiary Ledger' },
              ]}
              error={errors.ledger}
              touched={touched.ledger}
              required
            />
            <FormField
              label="Approver"
              name="approverID"
              type="select"
              options={employees.map((item) => ({
                value: item.ID,
                label:
                  item.FirstName +
                  ' ' +
                  item.MiddleName +
                  ' ' +
                  item.LastName +
                  ' - ' +
                  item?.Department?.Name,
              }))}
              value={values.approverID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.approverID}
              touched={touched.approverID}
              required
            />
          </div>

          {/* Row 3: Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 max-sm:flex-col">
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
              Generate Cashbook
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

export default TrialBalanceForm;
