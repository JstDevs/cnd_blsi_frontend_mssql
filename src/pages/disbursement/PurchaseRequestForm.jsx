import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';

const PURCHASE_REQUEST_SCHEMA = Yup.object().shape({
  department: Yup.string().required('Department is required'),
  section: Yup.string().required('Section is required'),
  chargeAccount: Yup.string().required('Charge Account is required'),
  prNumber: Yup.string().required('PR Number is required'),
  saiNumber: Yup.string().required('SAI Number is required'),
  alobsNumber: Yup.string().required('ALOBS Number is required'),
  date: Yup.date().required('Date is required'),
  fromDate: Yup.date().required('From Date is required'),
  toDate: Yup.date()
    .required('To Date is required')
    .min(Yup.ref('fromDate'), 'To Date must be after From Date'),
  purpose: Yup.string().required('Purpose is required'),
});

// Mock data for initial development
const departments = [
  { value: 'IT Department', label: 'IT Department' },
  { value: 'Engineering Department', label: 'Engineering Department' },
  { value: 'Accounting Department', label: 'Accounting Department' },
];

const sections = [
  { value: 'Section A', label: 'Section A' },
  { value: 'Section B', label: 'Section B' },
  { value: 'Section C', label: 'Section C' },
];

const chargeAccounts = [
  { value: 'Account 1', label: 'Account 1' },
  { value: 'Account 2', label: 'Account 2' },
  { value: 'Account 3', label: 'Account 3' },
];

function PurchaseRequestForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = initialData ? { ...initialData } : {
    department: '',
    section: '',
    chargeAccount: '',
    prNumber: '',
    saiNumber: '',
    alobsNumber: '',
    date: '',
    fromDate: '',
    toDate: '',
    purpose: '',
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
      validationSchema={PURCHASE_REQUEST_SCHEMA}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Department"
              name="department"
              type="select"
              required
              value={values.department}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.department}
              touched={touched.department}
              options={departments}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Section"
              name="section"
              type="select"
              required
              value={values.section}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.section}
              touched={touched.section}
              options={sections}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Charge Account"
              name="chargeAccount"
              type="select"
              required
              value={values.chargeAccount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.chargeAccount}
              touched={touched.chargeAccount}
              options={chargeAccounts}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="PR Number"
              name="prNumber"
              type="text"
              required
              value={values.prNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.prNumber}
              touched={touched.prNumber}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="SAI Number"
              name="saiNumber"
              type="text"
              required
              value={values.saiNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.saiNumber}
              touched={touched.saiNumber}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="ALOBS Number"
              name="alobsNumber"
              type="text"
              required
              value={values.alobsNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.alobsNumber}
              touched={touched.alobsNumber}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Date"
              name="date"
              type="date"
              required
              value={values.date}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.date}
              touched={touched.date}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="From Date"
              name="fromDate"
              type="date"
              required
              value={values.fromDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fromDate}
              touched={touched.fromDate}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="To Date"
              name="toDate"
              type="date"
              required
              value={values.toDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.toDate}
              touched={touched.toDate}
            />
          </div>

          <FormField
            className='p-3 focus:outline-none'
            label="Purpose"
            name="purpose"
            type="textarea"
            required
            value={values.purpose}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.purpose}
            touched={touched.purpose}
            rows={4}
          />

          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Save</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default PurchaseRequestForm; 