import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FileText, Calendar, MapPin, User, CreditCard } from 'lucide-react';
import FormField from '@/components/common/FormField';
import Button from '@/components/common/Button';
import numToWords from '@/components/helper/numToWords';
import { useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { convertAmountToWords } from '@/utils/amountToWords';
import { calculateInterestRate } from '@/utils/calculateInterest';
// Validation schema
const validationSchema = Yup.object({
  // Certificate Information

  Year: Yup.number()
    .typeError('Year must be a number')
    .required('Year is required')
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  PlaceIssued: Yup.string()
    .required('Place of issue is required')
    .min(2, 'Place of issue must be at least 2 characters'),
  DateIssued: Yup.date()
    .required('Date issued is required')
    .max(new Date(), 'Date issued cannot be in the future'),
  CCNumber: Yup.number()
    .required('Certificate number is required')
    .typeError('Year must be a number')
    .min(3, 'Certificate number must be at least 3 Numbers'),
  TIN: Yup.string()
    .matches(/^\d{14}$/, 'TIN must be exactly 14 digits')
    .nullable(),

  // Personal Information
  LastName: Yup.string()
    .required('Last Name is required')
    .min(2, 'Last Name must be at least 2 characters')
    .matches(
      /^[a-zA-Z\s-']+$/,
      'Last Name can only contain letters, spaces, hyphens, and apostrophes'
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
  CivilStatus: Yup.string(),
  Occupation: Yup.string().min(2, 'Profession must be at least 2 characters'),
  Gender: Yup.string().required('Sex is required'),
  HeightFeet: Yup.number()
    .typeError('Feet must be a number')
    .min(3, 'Minimum height is 3 feet')
    .max(8, 'Maximum height is 8 feet')
    .integer('Feet must be a whole number'),

  HeightInches: Yup.number()
    .typeError('Inches must be a number')
    .min(0, 'Inches cannot be negative')
    .max(11, 'Inches must be between 0 and 11')
    .test(
      'total-height',
      'Total height must be between 3\'0" and 8\'11"',
      function (inches) {
        const feet = this.parent.HeightFeet;
        if (!feet || inches === undefined) return true; // Let required handle this
        const totalInches = feet * 12 + inches;
        return totalInches >= 36 && totalInches <= 107; // 3ft = 36in, 8'11" = 107in
      }
    ),

  Weight: Yup.number()
    .typeError('Weight must be a number')
    .min(30, 'Weight must be at least 30 kg')
    .max(300, 'Weight must not exceed 300 kg'),

  // Tax Information
  BasicTax: Yup.number()
    .typeError('Must be a number')
    .required('Basic tax is required')
    .oneOf([1, 5], 'Basic tax can only be 1 or 5'),
  BusinessEarnings: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Gross receipts cannot be negative')
    .nullable(),
  BusinessTaxDue: Yup.number()
    .typeError('Must be a number')
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
  InterestAmount: Yup.number(),
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
  selectedCustomer = null,
  initialData = null,
  onCancel,
  onSubmitForm,
  isReadOnly = false,
  currentCertificateNumber = null,
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
  // Helper functions for height conversion (inches to feet/inches)
  const convertToFeet = (inches) => {
    if (!inches) return '';
    const totalInches = parseFloat(inches);
    return Math.floor(totalInches / 12).toString();
  };

  const convertToInches = (inches) => {
    if (!inches) return '';
    const totalInches = parseFloat(inches);
    return Math.round(totalInches % 12).toString();
  };
  console.log('initialData', currentCertificateNumber);
  const getInitialValues = () => {
    // Determine the source of customer data (priority: initialData > selectedCustomer)
    const customerSource = initialData?.Customer || selectedCustomer;

    // Extract height components if available
    const heightInInches = customerSource?.Height || '';
    const heightFeet = heightInInches ? convertToFeet(heightInInches) : '';
    const heightInches = heightInInches ? convertToInches(heightInInches) : '';

    const initialValues = {
      // BASIC INFO
      Year: initialData?.Year || '',
      PlaceIssued: initialData?.PlaceIssued || '',
      DateIssued: initialData?.InvoiceDate || '',
      CCNumber:
        initialData?.InvoiceNumber ||
        currentCertificateNumber?.CurrentNumber ||
        '',
      TIN: initialData?.TIN || customerSource?.TIN || '', // Check both sources for TIN

      // PERSONAL INFO (from either initialData.Customer or selectedCustomer)
      LastName: customerSource?.LastName || '',
      FirstName: customerSource?.FirstName || '',
      MiddleName: customerSource?.MiddleName || '',
      Address: customerSource?.StreetAddress || '',
      Citizenship: customerSource?.Citizenship || '',
      ICRNo: customerSource?.ICRNumber || '',
      PlaceOfBirth: customerSource?.PlaceofBirth || '',
      CivilStatus: customerSource?.CivilStatus || '',
      Occupation: customerSource?.Occupation || '',
      Gender: customerSource?.Gender || '',
      HeightFeet: heightFeet,
      HeightInches: heightInches,
      Weight: customerSource?.Weight || '',
      BirthDate: customerSource?.Birthdate || '',

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
      Interest: initialData?.Interest || calculateInterestRate(),
      InterestAmount: initialData?.InterestAmount || '',
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
            IsNew: 'false',
            IsSelectedFromIndividual: 'true', // selected from individual list...!!!!
            ID: initialData.ID,
            CustomerID: initialData.CustomerID,
            ...transformValues(values),
          }
        : {
            IsNew: 'true', // Create mode
            IsSelectedFromIndividual: 'true', // selected from individual list...!!!!
            CustomerID: selectedCustomer?.ID,
            ...transformValues(values),
          };

      // console.log('Form submitted:', payload);

      // Call the submission handler with the transformed payload
      onSubmitForm(payload);
    },
  });
  // Helper function to transform field names in the payload
  const transformValues = (values) => {
    const transformedValues = {
      ...values,
      Year: String(values.Year),
      Height: String(values.Height),
      Weight: String(values.Weight),
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
  // Reusable helper
  const handleEarningsChange = (field, value) => {
    const tax = Math.floor(Number(value || 0) / 1000);

    const taxDueMap = {
      BusinessEarnings: 'BusinessTaxDue',
      OccupationEarnings: 'OccupationTaxDue',
      IncomeProperty: 'PropertyTaxDue',
    };

    // Set tax due for that specific field
    formik.setFieldValue(taxDueMap[field], tax);

    // Recalculate total after updating individual tax
    setTimeout(() => recalculateTotal(), 0);
  };

  // Helper function to get field error props
  const getFieldProps = (fieldName) => ({
    name: fieldName,
    value: formik.values[fieldName] || '',
    onChange: (e) => {
      const { name, value } = e.target;
      formik.setFieldValue(name, value);

      if (
        ['BusinessEarnings', 'OccupationEarnings', 'IncomeProperty'].includes(
          name
        )
      ) {
        handleEarningsChange(name, value);
      }

      if (name === 'BasicTax') {
        // Recalculate everything when BasicTax changes
        recalculateTotal();
      }
    },
    onBlur: formik.handleBlur,
    error: formik.touched[fieldName] && formik.errors[fieldName],
    disabled: isReadOnly,
  });
  const recalculateTotal = () => {
    // Get all current values
    const basicTax = Number(formik.values.BasicTax || 0);
    const businessTaxDue = Number(formik.values.BusinessTaxDue || 0);
    const occupationTaxDue = Number(formik.values.OccupationTaxDue || 0);
    const propertyTaxDue = Number(formik.values.PropertyTaxDue || 0);

    // A = Sum of all Community Due Amount (capped at 5000)
    const communityTaxSum = businessTaxDue + occupationTaxDue + propertyTaxDue;
    const A = Math.min(communityTaxSum, 5000);

    // B = Interest rate
    const B = calculateInterestRate() / 100; // Convert percentage to decimal

    // C = Basic Tax (Taxable Amount)
    const C = basicTax;

    // Total = (A * (1 + B)) + C
    const total = A * (1 + B) + C;
    const interestAmount = A * B;

    // Update form values
    formik.setFieldValue('InterestAmount', interestAmount.toFixed(2));
    formik.setFieldValue('Total', total.toFixed(2));
    formik.setFieldValue('AmountReceived', total.toFixed(2));
  };
  // Calculate amount in words whenever AmountReceived changes
  // useEffect(() => {
  //   calculateAmountsInWords();
  // }, [formik.values.AmountReceived]);
  // const calculateAmountsInWords = () => {
  //   const totalAmountValue = formik.values.Total;
  //   const totalAmountInWords = numToWords(totalAmountValue);
  //   formik.setFieldValue('AmountinWords', totalAmountInWords);
  // };
  // console.log('Form errors:', formik.errors);
  return (
    <div className="min-h-screen">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Certificate Header Info */}
        <div className="rounded-lg border bg-white text-card-foreground bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 sm:p-6 p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Certificate Information
            </h3>
          </div>
          <div className="sm:p-6 p-3 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <FormField
                  label="Year"
                  {...getFieldProps('Year')}
                  type="number"
                  disabled={isReadOnly}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  error={formik.touched.Year && formik.errors.Year}
                  touched={formik.touched.Year}
                  required
                />
              </div>
              <div>
                <FormField
                  label="Place of Issue"
                  {...getFieldProps('PlaceIssued')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  error={
                    formik.touched.PlaceIssued && formik.errors.PlaceIssued
                  }
                  touched={formik.touched.PlaceIssued}
                  required
                />
              </div>
              <div>
                <FormField
                  label="Date Issued"
                  {...getFieldProps('DateIssued')}
                  type="date"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  error={formik.touched.DateIssued && formik.errors.DateIssued}
                  touched={formik.touched.DateIssued}
                  required
                />
              </div>
              <div>
                <FormField
                  label="OR No."
                  {...getFieldProps('CCNumber')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  error={formik.touched.CCNumber && formik.errors.CCNumber}
                  touched={formik.touched.CCNumber}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <FormField
                  label="TIN (if Any)"
                  {...getFieldProps('TIN')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="000-000-000-000"
                  error={formik.touched.TIN && formik.errors.TIN}
                  touched={formik.touched.TIN}
                />
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
          <div className="flex flex-col space-y-1.5 sm:p-6 p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
          </div>
          <div className="sm:p-6 p-3 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <FormField
                  label="Last Name"
                  {...getFieldProps('LastName')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  error={formik.touched.LastName && formik.errors.LastName}
                  touched={formik.touched.LastName}
                />
              </div>
              <div>
                <FormField
                  label="First Name"
                  {...getFieldProps('FirstName')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  error={formik.touched.FirstName && formik.errors.FirstName}
                  touched={formik.touched.FirstName}
                />
              </div>
              <div>
                <FormField
                  label="Middle Name"
                  {...getFieldProps('MiddleName')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  error={formik.touched.MiddleName && formik.errors.MiddleName}
                  touched={formik.touched.MiddleName}
                />
              </div>
            </div>

            <div className="space-y-6">
              <FormField
                label={'Address'}
                {...getFieldProps('Address')}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                error={formik.touched.Address && formik.errors.Address}
                touched={formik.touched.Address}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  label="Citizenship"
                  {...getFieldProps('Citizenship')}
                  type="select"
                  options={citizenshipOptions}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  error={
                    formik.touched.Citizenship && formik.errors.Citizenship
                  }
                  touched={formik.touched.Citizenship}
                  required
                />

                <FormField
                  label="ICR No."
                  {...getFieldProps('ICRNo')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  error={formik.touched.ICRNo && formik.errors.ICRNo}
                  touched={formik.touched.ICRNo}
                />

                <FormField
                  label="Place of Birth"
                  {...getFieldProps('PlaceOfBirth')}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  error={
                    formik.touched.PlaceOfBirth && formik.errors.PlaceOfBirth
                  }
                  touched={formik.touched.PlaceOfBirth}
                  required
                />

                <FormField
                  label="Date of Birth"
                  {...getFieldProps('BirthDate')}
                  type="date"
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                  error={formik.touched.BirthDate && formik.errors.BirthDate}
                  touched={formik.touched.BirthDate}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <FormField
                    label="Civil Status"
                    {...getFieldProps('CivilStatus')}
                    type="radio"
                    options={civilStatusOptions}
                    error={
                      formik.touched.CivilStatus && formik.errors.CivilStatus
                    }
                    touched={formik.touched.CivilStatus}
                  />
                </div>
                <div>
                  <FormField
                    label="Profession/Occupation"
                    {...getFieldProps('Occupation')}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    error={
                      formik.touched.Occupation && formik.errors.Occupation
                    }
                    touched={formik.touched.Occupation}
                  />
                </div>
                <div>
                  <FormField
                    label="Sex"
                    {...getFieldProps('Gender')}
                    type="radio"
                    options={sexOptions}
                    error={formik.touched.Gender && formik.errors.Gender}
                    touched={formik.touched.Gender}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FormField
                      label="Height (feet)"
                      {...getFieldProps('HeightFeet')}
                      type="text"
                      min="3"
                      max="8"
                      step="1"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      error={
                        formik.touched.HeightFeet && formik.errors.HeightFeet
                      }
                      touched={formik.touched.HeightFeet}
                    />
                  </div>
                  <div>
                    <FormField
                      label="Height (inches)"
                      {...getFieldProps('HeightInches')}
                      type="text"
                      min="0"
                      max="11"
                      step="1"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      error={
                        formik.touched.HeightInches &&
                        formik.errors.HeightInches
                      }
                      touched={formik.touched.HeightInches}
                    />
                  </div>
                  <div>
                    <FormField
                      label="Weight (kg)"
                      {...getFieldProps('Weight')}
                      type="text"
                      min="30"
                      max="300"
                      className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                      error={formik.touched.Weight && formik.errors.Weight}
                      touched={formik.touched.Weight}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="rounded-lg border bg-white text-card-foreground bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 sm:p-6 p-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-t-lg">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Tax Assessment
            </h3>
          </div>
          <div className="sm:p-6 p-3 pt-2">
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
                      type="text"
                      className="w-32 text-right font-mono border-blue-200 focus:border-blue-500"
                      error={formik.touched.BasicTax && formik.errors.BasicTax}
                      touched={formik.touched.BasicTax}
                      required
                    />
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
                  <div className="flex flex-col gap-4 items-start py-3 border-b border-blue-200">
                    <div>
                      <p className="text-sm text-gray-700">
                        1. Gross receipts or earnings derived from business
                        during the preceding year (₱1.00 for every ₱1,000)
                      </p>
                    </div>
                    <div className="flex gap-3 ml-auto max-sm:flex-col">
                      <div>
                        <FormField
                          label="Taxable Amount:"
                          {...getFieldProps('BusinessEarnings')}
                          type="text"
                          min="0"
                          step="0.01"
                          className="text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Amount"
                          error={
                            formik.touched.BusinessEarnings &&
                            formik.errors.BusinessEarnings
                          }
                          touched={formik.touched.BusinessEarnings}
                        />
                      </div>
                      <div>
                        <FormField
                          label="Community Due Amount:"
                          {...getFieldProps('BusinessTaxDue')}
                          type="text"
                          className="w-24 text-right font-mono border-blue-200 bg-gray-100 cursor-not-allowed"
                          placeholder="Tax"
                          error={
                            formik.touched.BusinessTaxDue &&
                            formik.errors.BusinessTaxDue
                          }
                          touched={formik.touched.BusinessTaxDue}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 items-start py-3 border-b border-blue-200">
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-700">
                        2. Salaries or gross receipt or earnings derived from
                        exercise of Occupation or pursuit of any occupation
                        (₱1.00 for every ₱1,000)
                      </p>
                    </div>
                    <div className="flex gap-3 ml-auto max-sm:flex-col">
                      <div>
                        <FormField
                          label="Taxable Amount:"
                          {...getFieldProps('OccupationEarnings')}
                          type="text"
                          min="0"
                          step="0.01"
                          className="text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Amount"
                          error={
                            formik.touched.OccupationEarnings &&
                            formik.errors.OccupationEarnings
                          }
                          touched={formik.touched.OccupationEarnings}
                        />
                      </div>
                      <div>
                        <FormField
                          label="Community Due Amount:"
                          {...getFieldProps('OccupationTaxDue')}
                          type="text"
                          className="w-24 text-right font-mono border-blue-200 bg-gray-100 cursor-not-allowed"
                          placeholder="Tax"
                          error={
                            formik.touched.OccupationTaxDue &&
                            formik.errors.OccupationTaxDue
                          }
                          touched={formik.touched.OccupationTaxDue}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 items-start py-3 border-b border-blue-200">
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-700">
                        3. Income from real property (₱1.00 for every ₱1,000)
                      </p>
                    </div>
                    <div className="flex gap-3 ml-auto max-sm:flex-col">
                      <div>
                        <FormField
                          label="Taxable Amount:"
                          {...getFieldProps('IncomeProperty')}
                          type="text"
                          min="0"
                          step="0.01"
                          className="text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Amount"
                          error={
                            formik.touched.IncomeProperty &&
                            formik.errors.IncomeProperty
                          }
                          touched={formik.touched.IncomeProperty}
                        />
                      </div>
                      <div>
                        <FormField
                          label="Community Due Amount:"
                          {...getFieldProps('PropertyTaxDue')}
                          type="text"
                          className="w-24 text-right font-mono border-blue-200 bg-gray-100 cursor-not-allowed"
                          placeholder="Tax"
                          error={
                            formik.touched.PropertyTaxDue &&
                            formik.errors.PropertyTaxDue
                          }
                          touched={formik.touched.PropertyTaxDue}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sm:p-6 p-3 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Section - Total and Interest */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-medium block">Total</label>
                      <FormField
                        {...getFieldProps('Total')}
                        type="text"
                        min="0"
                        step="0.01"
                        className="w-full text-right font-mono bg-white/20 border-white/30 text-white placeholder-white/70 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                        error={formik.touched.Total && formik.errors.Total}
                        touched={formik.touched.Total}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium block">Interest %</label>
                      <FormField
                        {...getFieldProps('Interest')}
                        type="text"
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full text-right font-mono bg-white/20 cursor-not-allowed border-white/30 text-white placeholder-white/70 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                        error={
                          formik.touched.Interest && formik.errors.Interest
                        }
                        touched={formik.touched.Interest}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Middle Section - Total Amount Paid */}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-bold text-lg block">
                        Total Amount Paid
                      </label>
                      <FormField
                        {...getFieldProps('AmountReceived')}
                        type="text"
                        min="0"
                        step="0.01"
                        className="w-full text-right font-mono bg-white/20 border-white/30 text-white placeholder-white/70 font-bold text-lg px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                        error={
                          formik.touched.AmountReceived &&
                          formik.errors.AmountReceived
                        }
                        touched={formik.touched.AmountReceived}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-medium block">
                        Interest Amount
                      </label>
                      <FormField
                        {...getFieldProps('InterestAmount')}
                        type="text"
                        className="w-full text-right font-mono bg-white/20 border-white/30 text-white placeholder-white/70 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-white/50"
                        error={
                          formik.touched.InterestAmount &&
                          formik.errors.InterestAmount
                        }
                        touched={formik.touched.InterestAmount}
                        readOnly
                      />
                    </div>
                  </div>
                  {/* Right Section - In Words */}
                  <div className="flex items-end md:items-center justify-center md:justify-end">
                    <div className="text-center md:text-right">
                      <p className="text-sm text-white/80 mb-1">(in words)</p>
                      <p className="font-bold text-lg bg-white/10 px-3 py-2 rounded-lg inline-block w-full md:w-auto">
                        {convertAmountToWords(formik.values.AmountReceived) ||
                          '-'}
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
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Generating...' : 'Generate Certificate'}
          </Button>
        </div>

        {formik.submitCount > 0 && Object.keys(formik.errors).length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <h3 className="text-sm font-medium text-red-800">
              Please fix the following errors:
            </h3>
            <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
              {Object.entries(formik.errors).map(
                ([fieldName, errorMessage]) => (
                  <li key={fieldName}>{errorMessage}</li>
                )
              )}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default CommunityTaxForm;
