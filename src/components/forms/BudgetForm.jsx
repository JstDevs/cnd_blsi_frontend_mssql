import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

const validationSchema = Yup.object().shape({
  Name: Yup.string().required('Budget name is required'),
  FiscalYearID: Yup.number().required('Fiscal year is required'),
  DepartmentID: Yup.number().required('Department is required'),
  SubDepartmentID: Yup.number().required('Sub department is required'),
  ChartofAccountsID: Yup.number().required('Chart of accounts is required'),
  FundID: Yup.number().required('Fund is required'),
  ProjectID: Yup.number().required('Project is required'),
  Appropriation: Yup.number().required('Appropriation is required'),
  Charges: Yup.number().required('Charges is required'),

  // Months are optional — no `.required()`:
  January: Yup.number().nullable(),
  February: Yup.number().nullable(),
  March: Yup.number().nullable(),
  April: Yup.number().nullable(),
  May: Yup.number().nullable(),
  June: Yup.number().nullable(),
  July: Yup.number().nullable(),
  August: Yup.number().nullable(),
  September: Yup.number().nullable(),
  October: Yup.number().nullable(),
  November: Yup.number().nullable(),
  December: Yup.number().nullable(),
});

const initialValues = {
  ID: '',
  IsNew: true,
  Name: '',
  FiscalYearID: '',
  DepartmentID: '',
  SubDepartmentID: '',
  ChartofAccountsID: '',
  FundID: '',
  ProjectID: '',
  Appropriation: 0,
  Charges: 0,
  January: 0,
  February: 0,
  March: 0,
  April: 0,
  May: 0,
  June: 0,
  July: 0,
  August: 0,
  September: 0,
  October: 0,
  November: 0,
  December: 0,
};

function BudgetForm({
  initialData,
  onSubmit,
  onClose,
  departmentOptions,
  subDepartmentOptions,
  chartOfAccountsOptions,
  fundOptions,
  projectOptions,
  fiscalYearOptions,
}) {
  const [formData, setFormData] = useState({ ...initialValues });

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values);
    setSubmitting(false);
    console.log('Form submitted with values:', values);
  };

  useEffect(() => {
    if (initialData?.ID) {
      setFormData({
        ID: initialData.ID,
        IsNew: false,
        Name: initialData.Name || '',
        FiscalYearID: initialData.FiscalYearID || '',
        DepartmentID: initialData.DepartmentID || '',
        SubDepartmentID: initialData.SubDepartmentID || '',
        ChartofAccountsID: initialData.ChartofAccountsID || '', // ✅ change from "ChartofAccountsID"
        FundID: initialData.FundID || '',
        ProjectID: initialData.ProjectID || '',
        Appropriation: initialData.Appropriation || 0,
        Charges: initialData.Charges || 0,
        January: initialData.January || 0,
        February: initialData.February || 0,
        March: initialData.March || 0,
        April: initialData.April || 0,
        May: initialData.May || 0,
        June: initialData.June || 0,
        July: initialData.July || 0,
        August: initialData.August || 0,
        September: initialData.September || 0,
        October: initialData.October || 0,
        November: initialData.November || 0,
        December: initialData.December || 0,
      });
    } else {
      setFormData(initialValues);
    }
  }, [initialData]);

  return (
    <Formik
      enableReinitialize
      onSubmit={handleSubmit}
      initialValues={formData}
      validationSchema={validationSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
        submitCount,
      }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormField
                label="Budget Name"
                name="Name" // ✅ change from "budgetName"
                value={values.Name}
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Name}
                touched={touched.Name}
                required
              />
            </div>
            <FormField
              label="Fiscal Year"
              name="FiscalYearID"
              type="select"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.FiscalYearID}
              error={errors.FiscalYearID}
              touched={touched.FiscalYearID}
              options={fiscalYearOptions}
              required
            />
            <FormField
              label="Department"
              name="DepartmentID"
              type="select"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.DepartmentID}
              error={errors.DepartmentID}
              touched={touched.DepartmentID}
              options={departmentOptions}
              required
            />
            <FormField
              label="Sub-Department"
              name="SubDepartmentID"
              type="select"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.SubDepartmentID}
              error={errors.SubDepartmentID}
              touched={touched.SubDepartmentID}
              options={subDepartmentOptions}
              required
            />
            <FormField
              label="Chart of Accounts"
              name="ChartofAccountsID"
              type="select"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.ChartofAccountsID}
              error={errors.ChartofAccountsID}
              touched={touched.ChartofAccountsID}
              options={chartOfAccountsOptions}
              required
            />
            <FormField
              label="Fund"
              name="FundID"
              type="select"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.FundID}
              error={errors.FundID}
              touched={touched.FundID}
              options={fundOptions}
              required
            />
            <FormField
              label="Project"
              name="ProjectID"
              type="select"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.ProjectID}
              error={errors.ProjectID}
              touched={touched.ProjectID}
              options={projectOptions}
              required
            />
            <FormField
              label="Appropriation"
              name="Appropriation"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.Appropriation}
              error={errors.Appropriation}
              touched={touched.Appropriation}
              type="number"
              required
            />
            <FormField
              label="Charges"
              name="Charges"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.Charges}
              error={errors.Charges}
              touched={touched.Charges}
              required
            />
            <FormField
              label="Total Amount"
              name="TotalAmount"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.TotalAmount}
              error={errors.TotalAmount}
              touched={touched.TotalAmount}
              readOnly
              className="bg-gray-100"
            />
            <FormField
              label="Balance"
              name="AppropriationBalance"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.AppropriationBalance}
              error={errors.AppropriationBalance}
              touched={touched.AppropriationBalance}
              readOnly
              className="bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ].map((month) => (
              <FormField
                key={month}
                label={month}
                name={month}
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values[month]}
                error={errors[month]}
                touched={touched[month]}
              />
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {initialData ? 'Update' : 'Save'}
            </button>
          </div>
          {submitCount > 0 && Object.keys(errors).length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <h3 className="text-sm font-medium text-red-800">
                Please fix the following errors:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
                {Object.entries(errors).map(([fieldName, errorMessage]) => (
                  <li key={fieldName}>{errorMessage}</li>
                ))}
              </ul>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}

export default BudgetForm;
