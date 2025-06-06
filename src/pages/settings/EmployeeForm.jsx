import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { addEmployee, updateEmployee } from '../../features/settings/employeeSlice';

// Mock data for dropdowns
const departments = [
  { value: 1, label: 'Office of the Mayor' },
  { value: 2, label: 'Accounting Department' },
  { value: 3, label: 'Treasury Department' },
  { value: 4, label: 'IT Department' },
];

const positions = [
  { value: 'Administrative Officer III', label: 'Administrative Officer III' },
  { value: 'Administrative Officer IV', label: 'Administrative Officer IV' },
  { value: 'Department Head I', label: 'Department Head I' },
  { value: 'Department Head II', label: 'Department Head II' },
];

const employmentStatuses = [
  { value: 'Regular', label: 'Regular' },
  { value: 'Casual', label: 'Casual' },
  { value: 'Job Order', label: 'Job Order' },
  { value: 'Contract of Service', label: 'Contract of Service' },
];

// Validation schema
const employeeSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required')
    .max(100, 'First name must be at most 100 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .max(100, 'Last name must be at most 100 characters'),
  middleName: Yup.string()
    .max(100, 'Middle name must be at most 100 characters'),
  birthDate: Yup.date()
    .required('Birth date is required')
    .max(new Date(), 'Birth date cannot be in the future'),
  gender: Yup.string()
    .required('Gender is required'),
  civilStatus: Yup.string()
    .required('Civil status is required'),
  address: Yup.string()
    .required('Address is required')
    .max(200, 'Address must be at most 200 characters'),
  contactNumber: Yup.string()
    .required('Contact number is required')
    .matches(/^[0-9+\-() ]+$/, 'Invalid contact number format'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  departmentId: Yup.number()
    .required('Department is required'),
  position: Yup.string()
    .required('Position is required'),
  employmentStatus: Yup.string()
    .required('Employment status is required'),
  dateHired: Yup.date()
    .required('Date hired is required'),
  tin: Yup.string()
    .required('TIN is required')
    .matches(/^\d{3}-\d{3}-\d{3}-\d{3}$/, 'Invalid TIN format (e.g., 123-456-789-000)'),
  sssNumber: Yup.string()
    .required('SSS number is required')
    .matches(/^\d{2}-\d{7}-\d{1}$/, 'Invalid SSS number format (e.g., 12-3456789-0)'),
  philHealthNumber: Yup.string()
    .required('PhilHealth number is required')
    .matches(/^\d{2}-\d{9}-\d{1}$/, 'Invalid PhilHealth number format (e.g., 12-345678901-2)'),
  pagIbigNumber: Yup.string()
    .required('Pag-IBIG number is required')
    .matches(/^\d{4}-\d{4}-\d{4}$/, 'Invalid Pag-IBIG number format (e.g., 1234-5678-9012)'),
  status: Yup.string()
    .required('Status is required'),
});

function EmployeeForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = initialData ? { ...initialData } : {
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    gender: '',
    civilStatus: '',
    address: '',
    contactNumber: '',
    email: '',
    departmentId: '',
    position: '',
    employmentStatus: '',
    dateHired: new Date().toISOString().split('T')[0],
    tin: '',
    sssNumber: '',
    philHealthNumber: '',
    pagIbigNumber: '',
    status: 'Active',
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    
    const departmentName = departments.find(d => d.value === Number(values.departmentId))?.label || '';
    const submissionData = {
      ...values,
      departmentId: Number(values.departmentId),
      departmentName,
    };
    
    const action = initialData 
      ? updateEmployee({ ...submissionData, id: initialData.id, employeeCode: initialData.employeeCode })
      : addEmployee(submissionData);
    
    dispatch(action)
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting employee:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={employeeSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, isValid }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Last Name"
              name="lastName"
              type="text"
              required
              placeholder="Enter last name"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.lastName}
              touched={touched.lastName}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="First Name"
              name="firstName"
              type="text"
              required
              placeholder="Enter first name"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.firstName}
              touched={touched.firstName}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Middle Name"
              name="middleName"
              type="text"
              placeholder="Enter middle name"
              value={values.middleName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.middleName}
              touched={touched.middleName}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Birth Date"
              name="birthDate"
              type="date"
              required
              value={values.birthDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.birthDate}
              touched={touched.birthDate}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Gender"
              name="gender"
              type="select"
              required
              value={values.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.gender}
              touched={touched.gender}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
              ]}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Civil Status"
              name="civilStatus"
              type="select"
              required
              value={values.civilStatus}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.civilStatus}
              touched={touched.civilStatus}
              options={[
                { value: 'Single', label: 'Single' },
                { value: 'Married', label: 'Married' },
                { value: 'Widowed', label: 'Widowed' },
                { value: 'Separated', label: 'Separated' },
              ]}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Department"
              name="departmentId"
              type="select"
              required
              value={values.departmentId}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.departmentId}
              touched={touched.departmentId}
              options={departments}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Position"
              name="position"
              type="select"
              required
              value={values.position}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.position}
              touched={touched.position}
              options={positions}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Employment Status"
              name="employmentStatus"
              type="select"
              required
              value={values.employmentStatus}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.employmentStatus}
              touched={touched.employmentStatus}
              options={employmentStatuses}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Date Hired"
              name="dateHired"
              type="date"
              required
              value={values.dateHired}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.dateHired}
              touched={touched.dateHired}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <FormField
              className='p-3 focus:outline-none'
              label="SSS Number"
              name="sssNumber"
              type="text"
              required
              placeholder="12-3456789-0"
              value={values.sssNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.sssNumber}
              touched={touched.sssNumber}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="PhilHealth Number"
              name="philHealthNumber"
              type="text"
              required
              placeholder="12-345678901-2"
              value={values.philHealthNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.philHealthNumber}
              touched={touched.philHealthNumber}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Pag-IBIG Number"
              name="pagIbigNumber"
              type="text"
              required
              placeholder="1234-5678-9012"
              value={values.pagIbigNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.pagIbigNumber}
              touched={touched.pagIbigNumber}
            />
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

export default EmployeeForm;