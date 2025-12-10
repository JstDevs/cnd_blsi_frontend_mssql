import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../../components/common/FormField';
import { useState } from 'react';

const COLLECTION_REPORT_SCHEMA = Yup.object().shape({
  reportType: Yup.string().required('Report type is required'),
  date: Yup.date().when('reportType', {
    is: 'daily', // Direct value comparison
    then: (schema) => schema.required('Date is required'),
  }),
  action: Yup.string().required('Action is required'),
  month: Yup.number().when('reportType', {
    is: 'monthly', // Direct value comparison
    then: (schema) => schema.required('Month is required').min(1).max(12),
  }),
  year: Yup.number().when('reportType', {
    is: (val) => ['monthly', 'quarterly'].includes(val), // Function for array check
    then: (schema) => schema.required('Year is required').min(2000).max(2100),
  }),
  quarter: Yup.number().when('reportType', {
    is: 'quarterly', // Direct value comparison
    then: (schema) => schema.required('Quarter is required').min(1).max(4),
  }),
  fromDate: Yup.date().when('reportType', {
    is: 'flexible', // Direct value comparison
    then: (schema) => schema.required('From date is required'),
  }),
  toDate: Yup.date().when('reportType', {
    is: 'flexible', // Direct value comparison
    then: (schema) =>
      schema
        .required('To date is required')
        .min(Yup.ref('fromDate'), 'To date must be after from date'),
  }),
  notedBy: Yup.string().when('reportType', {
    is: 'flexible', // Direct value comparison
    then: (schema) => schema.required('Noted by is required'),
  }),
});

function CollectionReportForm({
  onSubmitCollectionReport,
  activeReportType,
  setActiveReportType,
}) {
  const initialValues = {
    reportType: 'daily',
    action: '',
    date: '',
    month: '',
    year: new Date().getFullYear(),
    quarter: '',
    fromDate: '',
    toDate: '',
    notedBy: '',
    documentTypes: {
      communityTax: true,
      marriageCert: true,
      burialCert: true,
      generalService: true,
      propertyTax: true,
      marketTicketing: true,
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

  const renderDateInputs = (errors, touched, values, handleChange) => {
    switch (activeReportType) {
      case 'daily':
        return (
          <FormField
            label="Date"
            name="date"
            type="date"
            required
            className="w-full"
            onChange={handleChange}
            value={values.date}
            error={errors.date}
            touched={touched.date}
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
              value={values.month}
              onChange={handleChange}
              required
              error={errors.month}
              touched={touched.month}
            />
            <FormField
              label="Year"
              name="year"
              type="number"
              required
              min={2000}
              max={2100}
              value={values.year}
              onChange={handleChange}
              error={errors.year}
              touched={touched.year}
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
              value={values.quarter}
              onChange={handleChange}
              required
              error={errors.quarter}
              touched={touched.quarter}
            />
            <FormField
              label="Year"
              name="year"
              type="number"
              required
              value={values.year}
              onChange={handleChange}
              min={2000}
              max={2100}
              error={errors.year}
              touched={touched.year}
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
                value={values.fromDate}
                onChange={handleChange}
                error={errors.fromDate}
                touched={touched.fromDate}
              />
              <FormField
                label="To Date"
                name="toDate"
                type="date"
                required
                value={values.toDate}
                onChange={handleChange}
                error={errors.toDate}
                touched={touched.toDate}
              />
            </div>
            <FormField
              label="Noted By"
              name="notedBy"
              type="select"
              options={notedByOptions}
              required
              value={values.notedBy}
              onChange={handleChange}
              error={errors.notedBy}
              touched={touched.notedBy}
            />
          </div>
        );
      default:
        return null;
    }
  };
  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    try {
      // Base params common to all report types
      const baseParams = {
        ctc: values.documentTypes.communityTax ? 1 : 0,
        btc: values.documentTypes.burialCert ? 1 : 0,
        mrc: values.documentTypes.marriageCert ? 1 : 0,
        gsi: values.documentTypes.generalService ? 1 : 0,
        rpt: values.documentTypes.propertyTax ? 1 : 0,
        pmt: values.documentTypes.marketTicketing ? 1 : 0,
      };

      // Type-specific params
      let typeParams = {};
      switch (values.reportType) {
        case 'daily':
          typeParams = { date: values.date };
          break;
        case 'monthly':
          typeParams = {
            month: values.month,
            year: values.year,
          };
          break;
        case 'quarterly':
          typeParams = {
            quarter: values.quarter,
            year: values.year,
          };
          break;
        case 'flexible':
          typeParams = {
            startdate: values.fromDate,
            enddate: values.toDate,
            note: values.notedBy,
          };
          break;
        default:
          throw new Error('Invalid report type');
      }

      // Combine all params
      const params = {
        ...baseParams,
        ...typeParams,
      };

      // Pass to parent handler
      onSubmitCollectionReport({
        ...values,
        action: values.action,
        params,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={COLLECTION_REPORT_SCHEMA}
      onSubmit={handleFormSubmit}
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        handleSubmit,
        handleChange,
        setErrors,
        isSubmitting,
      }) => (
        <Form className="space-y-4">
          {/* Report Type Buttons */}
          {(function () {
            console.log(activeReportType, values, errors);
          })()}
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
            {renderDateInputs(errors, touched, values, handleChange)}
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
              onClick={() => {
                setFieldValue('action', 'view');
                handleSubmit();
                setErrors({}); // Clear all form errors
              }}
              className="btn btn-primary sm:w-auto w-full"
            >
              View
            </button>
            <button
              type="button"
              onClick={() => {
                setFieldValue('action', 'generate');
                handleSubmit();
              }}
              className="btn btn-secondary sm:w-auto w-full"
            >
              Generate Journal
            </button>
            <button
              type="button"
              onClick={() => {
                setFieldValue('action', 'export');
                handleSubmit();
              }}
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
