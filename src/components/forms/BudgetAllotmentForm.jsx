import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

const validationSchema = Yup.object().shape({
  budgetName: Yup.string().required('Budget name is required'),
  fiscalYear: Yup.string().required('Fiscal year is required'),
  department: Yup.string().required('Department is required'),
  subDepartment: Yup.string().required('Sub department is required'),
  chartOfAccounts: Yup.string().required('Chart of accounts is required'),
  fund: Yup.string().required('Fund is required'),
  project: Yup.string().required('Project is required'),
  allotment: Yup.number().integer().required('Allotment is required'),
  remarks: Yup.string().required('Remarks is required'),
  appropriation: Yup.number().integer().required('Appropriation is required'),
  balance: Yup.number().integer().required('Balance is required'),
  releasedAllotments: Yup.number()
    .integer()
    .required('Released allotments is required'),
  releasedBalance: Yup.number()
    .integer()
    .required('Released balance is required'),
});

const initialValues = {
  budgetName: '',
  fiscalYear: 1,
  department: 1,
  subDepartment: 1,
  chartOfAccounts: 1,
  fund: 1,
  project: 1,
  appropriation: 0,
  charges: 0,
  totalAmount: 0,
  balance: 0,
  allotment: 0,
  remarks: '',
  releasedAllotments: 0,
  releasedBalance: 0,
};

// Mock data for select options
const fiscalYears = [
  { value: 1, label: 'FY 2023–24' },
  { value: 2, label: 'FY 2024–25' },
  { value: 3, label: 'FY 2025–26' },
];

const departments = [
  { value: 1, label: 'Finance' },
  { value: 2, label: 'Human Resources' },
  { value: 3, label: 'Information Technology' },
];

const subDepartments = [
  { value: 1, label: 'Accounts Payable' },
  { value: 2, label: 'Recruitment' },
  { value: 3, label: 'Infrastructure Support' },
];

const chartOfAccounts = [
  { value: 1, label: 'Cash and Cash Equivalents' },
  { value: 2, label: 'Accounts Receivable' },
  { value: 3, label: 'Office Supplies Expense' },
];

const projects = [
  { value: 1, label: 'ERP Implementation' },
  { value: 2, label: 'Employee Onboarding Automation' },
  { value: 3, label: 'Cloud Migration' },
];

function BudgetAllotmentForm({ initialData, onSubmit, onClose }) {
  const [formData, setFormData] = useState({ ...initialValues });

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values);
    setSubmitting(false);
    console.log('Form submitted with values:', values);
  };

  useEffect(() => {
    if (initialData?.ID) {
      setFormData({
        id: initialData?.ID,
        budgetName: initialData?.Name,
        fiscalYear: initialData?.FiscalYearID,
        department: initialData?.DepartmentID,
        subDepartment: initialData?.SubDepartmentID,
        chartOfAccounts: initialData?.ChartofAccountsID,
        fund: initialData?.FundID,
        project: initialData?.ProjectID,
        appropriation: initialData?.Appropriation,
        charges: initialData?.Charges,
        totalAmount: initialData?.TotalAmount,
        balance: initialData?.AppropriationBalance,
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
      }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Budget Name"
              name="budgetName"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.budgetName}
              error={errors.budgetName}
              touched={touched.budgetName}
              required
            />
            <FormField
              label="Fiscal Year"
              name="fiscalYear"
              type="select"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.fiscalYear}
              error={errors.fiscalYear}
              touched={touched.fiscalYear}
              options={fiscalYears}
              required
            />
            <FormField
              label="Department"
              name="department"
              type="select"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.department}
              error={errors.department}
              touched={touched.department}
              options={departments}
              required
            />
            <FormField
              label="Sub-Department"
              name="subDepartment"
              type="select"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.subDepartment}
              error={errors.subDepartment}
              touched={touched.subDepartment}
              options={subDepartments}
              required
            />
            <FormField
              label="Chart of Accounts"
              name="chartOfAccounts"
              type="select"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.chartOfAccounts}
              error={errors.chartOfAccounts}
              touched={touched.chartOfAccounts}
              options={chartOfAccounts}
              required
            />
            <FormField
              label="Fund"
              name="fund"
              type="select"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.fund}
              error={errors.fund}
              touched={touched.fund}
              options={[{ value: '1', label: 'General Fund' }]}
              required
            />
            <FormField
              label="Project"
              name="project"
              type="select"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.project}
              error={errors.project}
              touched={touched.project}
              options={projects}
              required
            />
            <FormField
              label="Allotment"
              name="allotment"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.allotment}
              error={errors.allotment}
              touched={touched.allotment}
              type="number"
              required
            />
            <FormField
              label="Appropriation"
              name="appropriation"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.appropriation}
              error={errors.appropriation}
              touched={touched.appropriation}
              required
            />
            <FormField
              label="Balance"
              name="balance"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.balance}
              error={errors.balance}
              touched={touched.balance}
              required
            />
            <FormField
              label="Released Allotments"
              name="releasedAllotments"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.releasedAllotments}
              error={errors.releasedAllotments}
              touched={touched.releasedAllotments}
              required
            />
            <FormField
              type="number"
              label="Released Balance"
              name="releasedBalance"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.releasedBalance}
              error={errors.releasedBalance}
              touched={touched.releasedBalance}
              required
            />
            <FormField
              label="Remarks"
              name="remarks"
              type="textarea"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.remarks}
              error={errors.remarks}
              touched={touched.remarks}
              required
            />
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
        </Form>
      )}
    </Formik>
  );
}

export default BudgetAllotmentForm;
