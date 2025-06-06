import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { addVendor, updateVendor } from '../../features/settings/vendorSlice';

// Mock data for dropdowns
const categories = [
  { value: 'Office Supplies', label: 'Office Supplies' },
  { value: 'IT Equipment', label: 'IT Equipment' },
  { value: 'Construction Materials', label: 'Construction Materials' },
  { value: 'Medical Supplies', label: 'Medical Supplies' },
  { value: 'Services', label: 'Services' },
];

const banks = [
  { value: 'BDO', label: 'BDO' },
  { value: 'BPI', label: 'BPI' },
  { value: 'Metrobank', label: 'Metrobank' },
  { value: 'Landbank', label: 'Landbank' },
  { value: 'PNB', label: 'PNB' },
];

// Validation schema
const vendorSchema = Yup.object().shape({
  vendorName: Yup.string()
    .required('Vendor name is required')
    .max(100, 'Vendor name must be at most 100 characters'),
  address: Yup.string()
    .required('Address is required')
    .max(200, 'Address must be at most 200 characters'),
  contactPerson: Yup.string()
    .required('Contact person is required')
    .max(100, 'Contact person must be at most 100 characters'),
  contactNumber: Yup.string()
    .required('Contact number is required')
    .matches(/^[0-9+\-() ]+$/, 'Invalid contact number format'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  tin: Yup.string()
    .required('TIN is required')
    .matches(/^\d{3}-\d{3}-\d{3}-\d{3}$/, 'Invalid TIN format (e.g., 123-456-789-000)'),
  category: Yup.string()
    .required('Category is required'),
  accreditationDate: Yup.date()
    .required('Accreditation date is required'),
  accreditationExpiry: Yup.date()
    .required('Accreditation expiry is required')
    .min(Yup.ref('accreditationDate'), 'Expiry date must be after accreditation date'),
  bankAccount: Yup.string()
    .matches(/^[0-9-]+$/, 'Invalid bank account format'),
  bankName: Yup.string(),
  status: Yup.string()
    .required('Status is required'),
});

function VendorForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = initialData ? { ...initialData } : {
    vendorName: '',
    address: '',
    contactPerson: '',
    contactNumber: '',
    email: '',
    tin: '',
    category: '',
    accreditationDate: new Date().toISOString().split('T')[0],
    accreditationExpiry: '',
    bankAccount: '',
    bankName: '',
    status: 'Active',
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    
    const action = initialData 
      ? updateVendor({ ...values, id: initialData.id, vendorCode: initialData.vendorCode })
      : addVendor(values);
    
    dispatch(action)
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting vendor:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={vendorSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, isValid }) => (
        <Form className="space-y-4">
          <FormField
            className='p-3 focus:outline-none'
            label="Vendor Name"
            name="vendorName"
            type="text"
            required
            placeholder="Enter vendor name"
            value={values.vendorName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.vendorName}
            touched={touched.vendorName}
          />
          
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Contact Person"
              name="contactPerson"
              type="text"
              required
              placeholder="Enter contact person name"
              value={values.contactPerson}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.contactPerson}
              touched={touched.contactPerson}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Contact Number"
              name="contactNumber"
              type="text"
              required
              placeholder="Enter contact number"
              value={values.contactNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.contactNumber}
              touched={touched.contactNumber}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Email"
              name="email"
              type="email"
              required
              placeholder="Enter email address"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="TIN"
              name="tin"
              type="text"
              required
              placeholder="123-456-789-000"
              value={values.tin}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.tin}
              touched={touched.tin}
            />
          </div>
          
          <FormField
            className='p-3 focus:outline-none'
            label="Category"
            name="category"
            type="select"
            required
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.category}
            touched={touched.category}
            options={categories}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Accreditation Date"
              name="accreditationDate"
              type="date"
              required
              value={values.accreditationDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.accreditationDate}
              touched={touched.accreditationDate}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Accreditation Expiry"
              name="accreditationExpiry"
              type="date"
              required
              value={values.accreditationExpiry}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.accreditationExpiry}
              touched={touched.accreditationExpiry}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Bank Account"
              name="bankAccount"
              type="text"
              placeholder="Enter bank account number"
              value={values.bankAccount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.bankAccount}
              touched={touched.bankAccount}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Bank Name"
              name="bankName"
              type="select"
              value={values.bankName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.bankName}
              touched={touched.bankName}
              options={banks}
            />
          </div>
          
          <FormField
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

export default VendorForm;