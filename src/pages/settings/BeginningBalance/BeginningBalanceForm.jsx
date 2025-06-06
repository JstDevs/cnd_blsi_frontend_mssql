import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../../components/common/FormField';

const BEGINNING_BALANCE_SCHEMA = Yup.object().shape({
  fund: Yup.string().required('Fund is required'),
  beginningBalance: Yup.number()
    .typeError('Must be a number')
    .required('Beginning Balance is required')
    .min(0, 'Beginning Balance cannot be negative'),
});

const funds = [
  { value: 'General Fund', label: 'General Fund' },
  { value: 'Special Education Fund', label: 'Special Education Fund' },
  { value: 'Trust Fund', label: 'Trust Fund' },
];

function BeginningBalanceForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = initialData ? { ...initialData } : {
    fund: '',
    beginningBalance: '',
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    // TODO: Implement the actual submission logic
    console.log('Submitting values:', values);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={BEGINNING_BALANCE_SCHEMA}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Fund"
              name="fund"
              type="select"
              required
              value={values.fund}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fund}
              touched={touched.fund}
              options={funds}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Beginning Balance"
              name="beginningBalance"
              type="number"
              required
              value={values.beginningBalance}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.beginningBalance}
              touched={touched.beginningBalance}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Save</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default BeginningBalanceForm; 