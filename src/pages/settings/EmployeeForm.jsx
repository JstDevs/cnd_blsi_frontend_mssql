import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { addEmployee, updateEmployee } from '../../features/settings/employeeSlice';
import { fetchDepartments } from '../../features/settings/departmentSlice';
import { fetchPositions } from '../../features/settings/positionSlice';
import { fetchEmploymentStatuses } from '../../features/settings/employmentStatusSlice';

// Mock data for dropdowns
// const departments = [
//   { value: '1', label: 'Office of the Mayor' },
//   { value: '2', label: 'Accounting Department' },
//   { value: '3', label: 'Treasury Department' },
//   { value: '4', label: 'IT Department' },
// ];

// const positions = [
//   { value: '1', label: 'Administrative Officer III' },
//   { value: '2', label: 'Administrative Officer IV' },
//   { value: '3', label: 'Department Head I' },
//   { value: '4', label: 'Department Head II' },
// ];

// const employmentStatuses = [
//   { value: '1', label: 'Regular' },
//   { value: '2', label: 'Casual' },
//   { value: '3', label: 'Job Order' },
//   { value: '4', label: 'Contract of Service' },
// ];

// Validation schema
const employeeSchema = Yup.object().shape({
  FirstName: Yup.string()
    .required('First name is required')
    .max(100, 'First name must be at most 100 characters'),
  LastName: Yup.string()
    .required('Last name is required')
    .max(100, 'Last name must be at most 100 characters'),
  MiddleName: Yup.string()
    .max(100, 'Middle name must be at most 100 characters'),
  Birthday: Yup.date()
    .required('Birth date is required')
    .max(new Date(), 'Birth date cannot be in the future'),
  Gender: Yup.string()
    .required('Gender is required'),
  civilStatus: Yup.string()
    .required('Civil status is required'),
  StreetAddress: Yup.string()
    .required('Address is required')
    .max(200, 'Address must be at most 200 characters'),
  MobileNumber: Yup.string()
    .required('Contact number is required'),
  EmailAddress: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  DepartmentID: Yup.number()
    .required('Department is required'),
  PositionID: Yup.string()
    .required('Position is required'),
  EmploymentStatusID: Yup.string()
    .required('Employment status is required'),
  DateHired: Yup.date()
    .required('Date hired is required'),
  TIN: Yup.string()
    .required('TIN is required'),
  SSS: Yup.string()
    .required('SSS number is required'),
  Philhealth: Yup.string()
    .required('PhilHealth number is required'),
  Pagibig: Yup.string()
    .required('Pag-IBIG number is required'),
  Active: Yup.string()
    .required('Status is required'),
});

function EmployeeForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchPositions());
    dispatch(fetchEmploymentStatuses());
  }, [dispatch]);

  const { departments } = useSelector((state) => state.departments);
  const isLoadingDepartments = useSelector((state) => state.departments.isLoading);
  const departmentOptions = departments.map((dept) => ({
    value: dept.ID,
    label: dept.Name,
  }));

  const { positions } = useSelector((state) => state.positions);
  const isLoadingPositions = useSelector((state) => state.positions.isLoading);
  const positionOptions = positions.map((pos) => ({
    value: pos.ID,
    label: pos.Name,
  }));

  const { employmentStatuses } = useSelector((state) => state.employmentStatuses);
  const isLoadingEmploymentStatuses = useSelector((state) => state.employmentStatuses.isLoading);
  const employmentStatusOptions = employmentStatuses.map((status) => ({
    value: status.ID,
    label: status.Name,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = initialData ? { ...initialData } : {
    FirstName: '',
    LastName: '',
    MiddleName: '',
    Birthday: '',
    Gender: '',
    civilStatus: '',
    StreetAddress: '',
    MobileNumber: '',
    EmailAddress: '',
    DepartmentID: '',
    PositionID: '',
    EmploymentStatusID: '',
    DateHired: new Date().toISOString().split('T')[0],
    TIN: '',
    SSS: '',
    Philhealth: '',
    Pagibig: '',
    Active: 'Active',
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);

    const departmentName = departments.find(d => d.value === Number(values.DepartmentID))?.label || '';
    const submissionData = {
      ...values,
      DepartmentID: Number(values.DepartmentID),
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
              name="LastName"
              type="text"
              required
              placeholder="Enter last name"
              value={values.LastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.LastName}
              touched={touched.LastName}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="First Name"
              name="FirstName"
              type="text"
              required
              placeholder="Enter first name"
              value={values.FirstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.FirstName}
              touched={touched.FirstName}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Middle Name"
              name="MiddleName"
              type="text"
              placeholder="Enter middle name"
              value={values.MiddleName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.MiddleName}
              touched={touched.MiddleName}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Birth Date"
              name="Birthday"
              type="date"
              required
              value={values.Birthday}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Birthday}
              touched={touched.Birthday}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Gender"
              name="Gender"
              type="select"
              required
              value={values.Gender}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Gender}
              touched={touched.Gender}
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
            name="StreetAddress"
            type="textarea"
            required
            placeholder="Enter complete address"
            value={values.StreetAddress}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.StreetAddress}
            touched={touched.StreetAddress}
            rows={2}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Contact Number"
              name="MobileNumber"
              type="text"
              required
              placeholder="Enter contact number"
              value={values.MobileNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.MobileNumber}
              touched={touched.MobileNumber}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Email"
              name="EmailAddress"
              type="email"
              required
              placeholder="Enter email address"
              value={values.EmailAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.EmailAddress}
              touched={touched.EmailAddress}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Department"
              name="DepartmentID"
              type="select"
              required
              value={values.DepartmentID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.DepartmentID}
              touched={touched.DepartmentID}
              options={departmentOptions}
              disabled={isLoadingDepartments}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Position"
              name="PositionID"
              type="select"
              required
              value={values.PositionID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.PositionID}
              touched={touched.PositionID}
              options={positionOptions}
              disabled={isLoadingPositions}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="Employment Status"
              name="EmploymentStatusID"
              type="select"
              required
              value={values.EmploymentStatusID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.EmploymentStatusID}
              touched={touched.EmploymentStatusID}
              options={employmentStatusOptions}
              disabled={isLoadingEmploymentStatuses}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Date Hired"
              name="DateHired"
              type="date"
              required
              value={values.DateHired}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.DateHired}
              touched={touched.DateHired}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="TIN"
              name="TIN"
              type="text"
              required
              placeholder="123-456-789-000"
              value={values.TIN}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.TIN}
              touched={touched.TIN}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="SSS Number"
              name="SSS"
              type="text"
              required
              placeholder="12-3456789-0"
              value={values.SSS}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.SSS}
              touched={touched.SSS}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              className='p-3 focus:outline-none'
              label="PhilHealth Number"
              name="Philhealth"
              type="text"
              required
              placeholder="12-345678901-2"
              value={values.Philhealth}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Philhealth}
              touched={touched.Philhealth}
            />
            
            <FormField
              className='p-3 focus:outline-none'
              label="Pag-IBIG Number"
              name="Pagibig"
              type="text"
              required
              placeholder="1234-5678-9012"
              value={values.Pagibig}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Pagibig}
              touched={touched.Pagibig}
            />
          </div>
          
          <FormField
            className='p-3 focus:outline-none'
            label="Status"
            name="Active"
            type="select"
            required
            value={values.Active}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Active}
            touched={touched.Active}
            options={[
              { value: '1', label: 'Active' },
              { value: '0', label: 'Inactive' },
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