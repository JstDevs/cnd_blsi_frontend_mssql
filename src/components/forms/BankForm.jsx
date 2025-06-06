import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { addBank, updateBank } from '../../features/settings/bankSlice';

// Initial currency options
const initialCurrencyOptions = [
  { value: 'PHP', label: 'Philippine Peso (PHP)' },
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'JPY', label: 'Japanese Yen (JPY)' },
];

// Validation schema
const bankSchema = Yup.object().shape({
  branchCode: Yup.string()
    .required('Branch code is required')
    .max(20, 'Branch code must be at most 20 characters'),
  branch: Yup.string()
    .required('Branch is required')
    .max(100, 'Branch name must be at most 100 characters'),
  name: Yup.string()
    .required('Name is required')
    .max(100, 'Name must be at most 100 characters'),
  address: Yup.string()
    .required('Address is required')
    .max(200, 'Address must be at most 200 characters'),
  accountNumber: Yup.string()
    .required('Account number is required')
    .matches(/^[0-9-]+$/, 'Invalid account number format'),
  swiftCode: Yup.string()
    .required('Swift code is required')
    .max(11, 'SWIFT code must be at most 11 characters')
    .matches(/^[A-Z0-9]+$/, 'SWIFT code must contain only uppercase letters and numbers'),
  iban: Yup.string()
    .required('IBAN is required')
    .max(34, 'IBAN must be at most 34 characters')
    .matches(/^[A-Z0-9]+$/, 'IBAN must contain only uppercase letters and numbers'),
  balance: Yup.number()
    .required('Balance is required')
    .min(0, 'Balance cannot be negative'),
  currency: Yup.string()
    .required('Currency is required'),
  customCurrencyCode: Yup.string()
    .when('currency', {
      is: 'custom',
      then: (schema) => schema.required('Currency code is required').max(10, 'Currency code must be at most 10 characters'),
      otherwise: (schema) => schema.notRequired(),
    }),
  customCurrencyName: Yup.string()
    .when('currency', {
      is: 'custom',
      then: (schema) => schema.required('Currency name is required').max(50, 'Currency name must be at most 50 characters'),
      otherwise: (schema) => schema.notRequired(),
    }),
  status: Yup.string()
    .required('Status is required'),
});

function BankForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currencyOptions, setCurrencyOptions] = useState(initialCurrencyOptions);
  const [showCustomCurrencyForm, setShowCustomCurrencyForm] = useState(false);

  const initialValues = initialData ? { ...initialData } : {
    branchCode: '',
    branch: '',
    name: '',
    address: '',
    accountNumber: '',
    swiftCode: '',
    iban: '',
    balance: '',
    currency: '',
    customCurrencyCode: '',
    customCurrencyName: '',
    status: 'Active',
  };

  const handleAddCustomCurrency = (values, setFieldValue) => {
    const newCurrency = {
      value: values.customCurrencyCode,
      label: `${values.customCurrencyName} (${values.customCurrencyCode})`
    };
    
    setCurrencyOptions(prev => [...prev, newCurrency]);
    setFieldValue('currency', values.customCurrencyCode);
    setShowCustomCurrencyForm(false);
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    
    const bankData = {
      ...values,
      currency: values.currency === 'custom' ? values.customCurrencyCode : values.currency,
    };
    
    const action = initialData 
      ? updateBank({ ...bankData, id: initialData.id })
      : addBank(bankData);
    
    dispatch(action)
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting bank:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={bankSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, isValid, setFieldValue }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Branch Code"
              name="branchCode"
              type="text"
              required
              placeholder="Enter branch code"
              value={values.branchCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.branchCode}
              touched={touched.branchCode}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Branch"
              name="branch"
              type="text"
              required
              placeholder="Enter branch name"
              value={values.branch}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.branch}
              touched={touched.branch}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Name"
              name="name"
              type="text"
              required
              placeholder="Enter bank name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
            />
          </div>
          
          <FormField
            className='p-3 focus:outline-none'
            label="Address"
            name="address"
            type="textarea"
            required
            placeholder="Enter complete address"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.address}
            touched={touched.address}
            rows={2}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Account Number"
              name="accountNumber"
              type="text"
              required
              placeholder="Enter account number"
              value={values.accountNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.accountNumber}
              touched={touched.accountNumber}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="SWIFT Code"
              name="swiftCode"
              type="text"
              required
              placeholder="Enter SWIFT code"
              value={values.swiftCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.swiftCode}
              touched={touched.swiftCode}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="IBAN"
              name="iban"
              type="text"
              required
              placeholder="Enter IBAN"
              value={values.iban}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.iban}
              touched={touched.iban}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Balance"
              name="balance"
              type="number"
              required
              placeholder="Enter balance"
              value={values.balance}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.balance}
              touched={touched.balance}
            />
            
            <div className="space-y-2">
              <FormField
                className='p-3 focus:outline-none'
                label="Currency"
                name="currency"
                type="select"
                required
                value={values.currency}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value === 'custom') {
                    setShowCustomCurrencyForm(true);
                  }
                }}
                onBlur={handleBlur}
                error={errors.currency}
                touched={touched.currency}
                options={[
                  ...currencyOptions,
                  { value: 'custom', label: '+ Add Custom Currency' }
                ]}
              />
              
              {showCustomCurrencyForm && (
                <div className="p-4 border border-neutral-200 rounded-md space-y-4">
                  <h3 className="font-medium text-sm">Add Custom Currency</h3>
                  <FormField
                    className='p-3 focus:outline-none'
                    label="Currency Code"
                    name="customCurrencyCode"
                    type="text"
                    required
                    placeholder="Enter currency code (e.g., INR)"
                    value={values.customCurrencyCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.customCurrencyCode}
                    touched={touched.customCurrencyCode}
                  />
                  
                  <FormField
                    className='p-3 focus:outline-none'
                    label="Currency Name"
                    name="customCurrencyName"
                    type="text"
                    required
                    placeholder="Enter currency name (e.g., Indian Rupee)"
                    value={values.customCurrencyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.customCurrencyName}
                    touched={touched.customCurrencyName}
                  />
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCustomCurrencyForm(false)}
                      className="btn btn-outline btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddCustomCurrency(values, setFieldValue)}
                      className="btn btn-primary btn-sm"
                    >
                      Add Currency
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <FormField
              className='p-3 focus:outline-none'
              label="Status"
              name="status"
              type="select"
              required
              value={values.status}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.status}
              touched={touched.status}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
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
              {isSubmitting ? 'Saving...' : initialData ? 'Update Bank' : 'Save Bank'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default BankForm; 