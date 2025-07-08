import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import {
  addEmployee,
  updateEmployee,
} from '../../features/settings/employeeSlice';
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
  MiddleName: Yup.string().max(
    100,
    'Middle name must be at most 100 characters'
  ),
  Birthday: Yup.date()
    .required('Birth date is required')
    .max(new Date(), 'Birth date cannot be in the future'),
  Gender: Yup.string().required('Gender is required'),
  civilStatus: Yup.string().required('Civil status is required'),
  StreetAddress: Yup.string()
    .required('Address is required')
    .max(200, 'Address must be at most 200 characters'),
  MobileNumber: Yup.string().required('Contact number is required'),
  EmailAddress: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  DepartmentID: Yup.number().required('Department is required'),
  PositionID: Yup.string().required('Position is required'),
  EmploymentStatusID: Yup.string().required('Employment status is required'),
  DateHired: Yup.date().required('Date hired is required'),
  TIN: Yup.string().required('TIN is required'),
  SSS: Yup.string().required('SSS number is required'),
  Philhealth: Yup.string().required('PhilHealth number is required'),
  Pagibig: Yup.string().required('Pag-IBIG number is required'),
  Active: Yup.string().required('Status is required'),
});

function EmployeeForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchPositions());
    dispatch(fetchEmploymentStatuses());
  }, [dispatch]);

  const { departments } = useSelector((state) => state.departments);
  const isLoadingDepartments = useSelector(
    (state) => state.departments.isLoading
  );
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

  const { employmentStatuses } = useSelector(
    (state) => state.employmentStatuses
  );
  const isLoadingEmploymentStatuses = useSelector(
    (state) => state.employmentStatuses.isLoading
  );
  const employmentStatusOptions = employmentStatuses.map((status) => ({
    value: status.ID,
    label: status.Name,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = initialData
    ? { ...initialData }
    : {
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

    const departmentName =
      departments.find((d) => d.value === Number(values.DepartmentID))?.label ||
      '';
    const submissionData = {
      ...values,
      DepartmentID: Number(values.DepartmentID),
      departmentName,
    };

    const action = initialData
      ? updateEmployee({
          ...submissionData,
          id: initialData.id,
          employeeCode: initialData.employeeCode,
        })
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
        <Form className="space-y-6">
          {/* Section I: Personal Details */}
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold mb-4">I. Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <FormField
                label="First name"
                name="FirstName"
                type="text"
                required
                value={values.FirstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.FirstName}
                touched={touched.FirstName}
              />
              <FormField
                label="Middle name"
                name="MiddleName"
                type="text"
                value={values.MiddleName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.MiddleName}
                touched={touched.MiddleName}
              />
              <FormField
                label="Last name"
                name="LastName"
                type="text"
                required
                value={values.LastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.LastName}
                touched={touched.LastName}
              />
              <FormField
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
                label="Birthdate"
                name="Birthday"
                type="date"
                required
                value={values.Birthday}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Birthday}
                touched={touched.Birthday}
              />
            </div>
          </div>

          {/* Section II: Address & Contact Details */}
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold mb-4">
              II. Address & Contact Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Address Information</h3>
                <FormField
                  label="Region"
                  name="Region"
                  type="select"
                  options={[]}
                  value={values.Region || 'REGION VI (WESTERN VISAYAS)'}
                  onChange={handleChange}
                  readOnly
                />
                <FormField
                  label="Province"
                  name="Province"
                  type="select"
                  options={[]}
                  value={values.Province || 'AKLAN'}
                  onChange={handleChange}
                  readOnly
                />
                <FormField
                  label="Municipality"
                  name="Municipality"
                  type="select"
                  options={[]}
                  value={values.Municipality || 'ALTAVAS'}
                  onChange={handleChange}
                  readOnly
                />
                <FormField
                  label="Barangay"
                  name="Barangay"
                  type="select"
                  options={[]}
                  value={values.Barangay || 'Cabangila'}
                  onChange={handleChange}
                  readOnly
                />
                <FormField
                  label="Street Address"
                  name="StreetAddress"
                  type="text"
                  required
                  value={values.StreetAddress || '242'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.StreetAddress}
                  touched={touched.StreetAddress}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Nationality"
                    name="Nationality"
                    type="text"
                    value={values.Nationality || 'Filipino'}
                    onChange={handleChange}
                    readOnly
                  />
                  <FormField
                    label="Zip Code"
                    name="ZipCode"
                    type="text"
                    value={values.ZipCode || '24'}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <FormField
                  label="Mobile Number"
                  name="MobileNumber"
                  type="text"
                  required
                  value={values.MobileNumber || '+639123456789'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.MobileNumber}
                  touched={touched.MobileNumber}
                />
                <FormField
                  label="Email"
                  name="EmailAddress"
                  type="email"
                  required
                  value={values.EmailAddress || 'juandelacruz@gmail.com'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.EmailAddress}
                  touched={touched.EmailAddress}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Emergency Contact"
                    name="EmergencyContact"
                    type="text"
                    value={values.EmergencyContact || 'Maria'}
                    onChange={handleChange}
                    readOnly
                  />
                  <FormField
                    label="Emergency Number"
                    name="EmergencyNumber"
                    type="text"
                    value={values.EmergencyNumber || '+639669388800'}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section III: Employment and IDs */}
          <div className="pb-4">
            <h2 className="text-lg font-semibold mb-4">
              III. Employment and IDs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="ID Number"
                    name="IDNumber"
                    type="text"
                    value={values.IDNumber || '1'}
                    onChange={handleChange}
                    readOnly
                  />
                  <FormField
                    label="TIN"
                    name="TIN"
                    type="text"
                    required
                    value={values.TIN || '1241'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.TIN}
                    touched={touched.TIN}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="PAG-IBIG"
                    name="Pagibig"
                    type="text"
                    required
                    value={values.Pagibig || '636'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.Pagibig}
                    touched={touched.Pagibig}
                  />
                  <FormField
                    label="SSS"
                    name="SSS"
                    type="text"
                    required
                    value={values.SSS || '1245'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.SSS}
                    touched={touched.SSS}
                  />
                </div>
                <FormField
                  label="Philhealth"
                  name="Philhealth"
                  type="text"
                  required
                  value={values.Philhealth || '6341'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.Philhealth}
                  touched={touched.Philhealth}
                />
                <FormField
                  label="Department"
                  name="DepartmentID"
                  type="select"
                  required
                  value={values.DepartmentID || 'Office of the Mayor'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.DepartmentID}
                  touched={touched.DepartmentID}
                  options={departmentOptions}
                  disabled={isLoadingDepartments}
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Date Hired"
                    name="DateHired"
                    type="date"
                    required
                    value={values.DateHired || '2024-06-10'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.DateHired}
                    touched={touched.DateHired}
                  />
                  <FormField
                    label="Employment Status"
                    name="EmploymentStatusID"
                    type="select"
                    required
                    value={values.EmploymentStatusID || 'Active'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.EmploymentStatusID}
                    touched={touched.EmploymentStatusID}
                    options={employmentStatusOptions}
                    disabled={isLoadingEmploymentStatuses}
                  />
                </div>
                <FormField
                  label="Employment Status Date"
                  name="EmploymentStatusDate"
                  type="date"
                  value={values.EmploymentStatusDate || '2024-06-10'}
                  onChange={handleChange}
                  readOnly
                />
                <FormField
                  label="Position"
                  name="PositionID"
                  type="select"
                  required
                  value={values.PositionID || 'Mayor'}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.PositionID}
                  touched={touched.PositionID}
                  options={positionOptions}
                  disabled={isLoadingPositions}
                />

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-end">
                    <button type="button" className="btn btn-outline">
                      Choose
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {values.FirstName || 'Juan'},{' '}
                    {values.MiddleName || 'Santos'},{' '}
                    {values.LastName || 'Dela Cruz'} - {values.TIN || '1241'} -{' '}
                    {values.DepartmentID || 'Office of the Mayor'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
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

export default EmployeeForm;
