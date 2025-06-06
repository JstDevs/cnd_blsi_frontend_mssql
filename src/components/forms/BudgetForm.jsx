import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

const validationSchema = Yup.object().shape({
  // Basic Information
  budgetName: Yup.string().required('Budget Name is required'),
  fiscalYear: Yup.string().required('Fiscal Year is required'),
  department: Yup.string().required('Department is required'),
  subDepartment: Yup.string().required('Sub-Department is required'),
  chartOfAccounts: Yup.string().required('Chart of Accounts is required'),
  fund: Yup.string().required('Fund is required'),
  project: Yup.string().required('Project is required'),
  appropriation: Yup.number()
    .required('Appropriation is required')
    .min(0, 'Appropriation must be positive'),
  charges: Yup.number()
    .required('Charges is required')
    .min(0, 'Charges must be positive'),
  totalAmount: Yup.number()
    .required('Total Amount is required')
    .min(0, 'Total Amount must be positive'),
  balance: Yup.number()
    .required('Balance is required')
    .min(0, 'Balance must be positive'),

  // Monthly Information
  january: Yup.string(),
  february: Yup.string(),
  march: Yup.string(),
  april: Yup.string(),
  may: Yup.string(),
  june: Yup.string(),
  july: Yup.string(),
  august: Yup.string(),
  september: Yup.string(),
  october: Yup.string(),
  november: Yup.string(),
  december: Yup.string(),
});

const initialValues = {
  budgetName: '',
  fiscalYear: '',
  department: '',
  subDepartment: '',
  chartOfAccounts: '',
  fund: 'General Fund',
  project: '',
  appropriation: '',
  charges: '',
  totalAmount: '',
  balance: '',
  january: '',
  february: '',
  march: '',
  april: '',
  may: '',
  june: '',
  july: '',
  august: '',
  september: '',
  october: '',
  november: '',
  december: '',
};

// Mock data for select options
const fiscalYears = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' },
];

const departments = [
  { value: 'dept1', label: 'Department 1' },
  { value: 'dept2', label: 'Department 2' },
  { value: 'dept3', label: 'Department 3' },
];

const subDepartments = [
  { value: 'subdept1', label: 'Sub-Department 1' },
  { value: 'subdept2', label: 'Sub-Department 2' },
  { value: 'subdept3', label: 'Sub-Department 3' },
];

const chartOfAccounts = [
  { value: 'coa1', label: 'Chart of Accounts 1' },
  { value: 'coa2', label: 'Chart of Accounts 2' },
  { value: 'coa3', label: 'Chart of Accounts 3' },
];

const projects = [
  { value: 'proj1', label: 'Project 1' },
  { value: 'proj2', label: 'Project 2' },
  { value: 'proj3', label: 'Project 3' },
];

function BudgetForm({ initialData, onSubmit, onClose }) {
  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialData || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values }) => (
        <Form className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Budget Name"
                name="budgetName"
                type="text"
                required
              />
              <FormField
                label="Fiscal Year"
                name="fiscalYear"
                type="select"
                options={fiscalYears}
                required
              />
              <FormField
                label="Department"
                name="department"
                type="select"
                options={departments}
                required
              />
              <FormField
                label="Sub-Department"
                name="subDepartment"
                type="select"
                options={subDepartments}
                required
              />
              <FormField
                label="Chart of Accounts"
                name="chartOfAccounts"
                type="select"
                options={chartOfAccounts}
                required
              />
              <FormField
                label="Fund"
                name="fund"
                type="select"
                options={[{ value: 'General Fund', label: 'General Fund' }]}
                required
              />
              <FormField
                label="Project"
                name="project"
                type="select"
                options={projects}
                required
              />
              <FormField
                label="Appropriation"
                name="appropriation"
                type="number"
                required
              />
              <FormField
                label="Charges"
                name="charges"
                type="number"
                required
              />
              <FormField
                label="Total Amount"
                name="totalAmount"
                type="number"
                required
              />
              <FormField
                label="Balance"
                name="balance"
                type="number"
                required
              />
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                label="January"
                name="january"
                type="text"
              />
              <FormField
                label="February"
                name="february"
                type="text"
              />
              <FormField
                label="March"
                name="march"
                type="text"
              />
              <FormField
                label="April"
                name="april"
                type="text"
              />
              <FormField
                label="May"
                name="may"
                type="text"
              />
              <FormField
                label="June"
                name="june"
                type="text"
              />
              <FormField
                label="July"
                name="july"
                type="text"
              />
              <FormField
                label="August"
                name="august"
                type="text"
              />
              <FormField
                label="September"
                name="september"
                type="text"
              />
              <FormField
                label="October"
                name="october"
                type="text"
              />
              <FormField
                label="November"
                name="november"
                type="text"
              />
              <FormField
                label="December"
                name="december"
                type="text"
              />
            </div>
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
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default BudgetForm; 