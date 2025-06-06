import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import DatePickerField from '../common/DatePickerField';

// Mock options for fund select
const fundOptions = [
  { value: 'all', label: 'All Funds' },
  { value: 'general', label: 'General Fund' },
  { value: 'special', label: 'Special Education Fund' },
  { value: 'trust', label: 'Trust Fund' },
  { value: 'development', label: 'Development Fund' },
];

// Validation schema using Yup
const validationSchema = Yup.object({
  fromDate: Yup.date().required('From Date is required'),
  toDate: Yup.date().required('To Date is required').min(
    Yup.ref('fromDate'),
    'To Date cannot be before From Date'
  ),
  fund: Yup.string().required('Fund is required'),
});

function GeneralJournalForm({ initialData, onSubmit, onExport, onClose }) {
  const handleSubmit = (values) => {
    onSubmit(values);
  };

  const handleExport = (values) => {
    onExport(values);
  };

  return (
    <Formik
      initialValues={initialData || { 
        fromDate: '', 
        toDate: '', 
        fund: '', 
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePickerField name="fromDate" label="From Date" required />
            <DatePickerField name="toDate" label="To Date" required />
          </div>
          
          <FormField
            name="fund"
            label="Fund"
            as="select"
            options={fundOptions}
            required
          />

          <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={() => handleExport(values)}
              className="btn btn-success"
              disabled={isSubmitting}
            >
              Export to Excel
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Generate
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Loading...' : 'View'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default GeneralJournalForm; 