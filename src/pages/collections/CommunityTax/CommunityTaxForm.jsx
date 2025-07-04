import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FileText, Calendar, MapPin, User, CreditCard } from 'lucide-react';
import FormField from '@/components/common/FormField';
import Button from '@/components/common/Button';
import numToWords from '@/components/helper/numToWords';
import { useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
// Validation schema
const validationSchema = Yup.object({
  // Certificate Information
  Year: Yup.number()
    .required('Year is required')
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  PlaceIssued: Yup.string()
    .required('Place of issue is required')
    .min(2, 'Place of issue must be at least 2 characters'),
  DateIssued: Yup.date()
    .required('Date issued is required')
    .max(new Date(), 'Date issued cannot be in the future'),
  CCNumber: Yup.string()
    .required('Certificate number is required')
    .min(3, 'Certificate number must be at least 3 characters'),
  TIN: Yup.string()
    .matches(/^[0-9-]*$/, 'TIN must contain only numbers and dashes')
    .nullable(),

  // Personal Information
  LastName: Yup.string()
    .required('LastName is required')
    .min(2, 'LastName must be at least 2 characters')
    .matches(
      /^[a-zA-Z\s-']+$/,
      'LastName can only contain letters, spaces, hyphens, and apostrophes'
    ),
  FirstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .matches(
      /^[a-zA-Z\s-']+$/,
      'First name can only contain letters, spaces, hyphens, and apostrophes'
    ),
  MiddleName: Yup.string()
    .matches(
      /^[a-zA-Z\s-']*$/,
      'Middle name can only contain letters, spaces, hyphens, and apostrophes'
    )
    .nullable(),
  Address: Yup.string()
    .required('Address is required')
    .min(10, 'Address must be at least 10 characters'),
  Citizenship: Yup.string().required('Citizenship is required'),
  ICRNo: Yup.string()
    .matches(/^[0-9-]*$/, 'ICR number must contain only numbers and dashes')
    .nullable(),
  PlaceOfBirth: Yup.string()
    .required('Place of birth is required')
    .min(2, 'Place of birth must be at least 2 characters'),
  BirthDate: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future')
    .test('age', 'Must be at least 18 years old', function (value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }),
  CivilStatus: Yup.string().required('Civil status is required'),
  Occupation: Yup.string()
    .required('Profession/Occupation is required')
    .min(2, 'Profession must be at least 2 characters'),
  Gender: Yup.string().required('Sex is required'),
  Height: Yup.number()
    .required('Height is required')
    .min(100, 'Height must be at least 100 cm')
    .max(250, 'Height must not exceed 250 cm'),
  Weight: Yup.number()
    .required('Weight is required')
    .min(30, 'Weight must be at least 30 kg')
    .max(300, 'Weight must not exceed 300 kg'),

  // Tax Information
  BasicTax: Yup.number()
    .required('Basic tax is required')
    .min(0, 'Basic tax cannot be negative')
    .max(10000, 'Basic tax cannot exceed ₱10,000'),
  BusinessEarnings: Yup.number()
    .min(0, 'Gross receipts cannot be negative')
    .nullable(),
  BusinessTaxDue: Yup.number()
    .min(0, 'Gross receipts tax cannot be negative')
    .nullable(),
  OccupationEarnings: Yup.number()
    .min(0, 'Salaries cannot be negative')
    .nullable(),
  OccupationTaxDue: Yup.number()
    .min(0, 'Salaries tax cannot be negative')
    .nullable(),
  IncomeProperty: Yup.number()
    .min(0, 'Real property income cannot be negative')
    .nullable(),
  PropertyTaxDue: Yup.number()
    .min(0, 'Real property tax cannot be negative')
    .nullable(),
  Total: Yup.number()
    .required('Total tax is required')
    .min(0, 'Total tax cannot be negative')
    .max(10000, 'Total tax cannot exceed ₱10,000'),
  Interest: Yup.number()
    .min(0, 'Interest cannot be negative')
    .max(100, 'Interest cannot exceed 100%')
    .nullable(),
  AmountReceived: Yup.number()
    .required('Total amount paid is required')
    .min(0, 'Total amount paid cannot be negative'),
  Remarks: Yup.string()
    .max(500, 'Remarks cannot exceed 500 characters')
    .nullable(),
  AmountinWords: Yup.string().max(
    500,
    'Amount in words cannot exceed 500 characters'
  ),
});
const CommunityTaxForm = ({
  initialData = null,
  onCancel,
  onSubmitForm,
  isReadOnly = false,
}) => {
  const citizenshipOptions = [
    { value: 'Afghan', label: 'Afghan' },
    { value: 'Filipino', label: 'Filipino' },
    { value: 'American', label: 'American' },
    { value: 'Other', label: 'Other' },
  ];

  const civilStatusOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' },
  ];

  const sexOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
  ];

  // console.log('Initial data:', initialData);
  const getInitialValues = () => {
    const initialValues = {
      // BASIC INFO
      Year: initialData?.Year || '',
      PlaceIssued: initialData?.PlaceIssued || '',
      DateIssued: initialData?.InvoiceDate || '',
      CCNumber: initialData?.InvoiceNumber || '',
      TIN: initialData?.TIN || '',
      // PERSONAL INFO
      LastName: initialData?.Customer?.LastName || '',
      FirstName: initialData?.Customer?.FirstName || '',
      MiddleName: initialData?.Customer?.MiddleName || '',
      Address: initialData?.Customer?.StreetAddress || '',
      Citizenship: initialData?.Customer?.Citizenship || '',
      ICRNo: initialData?.Customer?.ICRNumber || '',
      PlaceOfBirth: initialData?.Customer?.PlaceofBirth || '',
      CivilStatus: initialData?.Customer?.CivilStatus || '',
      Occupation: initialData?.Customer?.Occupation || '',
      Gender: initialData?.Customer?.Gender || '',
      Height: initialData?.Customer?.Height || '',
      Weight: initialData?.Customer?.Weight || '',
      BirthDate: initialData?.Customer?.Birthdates || '',
      // TAX INFORMATION
      BasicTax: initialData?.BasicTax || '',
      BusinessEarnings: initialData?.BusinessEarnings || '',
      BusinessTaxDue: initialData?.BusinessTaxDue || '',
      OccupationEarnings: initialData?.OccupationEarnings || '',
      OccupationTaxDue: initialData?.OccupationTaxDue || '',
      IncomeProperty: initialData?.IncomeProperty || '',
      PropertyTaxDue: initialData?.PropertyTaxDue || '',
      // OVERALL TAX INFORMATION
      Total: initialData?.Total || '',
      Interest: initialData?.Interest || '',
      AmountReceived: initialData?.AmountReceived || '',
      Remarks: initialData?.Remarks || '',
      // AMOUNTS IN WORD
      AmountinWords: initialData?.AmountinWords || '',
    };

    return initialValues;
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema,
    onSubmit: (values) => {
      const isEdit = Boolean(initialData);

      // Transform the values based on the mode
      const payload = isEdit
        ? {
            // Edit mode payload (include LinkID)
            LinkID: initialData.LinkID,
            // IsNew: false,
            User: 'admin',
            IsNew: 'false',
            IsSelectedFromIndividual: 'False',
            EmployeeID: 1,
            ...transformValues(values),
          }
        : {
            IsNew: 'true',
            User: 'admin',
            IsSelectedFromIndividual: 'False',
            EmployeeID: 1,
            ...transformValues(values),
          }; // Create mode payload

      console.log('Form submitted:', payload);

      // Call the submission handler with the transformed payload
      onSubmitForm(payload);
    },
  });
  // Helper function to transform field names in the payload
  const transformValues = (values) => {
    const transformedValues = {
      ...values,

      InputOne: Number(values.BusinessEarnings), // Previously Business Earnings
      InputTwo: Number(values.OccupationEarnings), // Previously Occupation Earnings
      InputThree: Number(values.IncomeProperty), // Previously Real Property
      OutputOne: Number(values.BusinessTaxDue),
      OutputTwo: Number(values.OccupationTaxDue),
      OutputThree: Number(values.PropertyTaxDue),
      Municipality: values.PlaceIssued,
      AmountPaid: Number(values.AmountReceived),
      Words: values.AmountinWords,
      Profession: values.Occupation,
    };
    // Remove the original frontend field names
    delete transformedValues.BusinessEarnings;
    delete transformedValues.OccupationEarnings;
    delete transformedValues.IncomeProperty;
    delete transformedValues.BusinessTaxDue;
    delete transformedValues.OccupationTaxDue;
    delete transformedValues.PropertyTaxDue;
    delete transformedValues.PlaceIssued;
    delete transformedValues.AmountReceived;
    delete transformedValues.AmountinWords;
    delete transformedValues.Occupation;

    return transformedValues;
  };
  // Helper function to get field error props
  const getFieldProps = (fieldName) => ({
    name: fieldName,
    value: formik.values[fieldName] || '',
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched[fieldName] && formik.errors[fieldName],
    disabled: isReadOnly,
  });
  // Calculate amount in words whenever AmountReceived changes
  useEffect(() => {
    calculateAmountsInWords();
  }, [formik.values.AmountReceived]);
  const calculateAmountsInWords = () => {
    const totalAmountValue = formik.values.Total;
    const totalAmountInWords = numToWords(totalAmountValue);
    formik.setFieldValue('AmountinWords', totalAmountInWords);
  };
  // console.log('Form errors:', formik.errors);
  return (
    <div className="min-h-screen">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Certificate Header Info */}
        <div className="rounded-lg border bg-white text-card-foreground bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Certificate Information
            </h3>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <FormField
                  label="Year"
                  {...getFieldProps('Year')}
                  type="number"
                  disabled={isReadOnly}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.Year && formik.errors.Year && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.Year}
                  </p>
                )}
              </div>
              <div>
                <FormField
                  label="Place of Issue"
                  {...getFieldProps('PlaceIssued')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.PlaceIssued && formik.errors.PlaceIssued && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.PlaceIssued}
                  </p>
                )}
              </div>
              <div>
                <FormField
                  label="Date Issued"
                  {...getFieldProps('DateIssued')}
                  type="date"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.DateIssued && formik.errors.DateIssued && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.DateIssued}
                  </p>
                )}
              </div>
              <div>
                <FormField
                  label="Certificate No."
                  {...getFieldProps('CCNumber')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 font-bold text-blue-600"
                />
                {formik.touched.CCNumber && formik.errors.CCNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.CCNumber}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <FormField
                  label="TIN (if Any)"
                  {...getFieldProps('TIN')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="000-000-000-000"
                />
                {formik.touched.TIN && formik.errors.TIN && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.TIN}
                  </p>
                )}
              </div>

              {/* Empty columns to push the label to the right */}
              <div className="hidden md:block"></div>
              <div className="hidden lg:block"></div>

              <div className="bg-gray-100 text-center px-3 py-1 text-sm font-medium flex items-center justify-center">
                TAXPAYER'S COPY
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="rounded-lg border bg-white text-card-foreground bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <FormField
                  label="Last Name"
                  {...getFieldProps('LastName')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.LastName && formik.errors.LastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.LastName}
                  </p>
                )}
              </div>
              <div>
                <FormField
                  label="First Name"
                  {...getFieldProps('FirstName')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.FirstName && formik.errors.FirstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.FirstName}
                  </p>
                )}
              </div>
              <div>
                <FormField
                  label="Middle Name"
                  {...getFieldProps('MiddleName')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.MiddleName && formik.errors.MiddleName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.MiddleName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <FormField
                  label={
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </span>
                  }
                  {...getFieldProps('Address')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.Address && formik.errors.Address && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.Address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <FormField
                    label="Citizenship"
                    {...getFieldProps('Citizenship')}
                    type="select"
                    options={citizenshipOptions}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.Citizenship && formik.errors.Citizenship && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.Citizenship}
                    </p>
                  )}
                </div>
                <div>
                  <FormField
                    label="ICR No."
                    {...getFieldProps('ICRNo')}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.ICRNo && formik.errors.ICRNo && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.ICRNo}
                    </p>
                  )}
                </div>
                <div>
                  <FormField
                    label="Place of Birth"
                    {...getFieldProps('PlaceOfBirth')}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.PlaceOfBirth &&
                    formik.errors.PlaceOfBirth && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.PlaceOfBirth}
                      </p>
                    )}
                </div>
                <div>
                  <FormField
                    label="Date of Birth"
                    {...getFieldProps('BirthDate')}
                    type="date"
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.BirthDate && formik.errors.BirthDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.BirthDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <FormField
                    label="Civil Status"
                    {...getFieldProps('CivilStatus')}
                    type="radio"
                    options={civilStatusOptions}
                  />
                  {formik.touched.CivilStatus && formik.errors.CivilStatus && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.CivilStatus}
                    </p>
                  )}
                </div>
                <div>
                  <FormField
                    label="Profession/Occupation"
                    {...getFieldProps('Occupation')}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.Occupation && formik.errors.Occupation && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.Occupation}
                    </p>
                  )}
                </div>
                <div>
                  <FormField
                    label="Sex"
                    {...getFieldProps('Gender')}
                    type="radio"
                    options={sexOptions}
                  />
                  {formik.touched.Gender && formik.errors.Gender && (
                    <p className="text-red-500 text-sm mt-1">
                      {formik.errors.Gender}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FormField
                      label="Height (cm)"
                      {...getFieldProps('Height')}
                      type="number"
                      min="100"
                      max="250"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {formik.touched.Height && formik.errors.Height && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.Height}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormField
                      label="Weight (kg)"
                      {...getFieldProps('Weight')}
                      type="number"
                      min="30"
                      max="300"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {formik.touched.Weight && formik.errors.Weight && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.Weight}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="rounded-lg border bg-white text-card-foreground bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Tax Assessment
            </h3>
          </div>
          <div className="p-6 pt-2">
            <div className="space-y-6">
              {/* Basic Community Tax */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-900 mb-4">
                  A. Basic Community Tax (₱5.00) or Exempted (₱1.00)
                </h3>

                <div className="flex justify-end gap-3">
                  <div>
                    <FormField
                      label="Taxable Amount:"
                      {...getFieldProps('BasicTax')}
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-32 text-right font-mono border-blue-200 focus:border-blue-500"
                    />
                    {formik.touched.BasicTax && formik.errors.BasicTax && (
                      <p className="text-red-300 text-sm">
                        {formik.errors.BasicTax}
                      </p>
                    )}
                  </div>
                  {/* <div>
                    <FormField
                      label="Community Due Amount:"
                      {...getFieldProps('BasicTax')}
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-32 text-right font-mono border-blue-200 focus:border-blue-500"
                    />
                    {formik.touched.BasicTax && formik.errors.BasicTax && (
                      <p className="text-red-300 text-sm">
                        {formik.errors.BasicTax}
                      </p>
                    )}
                  </div> */}
                </div>
              </div>

              {/* Additional Community Tax */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-900 mb-4">
                  B. Additional Community Tax (tax not exceed ₱5,000.00)
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center py-3 border-b border-blue-200">
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-700">
                        1. Gross receipts or earnings derived from business
                        during the preceding year (₱1.00 for every ₱1,000)
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div>
                        <FormField
                          label="Taxable Amount:"
                          {...getFieldProps('BusinessEarnings')}
                          type="number"
                          min="0"
                          step="0.01"
                          className="text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Amount"
                        />
                        {formik.touched.BusinessEarnings &&
                          formik.errors.BusinessEarnings && (
                            <p className="text-red-300 text-sm">
                              {formik.errors.BusinessEarnings}
                            </p>
                          )}
                      </div>
                      <div>
                        <FormField
                          label="Community Due Amount:"
                          {...getFieldProps('BusinessTaxDue')}
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-24 text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Tax"
                        />
                        {formik.touched.BusinessTaxDue &&
                          formik.errors.BusinessTaxDue && (
                            <p className="text-red-300 text-sm">
                              {formik.errors.BusinessTaxDue}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center py-3 border-b border-blue-200">
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-700">
                        2. Salaries or gross receipt or earnings derived from
                        exercise of Occupation or pursuit of any occupation
                        (₱1.00 for every ₱1,000)
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div>
                        <FormField
                          label="Taxable Amount:"
                          {...getFieldProps('OccupationEarnings')}
                          type="number"
                          min="0"
                          step="0.01"
                          className="text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Amount"
                        />
                        {formik.touched.OccupationEarnings &&
                          formik.errors.OccupationEarnings && (
                            <p className="text-red-300 text-sm">
                              {formik.errors.OccupationEarnings}
                            </p>
                          )}
                      </div>
                      <div>
                        <FormField
                          label="Community Due Amount:"
                          {...getFieldProps('OccupationTaxDue')}
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-24 text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Tax"
                        />
                        {formik.touched.OccupationTaxDue &&
                          formik.errors.OccupationTaxDue && (
                            <p className="text-red-300 text-sm">
                              {formik.errors.OccupationTaxDue}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center py-3 border-b border-blue-200">
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-700">
                        3. Income from real property (₱1.00 for every ₱1,000)
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div>
                        <FormField
                          label="Taxable Amount:"
                          {...getFieldProps('IncomeProperty')}
                          type="number"
                          min="0"
                          step="0.01"
                          className="text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Amount"
                        />
                        {formik.touched.IncomeProperty &&
                          formik.errors.IncomeProperty && (
                            <p className="text-red-300 text-sm">
                              {formik.errors.IncomeProperty}
                            </p>
                          )}
                      </div>
                      <div>
                        <FormField
                          label="Community Due Amount:"
                          {...getFieldProps('PropertyTaxDue')}
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-24 text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Tax"
                        />
                        {formik.touched.PropertyTaxDue &&
                          formik.errors.PropertyTaxDue && (
                            <p className="text-red-300 text-sm">
                              {formik.errors.PropertyTaxDue}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Section - Total and Interest */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-medium block">Total</label>
                      <FormField
                        {...getFieldProps('Total')}
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full text-right font-mono bg-white/20 border-white/30 text-white placeholder-white/70 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      {formik.touched.Total && formik.errors.Total && (
                        <p className="text-red-300 text-sm">
                          {formik.errors.Total}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium block">Interest %</label>
                      <FormField
                        {...getFieldProps('Interest')}
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full text-right font-mono bg-white/20 border-white/30 text-white placeholder-white/70 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      {formik.touched.Interest && formik.errors.Interest && (
                        <p className="text-red-300 text-sm">
                          {formik.errors.Interest}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Middle Section - Total Amount Paid */}
                  <div className="space-y-2">
                    <label className="font-bold text-lg block">
                      Total Amount Paid
                    </label>
                    <FormField
                      {...getFieldProps('AmountReceived')}
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full text-right font-mono bg-white/20 border-white/30 text-white placeholder-white/70 font-bold text-lg px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    {formik.touched.AmountReceived &&
                      formik.errors.AmountReceived && (
                        <p className="text-red-300 text-sm">
                          {formik.errors.AmountReceived}
                        </p>
                      )}
                  </div>

                  {/* Right Section - In Words */}
                  <div className="flex items-end md:items-center justify-center md:justify-end">
                    <div className="text-center md:text-right">
                      <p className="text-sm text-white/80 mb-1">(in words)</p>
                      <p className="font-bold text-lg bg-white/10 px-3 py-2 rounded-lg inline-block w-full md:w-auto">
                        {formik.values.AmountinWords || 'ZERO'} PESOS
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <FormField
                label="Remarks"
                {...getFieldProps('Remarks')}
                type="textarea"
                className="min-h-24 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter any additional Remarks here..."
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
          <button type="button" onClick={onCancel} className="btn btn-outline">
            Close
          </button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-md transition-colors"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Generating...' : 'Generate Certificate'}
          </Button>
        </div>
        {Object.keys(formik.errors).length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There {Object.keys(formik.errors).length === 1 ? 'is' : 'are'}{' '}
                  {Object.keys(formik.errors).length} error
                  {Object.keys(formik.errors).length === 1 ? '' : 's'} in your
                  form
                </h3>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CommunityTaxForm;
