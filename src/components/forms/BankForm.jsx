import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import {
  addBank,
  fetchBanks,
  updateBank,
} from '../../features/settings/bankSlice';
import { fetchCurrencies } from '../../features/settings/currencySlice';
import toast from 'react-hot-toast';

// Validation schema
const bankSchema = Yup.object().shape({
  BranchCode: Yup.string()
    .required('Branch code is required')
    .max(20, 'Branch code must be at most 20 characters'),
  Branch: Yup.string()
    .required('Branch is required')
    .max(100, 'Branch name must be at most 100 characters'),
  Name: Yup.string()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
  Address: Yup.string()
    .required('Address is required')
    .max(200, 'Address must be at most 200 characters'),
  AccountNumber: Yup.string().required('Account number is required'),
  SwiftCode: Yup.string()
    .required('Swift code is required')
    .max(11, 'SWIFT code must be at most 11 characters')
    .matches(
      /^[A-Za-z0-9]+$/,
      'SWIFT code must contain only uppercase letters and numbers'
    ),
  IBAN: Yup.string()
    .required('IBAN is required')
    .max(34, 'IBAN must be at most 34 characters')
    .matches(
      /^[A-Za-z0-9]+$/,
      'IBAN must contain only uppercase letters and numbers'
    ),
  Balance: Yup.number()
    .required('Balance is required')
    .min(0, 'Balance cannot be negative'),
  CurrencyID: Yup.string().required('Currency is required'),
});

function BankForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { currencies } = useSelector((state) => state.currencies); // adjust according to your slice

  const initialValues = initialData
    ? { ...initialData }
    : {
        BranchCode: '',
        Branch: '',
        Name: '',
        Address: '',
        AccountNumber: '',
        SwiftCode: '',
        IBAN: '',
        Balance: '',
        CurrencyID: '',
      };

  const handleSubmit = (values) => {
    setIsSubmitting(true);

    const bankData = {
      ...values,
    };

    const action = initialData
      ? updateBank({ ...bankData, ID: initialData.ID })
      : addBank(bankData);

    dispatch(action)
      .unwrap()
      .then(() => {
        onClose();
        toast.success('Bank submitted successfully');
      })
      .catch((error) => {
        console.error('Error submitting bank:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
        dispatch(fetchBanks());
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={bankSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
      }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              className="p-3 focus:outline-none"
              label="Branch Code"
              name="BranchCode"
              type="text"
              required
              placeholder="Enter branch code"
              value={values.BranchCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.BranchCode && errors.BranchCode}
              touched={touched.BranchCode}
            />

            <FormField
              className="p-3 focus:outline-none"
              label="Branch"
              name="Branch"
              type="text"
              required
              placeholder="Enter branch name"
              value={values.Branch}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.Branch && errors.Branch}
              touched={touched.Branch}
            />

            <FormField
              className="p-3 focus:outline-none"
              label="Name"
              name="Name"
              type="text"
              required
              placeholder="Enter bank name"
              value={values.Name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.Name && errors.Name}
              touched={touched.Name}
            />
          </div>

          <FormField
            className="p-3 focus:outline-none"
            label="Address"
            name="Address"
            type="textarea"
            required
            placeholder="Enter complete address"
            value={values.Address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.Address && errors.Address}
            touched={touched.Address}
            rows={2}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              className="p-3 focus:outline-none"
              label="Account Number"
              name="AccountNumber"
              type="text"
              required
              placeholder="Enter account number"
              value={values.AccountNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.AccountNumber && errors.AccountNumber}
              touched={touched.AccountNumber}
            />

            <FormField
              className="p-3 focus:outline-none uppercase"
              label="SWIFT Code"
              name="SwiftCode"
              type="text"
              required
              placeholder="Enter SWIFT code"
              value={values.SwiftCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.SwiftCode && errors.SwiftCode}
              touched={touched.SwiftCode}
            />

            <FormField
              className="p-3 focus:outline-none uppercase"
              label="IBAN"
              name="IBAN"
              type="text"
              required
              placeholder="Enter IBAN"
              value={values.IBAN}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.IBAN && errors.IBAN}
              touched={touched.IBAN}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className="p-3 focus:outline-none"
              label="Balance"
              name="Balance"
              type="number"
              required
              placeholder="Enter balance"
              value={values.Balance}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.Balance && errors.Balance}
              touched={touched.Balance}
            />

            <div className="space-y-2">
              <FormField
                className="p-3 focus:outline-none"
                label="Currency"
                name="CurrencyID"
                type="select"
                required
                value={values.CurrencyID}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.CurrencyID && errors.CurrencyID}
                touched={touched.CurrencyID}
                options={currencies.map((currency) => ({
                  value: currency.ID,
                  label: currency.Code + ' - ' + currency.Name,
                }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting
                ? 'Saving...'
                : initialData
                ? 'Update Bank'
                : 'Save Bank'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default BankForm;
