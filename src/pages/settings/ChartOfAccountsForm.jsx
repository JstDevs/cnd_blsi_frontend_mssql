import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { addAccount, updateAccount } from '../../features/settings/chartOfAccountsSlice';
import { fetchAccountGroups } from '../../features/settings/accountGroupSlice';
import { fetchMajorAccountGroups } from '../../features/settings/majorAccountGroupSlice';
import { fetchSubMajorAccountGroups } from '../../features/settings/subMajorAccountGroupSlice';

// Validation schema
const accountSchema = Yup.object().shape({
  AccountCode: Yup.string()
    .required('Account no is required'),
  Code: Yup.string()
    .required('General Ledger Code is required'),
  Name: Yup.string()
    .required('Account title is required')
    .max(100, 'Account title must be at most 100 characters'),
  Description: Yup.string()
    .max(250, 'Description must be at most 250 characters'),
  AccountTypeID: Yup.string()
    .required('Account group is required'),
  AccountSubTypeID: Yup.string()
    .required('Major account group is required'),
  AccountCategoryID: Yup.string()
    .required('Sub Major account group is required'),
  NormalBalance: Yup.string()
    .required('Normal balance is required'),
});

function ChartOfAccountsForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const { accountGroups } = useSelector(state => state.accountGroups);
  const { majorAccountGroups } = useSelector(state => state.majorAccountGroups);
  const { subMajorAccountGroups } = useSelector(state => state.subMajorAccountGroups);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAccountGroups());
    dispatch(fetchMajorAccountGroups());
    dispatch(fetchSubMajorAccountGroups());
  }, [dispatch]);

  const initialValues = initialData ? { ...initialData } : {
    AccountCode: '',
    Code: '',
    Name: '',
    Description: '',
    AccountTypeID: '',
    AccountSubTypeID: '',
    AccountCategoryID: '',
    NormalBalance: '',
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    
    const action = initialData 
      ? updateAccount({ ...values, ID: initialData.ID })
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
          <div className="">
            <FormField
              className='p-3 focus:outline-none'
              label="Account No"
              name="AccountCode"
              type="text"
              required
              placeholder="e.g., 1-01-01-010"
              value={values.AccountCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.AccountCode}
              touched={touched.AccountCode}
            />
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="General Ledger Code"
              name="Code"
              type="text"
              required
              placeholder="e.g., 1-01-01-010"
              value={values.Code}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Code}
              touched={touched.Code}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Account Title"
              name="Name"
              type="text"
              required
              placeholder="Enter account title"
              value={values.Name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Name}
              touched={touched.Name}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Account Group"
              name="AccountTypeID"
              type="select"
              required
              value={values.AccountTypeID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.AccountTypeID}
              touched={touched.AccountTypeID}
              options={accountGroups.map(group => ({ value: group.ID, label: group.Name }))}
            />
            <FormField
              className='p-3 focus:outline-none'
              label="Major Account Group"
              name="AccountSubTypeID"
              type="select"
              required
              value={values.AccountSubTypeID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.AccountSubTypeID}
              touched={touched.AccountSubTypeID}
              options={majorAccountGroups.map(group => ({ value: group.ID, label: group.Name }))}
            />
            <FormField
              className='p-3 focus:outline-none'
              label="Sub Major Account Group"
              name="AccountCategoryID"
              type="select"
              required
              value={values.AccountCategoryID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.AccountCategoryID}
              touched={touched.AccountCategoryID}
              options={subMajorAccountGroups.map(group => ({ value: group.ID, label: group.Name }))}
            />
          </div>
          
          <FormField
            className='p-3 focus:outline-none'
            label="Description"
            name="Description"
            type="textarea"
            placeholder="Enter account description"
            value={values.Description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Description}
            touched={touched.Description}
            rows={2}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <FormField
              className='p-3 focus:outline-none'
              label="Normal Balance"
              name="NormalBalance"
              type="select"
              required
              value={values.NormalBalance}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.NormalBalance}
              touched={touched.NormalBalance}
              options={[
                { value: 'Debit', label: 'Debit' },
                { value: 'Credit', label: 'Credit' },
              ]}
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