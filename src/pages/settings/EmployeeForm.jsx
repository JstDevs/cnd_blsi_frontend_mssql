import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import {
  addEmployee,
  fetchEmployees,
  updateEmployee,
} from '../../features/settings/employeeSlice';
import { fetchDepartments } from '../../features/settings/departmentSlice';
import { fetchPositions } from '../../features/settings/positionSlice';
import { fetchEmploymentStatuses } from '../../features/settings/employmentStatusSlice';
import { fetchRegions } from '@/features/settings/regionsSlice';
import { fetchProvinces } from '@/features/settings/provincesSlice';
import { fetchMunicipalities } from '@/features/settings/municipalitiesSlice';
import { fetchBarangays } from '@/features/settings/barangaysSlice';
import { fetchNationalities } from '@/features/settings/nationalitiesSlice';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import toast from 'react-hot-toast';

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
  // civilStatus: Yup.string().required('Civil status is required'),
  StreetAddress: Yup.string()
    .required('Address is required')
    .max(200, 'Address must be at most 200 characters'),
  MobileNumber: Yup.string().required('Contact number is required'),
  EmailAddress: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  IDNumber: Yup.number(),
  DepartmentID: Yup.number().required('Department is required'),
  PositionID: Yup.string().required('Position is required'),
  NationalityID: Yup.string().required('Nationality is required'),
  EmploymentStatusID: Yup.string().required('Employment status is required'),
  DateHired: Yup.date().required('Date hired is required'),
  TIN: Yup.string().matches(/^\d{14}$/, 'TIN must be exactly 14 digits'),
  GSIS: Yup.string(),
  Philhealth: Yup.string(),
  Pagibig: Yup.string(),
  Active: Yup.string().required('Status is required'),
  ZIPCode: Yup.string().max(6, 'ZIP code must be at most 6 characters'),
  Region: Yup.string().required('Region is required'),
  Province: Yup.string().required('Province is required'),
  Municipality: Yup.string().required('Municipality is required'),
  Barangay: Yup.string().required('Barangay is required'),
});

function EmployeeForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchPositions());
    dispatch(fetchEmploymentStatuses());
    dispatch(fetchRegions());
    dispatch(fetchProvinces());
    dispatch(fetchMunicipalities());
    dispatch(fetchBarangays());
    dispatch(fetchNationalities());
  }, [dispatch]);

  const { regions } = useSelector((state) => state.regions);
  const { provinces } = useSelector((state) => state.provinces);
  const { municipalities } = useSelector((state) => state.municipalities);
  const { barangays } = useSelector((state) => state.barangays);
  const { nationalities } = useSelector((state) => state.nationalities);

  const nationalitiesOptions = nationalities?.map((Nationality) => ({
    value: Nationality.ID,
    label: Nationality.Name,
  }));
  const regionOptions = regions.map((r) => ({
    value: r.ID.toString(),
    label: r.Name,
  }));

  const provinceOptions = provinces.map((p) => ({
    value: p.ID.toString(),
    label: p.Name,
  }));

  const municipalityOptions = municipalities.map((m) => ({
    value: m.ID.toString(),
    label: m.Name,
  }));

  const barangayOptions = barangays.map((b) => ({
    value: b.ID.toString(),
    label: b.Name,
  }));
  const { departments, isLoading: isLoadingDepartments } = useSelector(
    (state) => state.departments
  );
  const departmentOptions = departments.map((dept) => ({
    value: dept.ID,
    label: dept.Name,
  }));

  const { positions, isLoading: isLoadingPositions } = useSelector(
    (state) => state.positions
  );
  const positionOptions = positions.map((pos) => ({
    value: pos.ID,
    label: pos.Name,
  }));

  const { employmentStatuses, isLoading: isLoadingEmploymentStatus } =
    useSelector((state) => state.employmentStatuses);
  const employmentStatusOptions = employmentStatuses.map((status) => ({
    value: status.ID,
    label: status.Name,
  }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(initialData);
  const initialValues = initialData
    ? { ...initialData }
    : {
        FirstName: '',
        LastName: '',
        MiddleName: '',
        Birthday: '',
        Gender: '',
        // civilStatus: '',
        StreetAddress: '',
        MobileNumber: '',
        EmailAddress: '',
        DepartmentID: '',
        PositionID: '',
        IDNumber: '',
        NationalityID: '',
        Nationality: '',
        EmploymentStatusID: '',
        DateHired: new Date().toISOString().split('T')[0],
        TIN: '',
        GSIS: '',
        Philhealth: '',
        Pagibig: '',
        Active: 1,
        ZIPCode: '',
        Region: '',
        Province: '',
        Municipality: '',
        Barangay: '',
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
        initialData
          ? toast.success('Employee updated successfully.')
          : toast.success('Employee added successfully.');
        dispatch(fetchEmployees());
      })
      .catch((error) => {
        console.error('Error submitting employee:', error);
        toast.error('Failed to submit employee. Please try again.');
      })
      .finally(() => {
        onClose();
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
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isValid,
        setFieldValue,
        submitCount,
      }) => {
        useEffect(() => {
          const selectedBarangay = barangays.find(
            (b) => b.ID.toString() === values.Barangay
          );
          if (selectedBarangay) {
            const { MunicipalityCode, ProvinceCode, RegionCode } =
              selectedBarangay;
            if (MunicipalityCode)
              setFieldValue('Municipality', MunicipalityCode);
            if (ProvinceCode) setFieldValue('Province', ProvinceCode);
            if (RegionCode) setFieldValue('Region', RegionCode);
          }
        }, [values.Barangay]);

        useEffect(() => {
          const selectedMunicipality = municipalities.find(
            (m) => m.ID.toString() === values.Municipality
          );
          if (selectedMunicipality) {
            const { ProvinceCode, RegionCode } = selectedMunicipality;
            if (ProvinceCode) setFieldValue('Province', ProvinceCode);
            if (RegionCode) setFieldValue('Region', RegionCode);
          }
        }, [values.Municipality]);

        useEffect(() => {
          const selectedProvince = provinces.find(
            (p) => p.ID.toString() === values.Province
          );
          if (selectedProvince) {
            const { RegionCode } = selectedProvince;
            if (RegionCode) setFieldValue('Region', RegionCode);
          }
        }, [values.Province]);
        return (
          <Form className="space-y-6">
            {/* Section I: Personal Details */}
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-semibold mb-4">
                I. Personal Details
              </h2>
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
                    required
                    options={regionOptions}
                    value={values.Region || ''}
                    onChange={handleChange}
                  />

                  <FormField
                    label="Province"
                    name="Province"
                    type="select"
                    required
                    options={provinceOptions}
                    value={values.Province || ''}
                    onChange={handleChange}
                  />

                  <FormField
                    label="Municipality"
                    name="Municipality"
                    type="select"
                    required
                    options={municipalityOptions}
                    value={values.Municipality || ''}
                    onChange={handleChange}
                  />

                  <FormField
                    label="Barangay"
                    name="Barangay"
                    type="select"
                    required
                    options={barangayOptions}
                    value={values.Barangay || ''}
                    onChange={handleChange}
                  />
                  <FormField
                    label="Street Address"
                    name="StreetAddress"
                    type="text"
                    required
                    value={values.StreetAddress || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.StreetAddress}
                    touched={touched.StreetAddress}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Contact Information</h3>

                  <SearchableDropdown
                    label="Nationality"
                    name="NationalityID"
                    type="select"
                    options={nationalitiesOptions}
                    required
                    placeholder="Select Nationality"
                    onSelect={(value) => {
                      const selectedOption = nationalitiesOptions.find(
                        (option) => option.value === value
                      );
                      setFieldValue('NationalityID', value || '');
                      setFieldValue('Nationality', selectedOption?.label || '');
                    }}
                    className="w-full"
                    selectedValue={values.NationalityID}
                    error={errors.Nationality}
                    touched={touched.Nationality}
                  />
                  <FormField
                    label="Zip Code"
                    name="ZIPCode"
                    type="text"
                    value={values.ZIPCode || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.ZIPCode}
                    touched={touched.ZIPCode}
                  />
                  <FormField
                    label="Mobile Number"
                    name="MobileNumber"
                    type="text"
                    required
                    value={values.MobileNumber || ''}
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
                    value={values.EmailAddress || ''}
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
                      value={values.EmergencyContact || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.EmergencyContact}
                      touched={touched.EmergencyContact}
                    />
                    <FormField
                      label="Emergency Number"
                      name="EmergencyNumber"
                      type="text"
                      value={values.EmergencyNumber || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.EmergencyNumber}
                      touched={touched.EmergencyNumber}
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
                      value={values.IDNumber || ''}
                      onChange={handleChange}
                    />
                    <FormField
                      label="TIN"
                      name="TIN"
                      type="text"
                      value={values.TIN || ''}
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
                      value={values.Pagibig || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.Pagibig}
                      touched={touched.Pagibig}
                    />
                    <FormField
                      label="GSIS"
                      name="GSIS"
                      type="text"
                      value={values.GSIS || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.GSIS}
                      touched={touched.GSIS}
                    />
                  </div>
                  <FormField
                    label="Philhealth"
                    name="Philhealth"
                    type="text"
                    value={values.Philhealth || ''}
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
                    value={values.DepartmentID || ''}
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
                      value={values.DateHired || ''}
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
                      value={values.EmploymentStatusID || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.EmploymentStatusID}
                      touched={touched.EmploymentStatusID}
                      options={employmentStatusOptions}
                      disabled={isLoadingEmploymentStatus}
                    />
                  </div>
                  <FormField
                    label="Employment Status Date"
                    name="EmploymentStatusDate"
                    type="date"
                    value={values.EmploymentStatusDate || ''}
                    onChange={handleChange}
                    readOnly
                  />
                  <FormField
                    label="Position"
                    name="PositionID"
                    type="select"
                    required
                    value={values.PositionID || ''}
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
                      {[values.FirstName, values.MiddleName, values.LastName]
                        .filter(Boolean)
                        .join(' ')}

                      {values.TIN && ` - ${values.TIN}`}
                      {values.DepartmentID && ` - ${values.DepartmentID}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
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
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Save'}
              </button>
            </div>
            {submitCount > 0 && Object.keys(errors).length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                <h3 className="text-sm font-medium text-red-800">
                  Please fix the following errors:
                </h3>
                <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
                  {Object.entries(errors).map(([fieldName, errorMessage]) => (
                    <li key={fieldName}>{errorMessage}</li>
                  ))}
                </ul>
              </div>
            )}
          </Form>
        );
      }}
    </Formik>
  );
}

export default EmployeeForm;
