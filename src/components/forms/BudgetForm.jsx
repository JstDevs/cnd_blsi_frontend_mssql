import React, { useState, useEffect, useMemo } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  BriefcaseIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import FormField from '../common/FormField';
import SearchableDropdown from '../common/SearchableDropdown';
import { formatCurrency, formatForInput } from '@/utils/currencyFormater';

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
        ChartofAccountsID: initialData.ChartofAccountsID || '',
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
        setFieldValue,
      }) => {
        // Filter subdepartments based on selected department
        // IMPORTANT: This must be inside the Formik render function to access live values
        const filteredSubDepartmentOptions = useMemo(() => {
          if (!values.DepartmentID) {
            return []; // No department selected, show empty list
          }

          // Convert both to numbers to handle string/number type mismatch
          return subDepartmentOptions.filter(subDept =>
            Number(subDept.departmentID) === Number(values.DepartmentID)
          );
        }, [values.DepartmentID, subDepartmentOptions]);

        return (
          <Form className="space-y-6">

            {/* Section 1: Budget Information */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2 border-b border-neutral-100 pb-2">
                <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                Budget Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <FormField
                    label="Budget Name"
                    name="Name"
                    value={values.Name}
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.Name}
                    touched={touched.Name}
                    readOnly
                    className="bg-gray-50 focus:bg-white transition-colors font-medium"
                  />
                </div>

                <SearchableDropdown
                  label="Chart of Accounts"
                  options={chartOfAccountsOptions}
                  selectedValue={values.ChartofAccountsID}
                  onSelect={(value) => {
                    setFieldValue('ChartofAccountsID', value);
                    const selected = chartOfAccountsOptions.find(opt => opt.value === value);
                    if (selected) {
                      setFieldValue('Name', selected.label.split(' - ').slice(1).join(' - ') || selected.label);
                    }
                  }}
                  error={errors.ChartofAccountsID}
                  touched={touched.ChartofAccountsID}
                  required
                  placeholder="Search Account..."
                />

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
                  onChange={(e) => {
                    handleChange(e);
                    // Reset subdepartment when department changes
                    setFieldValue('SubDepartmentID', '');
                  }}
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
                  options={filteredSubDepartmentOptions}
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
              </div>
            </div>

            {/* Section 2: Financial Overview (Compact & Highlighted) */}
            <div className="bg-neutral-50 px-5 py-4 rounded-xl border border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <CurrencyDollarIcon className="h-4 w-4" />
                Financial Overview
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  label="Appropriation"
                  name="Appropriation"
                  type="text"
                  value={formatCurrency(values.Appropriation)}
                  readOnly
                  className="bg-white font-bold text-green-700 text-right border-green-200"
                />
                <FormField
                  label="Charges"
                  name="Charges"
                  type="text"
                  value={formatCurrency(values.Charges)}
                  readOnly
                  className="bg-white font-bold text-amber-700 text-right border-amber-200"
                />
                <FormField
                  label="Total Amount"
                  name="TotalAmount"
                  type="text"
                  value={formatCurrency(values.TotalAmount)}
                  readOnly
                  className="bg-white font-bold text-blue-700 text-right border-blue-200"
                />
                <FormField
                  label="Balance"
                  name="AppropriationBalance"
                  type="text"
                  value={formatCurrency(values.AppropriationBalance)}
                  readOnly
                  className="bg-white font-bold text-neutral-800 text-right border-neutral-300"
                />
              </div>
            </div>

            {/* Section 3: Monthly Allocation */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2 border-b border-neutral-100 pb-2">
                <CalendarIcon className="h-5 w-5 text-purple-600" />
                Monthly Allocation
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((month) => (
                  <FormField
                    key={month}
                    label={month}
                    name={month}
                    type="text"
                    className="text-right font-medium"
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                      const numericValue = rawValue === '' ? '' : rawValue;

                      handleChange({ target: { name: month, value: numericValue } });

                      const updatedMonths = { ...values, [month]: numericValue };
                      const monthsList = [
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ];

                      const sum = monthsList.reduce(
                        (total, m) => total + (Number(updatedMonths[m]) || 0),
                        0
                      );

                      setFieldValue('Appropriation', sum);
                      setFieldValue('TotalAmount', sum);
                      setFieldValue('AppropriationBalance', sum);
                      setFieldValue('AllotmentBalance', 0);
                    }}
                    onBlur={handleBlur}
                    value={formatForInput(values[month])}
                    error={errors[month]}
                    touched={touched[month]}
                  />
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center gap-2"
              >
                <ChartBarIcon className="h-4 w-4" />
                {initialData ? 'Update Appropriation' : 'Save Appropriation'}
              </button>
            </div>

            {submitCount > 0 && Object.keys(errors).length > 0 && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-pulse">
                <h3 className="text-sm font-medium text-red-800">Please check the form for errors</h3>
              </div>
            )}
          </Form>
        );
      }}
    </Formik>
  );
}

export default BudgetForm;