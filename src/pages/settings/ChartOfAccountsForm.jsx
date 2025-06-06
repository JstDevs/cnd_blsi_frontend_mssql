import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { addAccount, updateAccount } from '../../features/settings/chartOfAccountsSlice';

// Mock data for dropdowns
const accountGroups = [
  { value: 'Assets', label: 'Assets' },
  { value: 'Liabilities', label: 'Liabilities' },
  { value: 'Equity', label: 'Equity' },
  { value: 'Income', label: 'Income' },
  { value: 'Expenses', label: 'Expenses' },
];

const subGroups = {
  'Assets': [
    { value: 'Cash and Cash Equivalents', label: 'Cash and Cash Equivalents' },
    { value: 'Investments', label: 'Investments' },
    { value: 'Receivables', label: 'Receivables' },
    { value: 'Inventories', label: 'Inventories' },
    { value: 'Property, Plant and Equipment', label: 'Property, Plant and Equipment' },
  ],
  'Liabilities': [
    { value: 'Current Liabilities', label: 'Current Liabilities' },
    { value: 'Non-Current Liabilities', label: 'Non-Current Liabilities' },
  ],
  'Equity': [
    { value: 'Government Equity', label: 'Government Equity' },
    { value: 'Retained Earnings', label: 'Retained Earnings' },
  ],
  'Income': [
    { value: 'Tax Revenue', label: 'Tax Revenue' },
    { value: 'Service Income', label: 'Service Income' },
    { value: 'Business Income', label: 'Business Income' },
    { value: 'Other Income', label: 'Other Income' },
  ],
  'Expenses': [
    { value: 'Personal Services', label: 'Personal Services' },
    { value: 'Maintenance and Other Operating Expenses', label: 'Maintenance and Other Operating Expenses' },
    { value: 'Financial Expenses', label: 'Financial Expenses' },
  ],
};

// Validation schema
const accountSchema = Yup.object().shape({
  accountCode: Yup.string()
    .required('Account code is required')
    .matches(/^\d(-\d{2}){2,3}(-\d{3})?$/, 'Invalid account code format (e.g., 1-01-01-010)'),
  accountTitle: Yup.string()
    .required('Account title is required')
    .max(100, 'Account title must be at most 100 characters'),
  description: Yup.string()
    .max(250, 'Description must be at most 250 characters'),
  accountGroup: Yup.string()
    .required('Account group is required'),
  normalBalance: Yup.string()
    .required('Normal balance is required'),
  openingBalance: Yup.number()
    .required('Opening balance is required'),
  openingBalanceDate: Yup.date()
    .required('Opening balance date is required'),
  isActive: Yup.boolean(),
  allowDirectPosting: Yup.boolean(),
  isContraAccount: Yup.boolean(),
  slRequired: Yup.boolean(),
});

function ChartOfAccountsForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = initialData ? { ...initialData } : {
    accountCode: '',
    accountTitle: '',
    description: '',
    accountGroup: '',
    normalBalance: '',
    openingBalance: 0,
    openingBalanceDate: new Date().toISOString().split('T')[0],
    isActive: true,
    allowDirectPosting: true,
    isContraAccount: false,
    slRequired: false,
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    
    const action = initialData 
      ? updateAccount({ ...values, id: initialData.id })
      : addAccount(values);
    
    dispatch(action)
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting account:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={accountSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, isValid }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Account Code"
              name="accountCode"
              type="text"
              required
              placeholder="e.g., 1-01-01-010"
              value={values.accountCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.accountCode}
              touched={touched.accountCode}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Account Title"
              name="accountTitle"
              type="text"
              required
              placeholder="Enter account title"
              value={values.accountTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.accountTitle}
              touched={touched.accountTitle}
            />
          </div>
          
          <FormField
            className='p-3 focus:outline-none'
            label="Description"
            name="description"
            type="textarea"
            placeholder="Enter account description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.description}
            touched={touched.description}
            rows={2}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Account Group"
              name="accountGroup"
              type="select"
              required
              value={values.accountGroup}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.accountGroup}
              touched={touched.accountGroup}
              options={accountGroups}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Normal Balance"
              name="normalBalance"
              type="select"
              required
              value={values.normalBalance}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.normalBalance}
              touched={touched.normalBalance}
              options={[
                { value: 'Debit', label: 'Debit' },
                { value: 'Credit', label: 'Credit' },
              ]}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Opening Balance"
              name="openingBalance"
              type="number"
              required
              placeholder="0.00"
              value={values.openingBalance}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.openingBalance}
              touched={touched.openingBalance}
              min="0"
              step="0.01"
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Opening Balance Date"
              name="openingBalanceDate"
              type="date"
              required
              value={values.openingBalanceDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.openingBalanceDate}
              touched={touched.openingBalanceDate}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Status"
              name="isActive"
              type="checkbox"
              value={values.isActive}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.isActive}
              touched={touched.isActive}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Allow Direct Posting"
              name="allowDirectPosting"
              type="checkbox"
              value={values.allowDirectPosting}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.allowDirectPosting}
              touched={touched.allowDirectPosting}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Is Contra Account"
              name="isContraAccount"
              type="checkbox"
              value={values.isContraAccount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.isContraAccount}
              touched={touched.isContraAccount}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Requires Subsidiary Ledger"
              name="slRequired"
              type="checkbox"
              value={values.slRequired}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.slRequired}
              touched={touched.slRequired}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Save'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default ChartOfAccountsForm;