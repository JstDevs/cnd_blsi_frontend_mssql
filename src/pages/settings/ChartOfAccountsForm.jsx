// ChartOfAccountsForm.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import {
  addAccount,
  fetchAccounts,
  updateAccount,
} from '../../features/settings/chartOfAccountsSlice';
import { fetchAccountGroups } from '../../features/settings/accountGroupSlice';
import { fetchMajorAccountGroups } from '../../features/settings/majorAccountGroupSlice';
import { fetchSubMajorAccountGroups } from '../../features/settings/subMajorAccountGroupSlice';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import toast from 'react-hot-toast';

// Auto-generate account code component
const AutoGenerateAccountCode = ({
  accountGroups,
  majorAccountGroups,
  subMajorAccountGroups,
}) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();

  // Get code by ID from different groups
  const getCodeById = (id, group) => {
    const item = group.find((item) => item.ID === id);
    return item ? item.Code : '';
  };

  useEffect(() => {
    if (
      values.AccountTypeID ||
      values.AccountSubTypeID ||
      values.AccountCategoryID ||
      values.Code
    ) {
      const accountGroupCode = getCodeById(values.AccountTypeID, accountGroups);
      const majorAccountGroupCode = getCodeById(
        values.AccountSubTypeID,
        majorAccountGroups
      );
      const subMajorAccountGroupCode = getCodeById(
        values.AccountCategoryID,
        subMajorAccountGroups
      );

      const newAccountCode = `${accountGroupCode}-${majorAccountGroupCode}-${subMajorAccountGroupCode}-${values.Code}`;
      setFieldValue('AccountCode', newAccountCode);
    }
  }, [
    values.AccountTypeID,
    values.AccountSubTypeID,
    values.AccountCategoryID,
    values.Code,
  ]);

  return (
    <FormField
      className="p-3 focus:outline-none bg-gray-200 cursor-not-allowed"
      label="Account No"
      name="AccountCode"
      type="text"
      required
      placeholder="e.g., 03-02-02-65465"
      value={values.AccountCode}
      readOnly
      error={touched.AccountCode && errors.AccountCode}
      touched={touched.AccountCode}
    />
  );
};

// Validation schema
const accountSchema = Yup.object().shape({
  AccountCode: Yup.string()
    .required('Account no is required')
    .max(30, 'Account no must be at most 30 characters'),
  Code: Yup.string()
    .required('General Ledger Code is required')
    .max(10, 'General Ledger Code must be at most 10 characters'),
  Name: Yup.string()
    .required('Account title is required')
    .max(100, 'Account title must be at most 100 characters'),
  Description: Yup.string().max(
    250,
    'Description must be at most 250 characters'
  ),
  AccountTypeID: Yup.string().required('Account group is required'),
  AccountSubTypeID: Yup.string().required('Major account group is required'),
  AccountCategoryID: Yup.string().required(
    'Sub Major account group is required'
  ),
  NormalBalance: Yup.string().required('Normal balance is required'),
});

function ChartOfAccountsForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const { accountGroups } = useSelector((state) => state.accountGroups);
  const { majorAccountGroups } = useSelector(
    (state) => state.majorAccountGroups
  );
  const { subMajorAccountGroups } = useSelector(
    (state) => state.subMajorAccountGroups
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchAccountGroups());
    dispatch(fetchMajorAccountGroups());
    dispatch(fetchSubMajorAccountGroups());
  }, [dispatch]);

  const initialValues = initialData
    ? { ...initialData }
    : {
        AccountCode: '',
        Code: '',
        Name: '',
        Description: '',
        AccountTypeID: '',
        AccountSubTypeID: '',
        AccountCategoryID: '',
        NormalBalance: '',
      };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    const action = initialData
      ? updateAccount({ ...values, ID: initialData.ID })
      : addAccount(values);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success('Account updated successfully');
        dispatch(fetchAccounts());
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting account:', error);
        toast.error('Failed to submit account. Please try again.');
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
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isValid,
        setFieldValue,
      }) => (
        <Form className="space-y-4">
          <div className="">
            <AutoGenerateAccountCode
              accountGroups={accountGroups}
              majorAccountGroups={majorAccountGroups}
              subMajorAccountGroups={subMajorAccountGroups}
            />
          </div>
          {console.log('values', values, errors)}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className="p-3 focus:outline-none"
              label="General Ledger Code"
              name="Code"
              type="text"
              required
              placeholder="e.g., 65465"
              value={values.Code}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Code}
              touched={touched.Code}
            />

            <FormField
              className="p-3 focus:outline-none"
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

            <SearchableDropdown
              label="Account Group"
              options={accountGroups.map((group) => ({
                label: `${group.Name} (${group.Code})`,
                value: group.ID,
              }))}
              placeholder="Select Account Group"
              onSelect={(selectedId) => {
                setFieldValue('AccountTypeID', selectedId || '');
              }}
              selectedValue={values.AccountTypeID || ''}
              required
              error={errors.AccountTypeID}
              touched={touched.AccountTypeID}
            />

            <SearchableDropdown
              label="Major Account Group"
              options={majorAccountGroups.map((group) => ({
                label: `${group.Name} (${group.Code})`,
                value: group.ID,
              }))}
              placeholder="Select Major Account Group"
              onSelect={(selectedId) => {
                setFieldValue('AccountSubTypeID', selectedId || '');
              }}
              selectedValue={
                majorAccountGroups.find(
                  (group) => group.ID === values.AccountSubTypeID
                )?.ID || ''
              }
              required
              error={errors.AccountSubTypeID}
              touched={touched.AccountSubTypeID}
            />

            <SearchableDropdown
              label="Sub Major Account Group"
              options={subMajorAccountGroups.map((group) => ({
                label: `${group.Name} (${group.Code})`,
                value: group.ID,
              }))}
              placeholder="Select Sub Major Account Group"
              onSelect={(selectedId) => {
                setFieldValue('AccountCategoryID', selectedId || '');
              }}
              selectedValue={values.AccountCategoryID || ''}
              required={true}
              error={errors.AccountCategoryID}
              touched={touched.AccountCategoryID}
            />
          </div>

          <FormField
            className="p-3 focus:outline-none"
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
              className="p-3 focus:outline-none"
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
            <button type="button" onClick={onClose} className="btn btn-outline">
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
