import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useState } from 'react';

const COLLECTION_REPORT_SCHEMA = Yup.object().shape({
  reportType: Yup.string().required('Report type is required'),
  // Dynamic validation based on report type
  date: Yup.date().when('reportType', {
    is: 'daily',
    then: Yup.date().required('Date is required'),
  }),
  month: Yup.number().when('reportType', {
    is: 'monthly',
    then: Yup.number().required('Month is required').min(1).max(12),
  }),
  year: Yup.number().when('reportType', {
    is: (val) => ['monthly', 'quarterly'].includes(val),
    then: Yup.number().required('Year is required').min(2000).max(2100),
  }),
  quarter: Yup.number().when('reportType', {
    is: 'quarterly',
    then: Yup.number().required('Quarter is required').min(1).max(4),
  }),
  fromDate: Yup.date().when('reportType', {
    is: 'flexible',
    then: Yup.date().required('From date is required'),
  }),
  toDate: Yup.date().when('reportType', {
    is: 'flexible',
    then: Yup.date()
      .required('To date is required')
      .min(Yup.ref('fromDate'), 'To date must be after from date'),
  }),
  notedBy: Yup.string().when('reportType', {
    is: 'flexible',
    then: Yup.string().required('Noted by is required'),
  }),
});

function CollectionReportForm({ onSubmit }) {
  const [activeReportType, setActiveReportType] = useState('daily');

  const initialValues = {
    reportType: 'daily',
    date: '',
    month: '',
    year: new Date().getFullYear(),
    quarter: '',
    fromDate: '',
    toDate: '',
    notedBy: '',
    documentTypes: {
      communityTax: false,
      marriageCert: false,
      burialCert: false,
      generalService: false,
      propertyTax: false,
      marketTicketing: false,
    },
  };

  const reportTypes = [
    { value: 'daily', label: 'Daily Report' },
    { value: 'monthly', label: 'Monthly Report' },
    { value: 'quarterly', label: 'Quarterly Report' },
    { value: 'flexible', label: 'Flexible Report' },
  ];

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const quarters = [
    { value: 1, label: 'Q1 (Jan - Mar)' },
    { value: 2, label: 'Q2 (Apr - Jun)' },
    { value: 3, label: 'Q3 (Jul - Sep)' },
    { value: 4, label: 'Q4 (Oct - Dec)' },
  ];

  const notedByOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'auditor', label: 'Auditor' },
    { value: 'clerk', label: 'Clerk' },
  ];

  const renderDateInputs = () => {
    switch (activeReportType) {
      case 'daily':
        return (
          <FormField
            label="Date"
            name="date"
            type="date"
            required
            className="w-full"
          />
        );
      case 'monthly':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Month"
              name="month"
              type="select"
              options={months}
              required
            />
            <FormField
              label="Year"
              name="year"
              type="number"
              required
              min={2000}
              max={2100}
            />
          </div>
        );
      case 'quarterly':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Quarter"
              name="quarter"
              type="select"
              options={quarters}
              required
            />
            <FormField
              label="Year"
              name="year"
              type="number"
              required
              min={2000}
              max={2100}
            />
          </div>
        );
      case 'flexible':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="From Date"
                name="fromDate"
                type="date"
                required
              />
              <FormField label="To Date" name="toDate" type="date" required />
            </div>
            <FormField
              label="Noted By"
              name="notedBy"
              type="select"
              options={notedByOptions}
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={COLLECTION_REPORT_SCHEMA}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-4">
          {/* Report Type Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors sm:w-auto w-full ${
                  activeReportType === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => {
                  setActiveReportType(type.value);
                  setFieldValue('reportType', type.value);
                }}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Dynamic Date Inputs */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            {renderDateInputs()}
          </div>

          {/* Document Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Types
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { name: 'communityTax', label: 'Community Tax Certificate' },
                { name: 'marriageCert', label: 'Marriage Certificate' },
                { name: 'burialCert', label: 'Burial Certificate' },
                { name: 'generalService', label: 'General Service Invoice' },
                { name: 'propertyTax', label: 'Real Property Tax invoice' },
                { name: 'marketTicketing', label: 'Public Market Ticketing' },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`document-${doc.name}`}
                    name={`documentTypes.${doc.name}`}
                    checked={values.documentTypes[doc.name]}
                    onChange={(e) => {
                      setFieldValue(
                        `documentTypes.${doc.name}`,
                        e.target.checked
                      );
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`document-${doc.name}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {doc.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end pt-4 border-t border-neutral-200 gap-4 sm:flex-row flex-col">
            <button
              type="button"
              onClick={() => onSubmit({ ...values, action: 'view' })}
              className="btn btn-primary sm:w-auto w-full"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => onSubmit({ ...values, action: 'generate' })}
              className="btn btn-secondary sm:w-auto w-full"
            >
              Generate Journal
            </button>
            <button
              type="button"
              onClick={() => onSubmit({ ...values, action: 'export' })}
              className="btn btn-outline sm:w-auto w-full"
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
