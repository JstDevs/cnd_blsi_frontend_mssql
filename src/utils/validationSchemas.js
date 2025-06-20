import * as Yup from 'yup';

// Common validation patterns
const patterns = {
  phone: /^[0-9+\-() ]{7,15}$/,
  tin: /^\d{3}-\d{3}-\d{3}-\d{3}$/,
  sss: /^\d{2}-\d{7}-\d{1}$/,
  philHealth: /^\d{2}-\d{9}-\d{1}$/,
  pagIbig: /^\d{4}-\d{4}-\d{4}$/,
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
};

// Common validation messages
const messages = {
  required: 'This field is required',
  email: 'Invalid email address',
  phone: 'Invalid phone number format',
  tin: 'Invalid TIN format (e.g., 123-456-789-000)',
  sss: 'Invalid SSS number format (e.g., 12-3456789-0)',
  philHealth: 'Invalid PhilHealth number format (e.g., 12-345678901-2)',
  pagIbig: 'Invalid Pag-IBIG number format (e.g., 1234-5678-9012)',
  positiveNumber: 'Amount must be greater than 0',
  date: 'Invalid date',
  futureDate: 'Date cannot be in the future',
  pastDate: 'Date cannot be in the past',
};

// Journal Entry validation schema
export const journalEntrySchema = Yup.object().shape({
  date: Yup.date()
    .required(messages.required)
    .max(new Date(), messages.futureDate),
  reference: Yup.string()
    .max(50, 'Reference number too long'),
  particulars: Yup.string()
    .required(messages.required)
    .max(500, 'Particulars too long'),
  debitEntries: Yup.array()
    .of(
      Yup.object().shape({
        accountCode: Yup.string().required('Account code is required'),
        amount: Yup.number()
          .required('Amount is required')
          .moreThan(0, messages.positiveNumber),
      })
    )
    .min(1, 'At least one debit entry is required'),
  creditEntries: Yup.array()
    .of(
      Yup.object().shape({
        accountCode: Yup.string().required('Account code is required'),
        amount: Yup.number()
          .required('Amount is required')
          .moreThan(0, messages.positiveNumber),
      })
    )
    .min(1, 'At least one credit entry is required'),
}).test('balancedEntries', 'Total debits must equal total credits', function(values) {
  if (!values.debitEntries || !values.creditEntries) return true;
  
  const totalDebits = values.debitEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  const totalCredits = values.creditEntries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  
  return Math.abs(totalDebits - totalCredits) < 0.01; // Allow for small floating point differences
});

// Market Collection validation schema
export const marketCollectionSchema = Yup.object().shape({
  date: Yup.date()
    .required(messages.required)
    .max(new Date(), messages.futureDate),
  period: Yup.string()
    .required(messages.required),
  stallNumber: Yup.string()
    .required(messages.required)
    .matches(/^[A-Z]-\d{3}$/, 'Invalid stall number format (e.g., A-101)'),
  stallType: Yup.string()
    .required(messages.required),
  stallOwner: Yup.string()
    .required(messages.required)
    .max(100, 'Name too long'),
  amount: Yup.number()
    .required(messages.required)
    .moreThan(0, messages.positiveNumber),
});

// Community Tax validation schema
export const communityTaxSchema = Yup.object().shape({
  certificateNo: Yup.string()
    .required('Certificate number is required')
    .matches(/^[A-Z0-9-]+$/, 'Certificate number can only contain uppercase letters, numbers, and hyphens'),
  date: Yup.date()
    .required('Date is required')
    .max(new Date(), 'Date cannot be in the future'),
  placeOfIssue: Yup.string()
    .required('Place of issue is required')
    .min(2, 'Place of issue must be at least 2 characters')
    .max(100, 'Place of issue must not exceed 100 characters'),
  name: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters'),
  tin: Yup.string()
    .matches(/^$|^\d{9}(\d{3})?$/, 'Invalid TIN format (9 or 12 digits)')
    .nullable(),
  civilStatus: Yup.string()
    .required('Civil status is required')
    .oneOf(['single', 'married', 'widowed', 'separated', 'divorced'], 'Invalid civil status'),
  nationality: Yup.string()
    .required('Nationality is required')
    .min(2, 'Nationality must be at least 2 characters')
    .max(50, 'Nationality must not exceed 50 characters'),
  occupation: Yup.string()
    .required('Occupation/Business is required')
    .min(2, 'Occupation/Business must be at least 2 characters')
    .max(100, 'Occupation/Business must not exceed 100 characters'),
  placeOfBirth: Yup.string()
    .required('Place of birth is required')
    .min(2, 'Place of birth must be at least 2 characters')
    .max(100, 'Place of birth must not exceed 100 characters'),
  dateOfBirth: Yup.date()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),
  gender: Yup.string()
    .required('Gender is required')
    .oneOf(['male', 'female'], 'Invalid gender'),
  height: Yup.number()
    .min(0, 'Height cannot be negative')
    .max(300, 'Height seems too large')
    .nullable(),
  weight: Yup.number()
    .min(0, 'Weight cannot be negative')
    .max(1000, 'Weight seems too large')
    .nullable(),
  contactNumber: Yup.string()
    .matches(/^$|^[0-9+\s-()]+$/, 'Invalid contact number format')
    .max(20, 'Contact number must not exceed 20 characters')
    .nullable(),
  businessGrossReceipts: Yup.number()
    .min(0, 'Amount cannot be negative')
    .nullable(),
  occupationGrossReceipts: Yup.number()
    .min(0, 'Amount cannot be negative')
    .nullable(),
  realPropertyIncome: Yup.number()
    .min(0, 'Amount cannot be negative')
    .nullable(),
  purpose: Yup.string()
    .required('Purpose is required')
    .min(5, 'Purpose must be at least 5 characters')
    .max(500, 'Purpose must not exceed 500 characters'),
  amount: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be greater than or equal to 0')
    .max(1000000, 'Amount must not exceed 1,000,000'),
  interest: Yup.number()
    .min(0, 'Interest cannot be negative')
    .nullable(),
});

// Real Property Tax validation schema
export const realPropertyTaxSchema = Yup.object().shape({
  date: Yup.date()
    .required(messages.required)
    .max(new Date(), messages.futureDate),
  tdNumber: Yup.string()
    .required(messages.required)
    .matches(/^TD-\d{3}-\d{4}$/, 'Invalid TD number format (e.g., TD-123-2024)'),
  taxpayerName: Yup.string()
    .required(messages.required)
    .max(100, 'Name too long'),
  location: Yup.string()
    .required(messages.required)
    .max(200, 'Location too long'),
  basicTax: Yup.number()
    .required(messages.required)
    .moreThan(0, messages.positiveNumber),
  sef: Yup.number()
    .required(messages.required)
    .moreThan(0, messages.positiveNumber),
  penalty: Yup.number()
    .min(0, 'Amount cannot be negative'),
});

// Location validation schemas
export const barangaySchema = Yup.object().shape({
  Name: Yup.string()
    .required(messages.required)
    .max(100, 'Name too long'),
  MunicipalityCode: Yup.string()
    .required(messages.required),
  ProvinceCode: Yup.string()
    .required(messages.required),
  RegionCode: Yup.string()
    .required(messages.required),
});

export const municipalitySchema = Yup.object().shape({
  Name: Yup.string()
    .required(messages.required)
    .max(100, 'Name too long'),
  ProvinceCode: Yup.string()
    .required(messages.required),
  RegionCode: Yup.string()
    .required(messages.required),
});

export const provinceSchema = Yup.object().shape({
  Name: Yup.string()
    .required(messages.required)
    .max(100, 'Name too long'),
  RegionCode: Yup.string()
    .required(messages.required),
});

export const regionSchema = Yup.object().shape({
  Name: Yup.string()
    .required(messages.required)
    .max(100, 'Name too long'),
});

// Common validation functions
export const validatePhoneNumber = (value) => {
  return patterns.phone.test(value);
};

export const validateEmail = (value) => {
  return patterns.email.test(value);
};

export const validateTIN = (value) => {
  return patterns.tin.test(value);
};

export const validateSSS = (value) => {
  return patterns.sss.test(value);
};

export const validatePhilHealth = (value) => {
  return patterns.philHealth.test(value);
};

export const validatePagIbig = (value) => {
  return patterns.pagIbig.test(value);
};

export const validateAmount = (value) => {
  return !isNaN(value) && Number(value) > 0;
};

export const validateDate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime());
};

export const validateFutureDate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime()) && date > new Date();
};

export const validatePastDate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime()) && date < new Date();
};

export const generalServiceReceiptSchema = Yup.object().shape({
  id: Yup.string().required('ID is required'),
  status: Yup.string().required('Status is required').oneOf(['posted', 'rejected', 'approved'], 'Invalid status'),
  invoiceDate: Yup.date().required('Invoice date is required').max(new Date(), 'Invoice date cannot be in the future'),
  payorName: Yup.string().required('Payor name is required').min(2, 'Payor name must be at least 2 characters').max(100, 'Payor name must not exceed 100 characters'),
  date: Yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
  agency: Yup.string().required('Agency is required').min(2, 'Agency must be at least 2 characters').max(100, 'Agency must not exceed 100 characters'),
  fund: Yup.string().required('Fund is required').oneOf(['General funds', 'Other fund option 1', 'Other fund option 2'], 'Invalid fund option'), // Mock options
  taxpayerType: Yup.string().required('Taxpayer type is required').oneOf(['Individual', 'Corporation'], 'Invalid taxpayer type'),
});