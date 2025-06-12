import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../../components/common/FormField';

const fiscalYears = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
];

const departments = [
  { value: 'dept1', label: 'Department 1' },
  { value: 'dept2', label: 'Department 2' },
];

const subDepartments = [
  { value: 'sub1', label: 'Sub-Department 1' },
  { value: 'sub2', label: 'Sub-Department 2' },
];

const chartOfAccounts = [
  { value: 'coa1', label: 'Chart 1' },
  { value: 'coa2', label: 'Chart 2' },
];

const funds = [
  { value: 'fund1', label: 'Fund 1' },
  { value: 'fund2', label: 'Fund 2' },
];

const projects = [
  { value: 'proj1', label: 'Project A', appropriation: 'A1', charges: 'C1', total: '10000', balance: '5000' },
  { value: 'proj2', label: 'Project B', appropriation: 'A2', charges: 'C2', total: '20000', balance: '15000' },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const budgetSchema = Yup.object().shape({
  budgetName: Yup.string().required('Required'),
  fiscalYear: Yup.string().required('Required'),
  department: Yup.string().required('Required'),
  subDepartment: Yup.string().required('Required'),
  chartOfAccount: Yup.string().required('Required'),
  fund: Yup.string().required('Required'),
  project: Yup.string().required('Required'),
  monthlyAmounts: Yup.object().shape(
    months.reduce((acc, month) => {
      acc[month] = Yup.number().min(0, 'Must be >= 0').required('Required');
      return acc;
    }, {})
  )
});

export default function NewBudgetPage() {
  const [projectDetails, setProjectDetails] = useState({});

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">New Budget</h1>
      <Formik
        initialValues={{
          budgetName: '',
          fiscalYear: '',
          department: '',
          subDepartment: '',
          chartOfAccount: '',
          fund: '',
          project: '',
          monthlyAmounts: months.reduce((acc, m) => ({ ...acc, [m]: '' }), {})
        }}
        validationSchema={budgetSchema}
        onSubmit={(values) => {
          console.log('Submitted:', values);
        }}
      >
        {({ values, handleChange, setFieldValue }) => {
          useEffect(() => {
            const selected = projects.find(p => p.value === values.project);
            if (selected) setProjectDetails(selected);
          }, [values.project]);

          return (
            <Form className="space-y-4">
              <FormField name="budgetName" label="Budget Name" type="text" required value={values.budgetName} onChange={handleChange} />
              <FormField name="fiscalYear" label="Fiscal Year" type="select" required options={fiscalYears} value={values.fiscalYear} onChange={handleChange} />
              <FormField name="department" label="Department" type="select" required options={departments} value={values.department} onChange={handleChange} />
              <FormField name="subDepartment" label="Sub-Department" type="select" required options={subDepartments} value={values.subDepartment} onChange={handleChange} />
              <FormField name="chartOfAccount" label="Chart of Accounts" type="select" required options={chartOfAccounts} value={values.chartOfAccount} onChange={handleChange} />
              <FormField name="fund" label="Fund" type="select" required options={funds} value={values.fund} onChange={handleChange} />
              <FormField name="project" label="Project" type="select" required options={projects.map(p => ({ value: p.value, label: p.label }))} value={values.project} onChange={handleChange} />

              {/* Project Detail Section */}
              {values.project && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-lg border">
                  <div><strong>Appropriation:</strong> {projectDetails.appropriation}</div>
                  <div><strong>Charges:</strong> {projectDetails.charges}</div>
                  <div><strong>Total Amount:</strong> {projectDetails.total}</div>
                  <div><strong>Balance:</strong> {projectDetails.balance}</div>
                </div>
              )}

              {/* Monthly Amounts Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {months.map(month => (
                  <FormField
                    key={month}
                    name={`monthlyAmounts.${month}`}
                    label={month}
                    type="number"
                    value={values.monthlyAmounts[month]}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                ))}
              </div>

              <div className="pt-6">
                <button type="submit" className="btn btn-primary">Submit Budget</button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
