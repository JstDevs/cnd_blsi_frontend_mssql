import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import DatePickerField from '../common/DatePickerField';

// Mock options for select menus
const chartOfAccountsOptions = [
  { value: 'all', label: 'All Accounts' },
  { value: 'account1', label: 'Account 1' },
  { value: 'account2', label: 'Account 2' },
];

const fundOptions = [
  { value: 'all', label: 'All Funds' },
  { value: 'fund1', label: 'Fund 1' },
  { value: 'fund2', label: 'Fund 2' },
];

const disbursementTypeOptions = [
  { value: 'check', label: 'Check' },
  { value: 'collection', label: 'Collection' },
  { value: 'cash', label: 'Cash' },
  { value: 'general', label: 'General' },
];

// Validation schema using Yup
const validationSchema = Yup.object({
  fromDate: Yup.date().required('From Date is required'),
  toDate: Yup.date().required('To Date is required').min(
    Yup.ref('fromDate'),
    'To Date cannot be before From Date'
  ),
  chartOfAccounts: Yup.string().required('Chart of Accounts is required'),
  chartOfAccounts2: Yup.string().required('Chart of Accounts is required'),
  fund: Yup.string().required('Fund is required'),
  disbursementType: Yup.string().required('Disbursement Type is required'),
});

function DisbursementJournalForm({ initialData, onSubmit, onExport, onClose }) {
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
        chartOfAccounts: '', 
        chartOfAccounts2: '', 
        fund: '', 
        disbursementType: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePickerField name="fromDate" label="Date Range From" required />
            <DatePickerField name="toDate" label="Date Range To" required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="chartOfAccounts"
              label="Chart of Accounts"
              as="select"
              options={chartOfAccountsOptions}
              required
            />

            <FormField
              name="chartOfAccounts2"
              label="Chart of Accounts (Second Select)"
              as="select"
              options={chartOfAccountsOptions}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="fund"
              label="Fund"
              as="select"
              options={fundOptions}
              required
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Disbursement Type <span className="text-error-500">*</span></label>
              <div className="flex items-center space-x-4">
                {disbursementTypeOptions.map((option) => (
                  <label key={option.value} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="disbursementType"
                      value={option.value}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300"
                    />
                    <span className="ml-2 text-sm text-neutral-600">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

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

export default DisbursementJournalForm; 