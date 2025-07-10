import { useFormik } from 'formik';
import { Calendar, Building, MapPin, CreditCard } from 'lucide-react';
import FormField from '@/components/common/FormField';
import Button from '@/components/common/Button';
import * as Yup from 'yup';
import { useEffect } from 'react';
import numToWords from '@/components/helper/numToWords';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const validationSchema = Yup.object().shape({
  Year: Yup.string()
    .required('Year is required')
    .matches(/^\d{4}$/, 'Year must be 4 digits'),

  PlaceIssued: Yup.string()
    .required('Place of issue is required')
    .max(100, 'Place of issue must be less than 100 characters'),

  DateIssued: Yup.date()
    .required('Date issued is required')
    .max(new Date(), 'Date cannot be in the future'),

  CCNumber: Yup.string()
    .required('Certificate number is required')
    .matches(/^[A-Za-z0-9-]+$/, 'Only letters, numbers and hyphens allowed'),

  Name: Yup.string()
    .required('Company name is required')
    .max(200, 'Company name must be less than 200 characters'),

  TIN: Yup.string().matches(
    /^\d{3}-\d{3}-\d{3}-\d{3}$|^\d{9}$|^$/,
    'TIN must be 9 digits or in XXX-XXX-XXX-XXX format'
  ),

  Address: Yup.string()
    .required('Business address is required')
    .max(300, 'Address must be less than 300 characters'),

  dateOfRegistration: Yup.date().required('Registration date is required'),

  KindofOrganization: Yup.string()
    .required('Organization type is required')
    .oneOf(
      ['Corporation', 'Partnership', 'Association'],
      'Invalid organization type'
    ),

  PlaceofIncorporation: Yup.string().required(
    'Place of incorporation is required'
  ),

  NatureOfOrganization: Yup.string().required('Business nature is required'),

  // taxableAmount: Yup.number()
  //   .typeError('Must be a number')
  //   .min(0, 'Cannot be negative')
  //   .required('Taxable amount is required'),

  // communityTaxDue: Yup.number()
  //   .typeError('Must be a number')
  //   .min(0, 'Cannot be negative')
  //   .required('Community tax due is required'),

  // basicCommunityTax: Yup.number()
  //   .typeError('Must be a number')
  //   .min(0, 'Cannot be negative')
  //   .required('Basic community tax is required'),

  BasicTax: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Cannot be negative')
    .required('Basic tax is required'),

  assessedValueRealProperty: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Cannot be negative'),

  assessedValueTax: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Cannot be negative'),

  grossReceipts: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Cannot be negative'),

  grossReceiptsTax: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Cannot be negative'),

  Total: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Cannot be negative')
    .required('Total is required'),

  Interest: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Cannot be negative'),

  AmountPaid: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Cannot be negative')
    .required('Total amount paid is required'),

  Remarks: Yup.string().max(500, 'Remarks must be less than 500 characters'),
  AmountinWords: Yup.string().max(
    500,
    'Amount in words cannot exceed 500 characters'
  ),
});

const CTCForm = ({
  selectedVendor = null,
  initialData = null,
  onBack,
  onSubmitSuccess,
  readOnly,
}) => {
  const organizationOptions = [
    { value: 'Corporation', label: 'Corporation' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'Association', label: 'Association' },
  ];
  // console.log('Selected Vendors CTC:', selectedVendor, initialData);
  const customerSource = initialData?.Customer || selectedVendor;
  console.log('Customer Source:', customerSource);
  const formik = useFormik({
    initialValues: {
      // BASIC INFO
      Year: initialData?.Year || '',
      PlaceIssued: initialData?.PlaceIssued || '', // PLACE OF ISSUE
      DateIssued: initialData?.InvoiceDate || '',
      CCNumber: initialData?.InvoiceNumber || '',
      // COMPANY INFO
      Name: initialData?.CustomerName || '', // COMPANY FULL NAME
      TIN: initialData?.TIN || '',
      Address: customerSource?.StreetAddress || '',
      dateOfRegistration: customerSource?.DateofRegistration || '',
      KindofOrganization: customerSource?.KindofOrganization || 'Corporation',
      PlaceofIncorporation: customerSource?.PlaceofIncorporation || '',
      NatureOfOrganization: customerSource?.NatureOfOrganization || '',

      //  TAX INFO
      BasicTax: initialData?.BasicTax || 0,
      // basicCommunityTax: initialData?.basicCommunityTax || '',

      assessedValueRealProperty: initialData?.BusinessEarnings || '',
      assessedValueTax: initialData?.BusinessTaxDue || '',

      grossReceipts: initialData?.OccupationEarnings || '',
      grossReceiptsTax: initialData?.OccupationTaxDue || '',
      // TOTAL TAX DUE: ++++ ALL CHANGED
      Total: initialData?.Total || '',
      Interest: initialData?.Interest || '',
      AmountPaid: initialData?.AmountReceived || '',

      Remarks: initialData?.Remarks || '',
      AmountinWords: initialData?.AmountinWords || '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const isEdit = Boolean(initialData);
      const payload = isEdit
        ? {
            IsNew: 'false',
            IsSelectedFromIndividual: 'true',
            CustomerID: initialData?.CustomerID,
            ID: initialData.ID,
            ...transformValues(values),
          }
        : {
            IsNew: 'true',
            IsSelectedFromIndividual: 'true',
            CustomerID: selectedVendor?.ID,
            ...transformValues(values),
          };
      console.log('Submitted values:', payload);
      onSubmitSuccess(payload);
    },
  });
  const transformValues = (values) => {
    const transformedValues = {
      ...values,

      InputOne: Number(values.assessedValueRealProperty), // Previously Business Earnings
      InputTwo: Number(values.grossReceipts), // Previously Occupation Earnings

      OutputOne: Number(values.assessedValueTax),
      OutputTwo: Number(values.grossReceiptsTax),

      BasicTax: Number(values.BasicTax),
      Total: Number(values.Total),
      AmountPaid: Number(values.AmountPaid),
      Interest: Number(values.Interest),
      Words: values.AmountinWords,
    };
    // Remove the original frontend field names
    delete transformedValues.assessedValueRealProperty;
    delete transformedValues.assessedValueTax;

    delete transformedValues.grossReceipts;
    delete transformedValues.grossReceiptsTax;
    delete transformedValues.AmountinWords;

    return transformedValues;
  };
  // Calculate amount in words whenever AmountReceived changes
  useEffect(() => {
    calculateAmountsInWords();
  }, [formik.values.AmountPaid]);
  const calculateAmountsInWords = () => {
    const totalAmountValue = formik.values.Total;
    const totalAmountInWords = numToWords(totalAmountValue);
    formik.setFieldValue('AmountinWords', totalAmountInWords);
  };
  console.log('Formik Values:', formik.errors);
  return (
    <div className="min-h-screen">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Certificate Header Info */}
        <div className="rounded-lg border bg-white text-card-foreground shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Certificate Information
            </h3>
          </div>
          <div className="p-2 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <FormField
                  label="Year"
                  name="Year"
                  value={formik.values.Year}
                  onChange={formik.handleChange}
                  disabled={readOnly}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.Year && formik.errors.Year ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.Year}
                  </div>
                ) : null}
              </div>
              <div>
                <FormField
                  label="Place of Issue (City/Mun/Province)"
                  name="PlaceIssued"
                  value={formik.values.PlaceIssued}
                  onChange={formik.handleChange}
                  disabled={readOnly}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.PlaceIssued && formik.errors.PlaceIssued ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.PlaceIssued}
                  </div>
                ) : null}
              </div>
              <div>
                <FormField
                  label="Date Issued"
                  name="DateIssued"
                  type="date"
                  value={formik.values.DateIssued}
                  onChange={formik.handleChange}
                  disabled={readOnly}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.DateIssued && formik.errors.DateIssued ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.DateIssued}
                  </div>
                ) : null}
              </div>
              <div>
                <FormField
                  label="Certificate No."
                  name="CCNumber"
                  value={formik.values.CCNumber}
                  onChange={formik.handleChange}
                  disabled={readOnly}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 font-bold text-blue-600"
                />
                {formik.touched.CCNumber && formik.errors.CCNumber ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.CCNumber}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="text-right mb-4">
              <span className="bg-gray-100 px-3 py-1 text-sm font-medium">
                TAXPAYER'S COPY
              </span>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="rounded-lg border bg-white text-card-foreground shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Information
            </h3>
          </div>
          <div className="p-2 sm:p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    label="Company's Full Name"
                    name="Name"
                    value={formik.values.Name}
                    onChange={formik.handleChange}
                    disabled={readOnly}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.Name && formik.errors.Name ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.Name}
                    </div>
                  ) : null}
                </div>
                <div>
                  <FormField
                    label="TIN (if Any)"
                    name="TIN"
                    value={formik.values.TIN}
                    onChange={formik.handleChange}
                    disabled={readOnly}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.TIN && formik.errors.TIN ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.TIN}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    label={
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address of Principal Place of Business
                      </span>
                    }
                    name="Address"
                    value={formik.values.Address}
                    onChange={formik.handleChange}
                    disabled={readOnly}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.Address && formik.errors.Address ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.Address}
                    </div>
                  ) : null}
                </div>
                <div>
                  <FormField
                    label="Date of Registration/Incorporation"
                    name="dateOfRegistration"
                    type="date"
                    value={formik.values.dateOfRegistration}
                    onChange={formik.handleChange}
                    disabled={readOnly}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.dateOfRegistration &&
                  formik.errors.dateOfRegistration ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.dateOfRegistration}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    label="Kind of Organization"
                    name="KindofOrganization"
                    type="radio"
                    value={formik.values.KindofOrganization}
                    onChange={formik.handleChange}
                    options={organizationOptions}
                    disabled={readOnly}
                  />
                  {formik.touched.KindofOrganization &&
                  formik.errors.KindofOrganization ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.KindofOrganization}
                    </div>
                  ) : null}
                </div>
                <div>
                  <FormField
                    label="Place of Incorporation"
                    name="PlaceofIncorporation"
                    value={formik.values.PlaceofIncorporation}
                    onChange={formik.handleChange}
                    disabled={readOnly}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formik.touched.PlaceofIncorporation &&
                  formik.errors.PlaceofIncorporation ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.PlaceofIncorporation}
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <FormField
                  label="Kind/Nature of Business"
                  name="NatureOfOrganization"
                  value={formik.values.NatureOfOrganization}
                  onChange={formik.handleChange}
                  disabled={readOnly}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                />
                {formik.touched.NatureOfOrganization &&
                formik.errors.NatureOfOrganization ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.NatureOfOrganization}
                  </div>
                ) : null}
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormField
                    label="Taxable Amount"
                    name="taxableAmount"
                    value={formik.values.taxableAmount}
                    onChange={formik.handleChange}
                    disabled={readOnly}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right font-mono"
                  />
                  {formik.touched.taxableAmount &&
                  formik.errors.taxableAmount ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.taxableAmount}
                    </div>
                  ) : null}
                </div>
                <div>
                  <FormField
                    label="Community Tax Due"
                    name="communityTaxDue"
                    value={formik.values.communityTaxDue}
                    onChange={formik.handleChange}
                    disabled={readOnly}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right font-mono"
                  />
                  {formik.touched.communityTaxDue &&
                  formik.errors.communityTaxDue ? (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.communityTaxDue}
                    </div>
                  ) : null}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="rounded-lg border bg-white text-card-foreground shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-1.5 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Tax Assessment
            </h3>
          </div>
          <div className="p-2 sm:p-6">
            <div className="space-y-6">
              {/* Basic Community Tax */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-900 mb-4">
                  A. BASIC COMMUNITY TAX (₱ 500.00)
                </h3>

                <div className="flex justify-end gap-3">
                  {/* <div>
                    <FormField
                      name="basicCommunityTax"
                      value={formik.values.basicCommunityTax}
                      onChange={formik.handleChange}
                      label="Taxable Amount:"
                      disabled={readOnly}
                      className="text-right font-mono border-blue-200 focus:border-blue-500"
                    />
                    {formik.touched.basicCommunityTax &&
                    formik.errors.basicCommunityTax ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.basicCommunityTax}
                      </div>
                    ) : null}
                  </div> */}
                  <div>
                    <FormField
                      name="BasicTax"
                      label="Community Due Amount:"
                      value={formik.values.BasicTax}
                      onChange={formik.handleChange}
                      disabled={readOnly}
                      className="w-32 text-right font-mono border-blue-200 focus:border-blue-500"
                    />
                    {formik.touched.BasicTax && formik.errors.BasicTax ? (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.BasicTax}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Additional Community Tax */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-blue-900 mb-4">
                  B. ADDITIONAL COMMUNITY TAX (tax not exceed ₱10,000.00)
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center py-3 border-b border-blue-200">
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-700">
                        1. ASSESSED VALUE OF REAL PROPERTY OWNED IN THE
                        PHILIPPINES (₱2.00 FOR EVERY ₱5,000.00)
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div>
                        <FormField
                          name="assessedValueRealProperty"
                          value={formik.values.assessedValueRealProperty}
                          onChange={formik.handleChange}
                          label="Taxable Amount:"
                          disabled={readOnly}
                          className="text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Amount"
                        />
                        {formik.touched.assessedValueRealProperty &&
                        formik.errors.assessedValueRealProperty ? (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.assessedValueRealProperty}
                          </div>
                        ) : null}
                      </div>
                      <div>
                        <FormField
                          name="assessedValueTax"
                          value={formik.values.assessedValueTax}
                          onChange={formik.handleChange}
                          label="Community Due Amount:"
                          disabled={readOnly}
                          className="w-24 text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Tax"
                        />
                        {formik.touched.assessedValueTax &&
                        formik.errors.assessedValueTax ? (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.assessedValueTax}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center py-3 border-b border-blue-200">
                    <div className="lg:col-span-2">
                      <p className="text-sm text-gray-700">
                        2. GROSS RECEIPTS, INCLUDING DIVIDENDS/EARNINGS DERIVED
                        FROM BUSINESS IN THE PHIL. DURING THE PRECEDING YEAR
                        (₱2.00 FOR EVERY ₱5,000.00)
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div>
                        <FormField
                          name="grossReceipts"
                          value={formik.values.grossReceipts}
                          onChange={formik.handleChange}
                          label="Taxable Amount:"
                          disabled={readOnly}
                          className="text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Amount"
                        />
                        {formik.touched.grossReceipts &&
                        formik.errors.grossReceipts ? (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.grossReceipts}
                          </div>
                        ) : null}
                      </div>
                      <div>
                        <FormField
                          name="grossReceiptsTax"
                          value={formik.values.grossReceiptsTax}
                          onChange={formik.handleChange}
                          label="Community Due Amount:"
                          disabled={readOnly}
                          className="w-24 text-right font-mono border-blue-200 focus:border-blue-500"
                          placeholder="Tax"
                        />
                        {formik.touched.grossReceiptsTax &&
                        formik.errors.grossReceiptsTax ? (
                          <div className="text-red-500 text-sm mt-1">
                            {formik.errors.grossReceiptsTax}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg shadow-lg">
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                  {/* Left Section - Input Fields */}
                  <div className="md:w-1/3 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="font-medium block">TOTAL</label>
                        <FormField
                          name="Total"
                          value={formik.values.Total}
                          onChange={formik.handleChange}
                          disabled={readOnly}
                          className="w-full px-3 py-2 rounded bg-white/20 border border-white/30 text-right font-mono text-white focus:ring-2 focus:ring-white/50 focus:outline-none"
                        />
                        {formik.touched.Total && formik.errors.Total ? (
                          <div className="text-red-300 text-sm mt-1">
                            {formik.errors.Total}
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <label className="font-medium block">INTEREST %</label>
                        <FormField
                          name="Interest"
                          value={formik.values.Interest}
                          onChange={formik.handleChange}
                          disabled={readOnly}
                          className="w-full px-3 py-2 rounded bg-white/20 border border-white/30 text-right font-mono text-white focus:ring-2 focus:ring-white/50 focus:outline-none"
                        />
                        {formik.touched.Interest && formik.errors.Interest ? (
                          <div className="text-red-300 text-sm mt-1">
                            {formik.errors.Interest}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Middle Section - Total Amount */}
                  <div className="md:w-1/3">
                    <div className="space-y-2">
                      <label className="font-bold text-lg block">
                        TOTAL AMOUNT PAID
                      </label>
                      <FormField
                        name="AmountPaid"
                        value={formik.values.AmountPaid}
                        onChange={formik.handleChange}
                        disabled={readOnly}
                        className="w-full px-3 py-2 rounded bg-white/20 border border-white/30 text-right font-mono font-bold text-lg text-white focus:ring-2 focus:ring-white/50 focus:outline-none"
                      />
                      {formik.touched.AmountPaid && formik.errors.AmountPaid ? (
                        <div className="text-red-300 text-sm mt-1">
                          {formik.errors.AmountPaid}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Right Section - In Words */}
                  <div className="md:w-1/3 flex justify-center md:justify-end">
                    <div className="text-center md:text-right w-full md:w-auto">
                      <p className="text-sm text-white/80 mb-1">(in words)</p>
                      <p className="font-bold text-lg bg-white/10 px-3 py-2 rounded-lg inline-block w-full md:w-auto">
                        {formik.values.AmountinWords || 'ZERO'} PESOS
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <FormField
                  label="Remarks"
                  name="Remarks"
                  type="textarea"
                  value={formik.values.Remarks}
                  onChange={formik.handleChange}
                  disabled={readOnly}
                  className="min-h-24 border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter any additional Remarks here..."
                  rows={3}
                />
                {formik.touched.Remarks && formik.errors.Remarks ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.Remarks}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
          <button type="button" onClick={onBack} className="btn btn-outline">
            Close
          </button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-md transition-colors"
            // disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Generating...' : 'Generate Certificate'}
          </Button>
        </div>
      </form>
      {!formik.isValid && Object.keys(formik.errors).length > 0 && (
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
    </div>
  );
};

export default CTCForm;
