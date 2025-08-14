import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useEffect, useState } from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { Paperclip, Trash2, TrashIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '@/features/settings/customersSlice';
import SearchableDropdown from '../common/SearchableDropdown';
import toast from 'react-hot-toast';

const BURIAL_RECEIPT_SCHEMA = Yup.object().shape({
  CustomerName: Yup.string().required('Name is required'),
  CustomerID: Yup.number(),
  DeceasedCustomerName: Yup.string().required('Deceased name is required'),
  DeceasedCustomerID: Yup.number(),

  Nationality: Yup.string().required('Nationality is required'),
  NationalityID: Yup.number().required('Nationality is required'),
  Age: Yup.number().required('Age is required').min(0, 'Age must be positive'),
  Sex: Yup.string().required('Sex is required'),
  DeathDate: Yup.date().required('Date of death is required'),
  CauseofDeath: Yup.string().required('Cause of death is required'),
  Cementery: Yup.string().required('Cemetery name is required'),
  BurialType: Yup.string().required('Service type is required'),
  Infectious: Yup.boolean(),
  Embalmed: Yup.boolean(),
  Disposition: Yup.string().when('BurialType', {
    is: (val) => ['disinter', 'remove'].includes(val),
    then: Yup.string().required('Disposition remarks are required'),
  }),
  InvoiceDate: Yup.date().required('Invoice date is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
  Total: Yup.number()
    .required('Amount received is required')
    .min(0, 'Amount must be positive'),
  referenceNumber: Yup.string(),
  Remarks: Yup.string(),
});
const API_URL = import.meta.env.VITE_API_URL;
function BurialServiceReceiptForm({
  initialData,
  onClose,
  onSubmit,
  nationalities,
  customers,
}) {
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const initialValues = {
    InvoiceNumber: initialData?.InvoiceNumber || '',
    Name: initialData?.Name || '',
    DeceasedCustomerName: initialData?.DeceasedCustomerName || '',
    DeceasedCustomerID: initialData?.DeceasedCustomerID || '',
    Nationality: initialData?.Nationality || '',
    NationalityID: initialData?.NationalityID || '',
    Age: initialData?.Age || '',
    Sex: initialData?.Sex || '',
    DeathDate: initialData?.DeathDate || '',
    CauseofDeath: initialData?.CauseofDeath || '',
    Cementery: initialData?.Cementery || '',
    BurialType: initialData?.BurialType || 'inter',
    Infectious: initialData?.Infectious || false,
    Embalmed: initialData?.Embalmed || false,
    Disposition: initialData?.Disposition || '',
    InvoiceDate:
      initialData?.InvoiceDate || new Date().toISOString().split('T')[0],
    CustomerName: initialData?.CustomerName || '',
    CustomerID: initialData?.CustomerID || '',
    paymentMethod: initialData?.paymentMethod || '',
    Total: initialData?.Total || '',
    ReferenceNumber: initialData?.ReferenceNumber || '',
    Remarks: initialData?.Remarks || '',
    Attachments: initialData?.Attachments || [],
  };
  // -------------FILE UPLOAD-------------
  const handleFileUpload = (event, setFieldValue, values) => {
    const files = Array.from(event.target.files);

    // Create new attachments array with just the File objects
    const newAttachments = files.map((file) => file); // Just store the File objects directly

    // Combine with existing attachments
    setFieldValue('Attachments', [...values.Attachments, ...newAttachments]);
  };
  // -----------REMOVE ATTACHMENT-------------
  const removeAttachment = (index, setFieldValue, values) => {
    const updatedAttachments = [...values.Attachments];
    updatedAttachments.splice(index, 1);
    setFieldValue('Attachments', updatedAttachments);
  };

  const handleServiceTypeChange = (e, setFieldValue) => {
    const value = e.target.value;
    setFieldValue('BurialType', value);
    setShowAdditionalFields(value !== 'INTER');
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    // setFormError(null);
    console.log('Form values:', values);
    try {
      await onSubmit(values);
      onClose(); // Close the form after successful submission
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error(error.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  const individualOptions = customers?.map((customer) => ({
    value: customer.ID,
    label:
      customer.Name ||
      `${customer.FirstName} ${customer.MiddleName} ${customer.LastName}`,
  }));
  const nationalitiesOptions = nationalities?.map((Nationality) => ({
    value: Nationality.ID,
    label: Nationality.Name,
  }));
  return (
    <div className="space-y-4">
      <div className="w-full pt-4 flex justify-end gap-4 items-center">
        <button type="button" className="btn btn-secondary flex-initial">
          Show List
        </button>
        <button className="btn btn-outline flex-initial">Print</button>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={BURIAL_RECEIPT_SCHEMA}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          isSubmitting,
          handleBlur,
          submitCount,
        }) => (
          <Form className="space-y-4  bg-white rounded-lg">
            {/* Attachments Section */}
            <div className="mb-4">
              <div className="space-y-2">
                <h2 className="font-bold mb-2">Attachments</h2>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e, setFieldValue, values)}
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                />
              </div>
              {values.Attachments.length > 0 ? (
                <div className="space-y-2 py-2 mt-2">
                  {values.Attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm">
                          {file.ID ? (
                            <a
                              href={`${API_URL}/uploads/${file.DataImage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {file.name || file.DataName}
                            </a>
                          ) : (
                            file.name || file.DataName
                          )}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeAttachment(index, setFieldValue, values)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  No attachments added
                </p>
              )}
            </div>

            {/* Form Fields */}
            <div className="text-center">
              <FormField
                name="InvoiceNumber"
                type="text"
                value={values.InvoiceNumber || 'BU-RE-36AL-CEIPT'}
                readOnly
                className="font-bold text-center"
              />
            </div>

            <div>
              <SearchableDropdown
                label="MR. / MRS."
                name="CustomerName"
                type="select"
                options={individualOptions}
                required
                placeholder="Select Name"
                onSelect={(value) => {
                  const selectedOption = individualOptions.find(
                    (option) => option.value === value
                  );
                  setFieldValue('CustomerName', selectedOption?.label || '');
                  setFieldValue('CustomerID', selectedOption?.value || '');
                }}
                selectedValue={values.CustomerID}
                error={errors.CustomerName}
                touched={touched.CustomerName}
              />
            </div>

            {/* Deceased Information */}
            <div className="space-y-4">
              <SearchableDropdown
                label="Name of Deceased"
                name="DeceasedCustomerName"
                type="select"
                options={individualOptions}
                required
                placeholder="Select Name"
                onSelect={(value) => {
                  const selectedOption = individualOptions.find(
                    (option) => option.value === value
                  );
                  setFieldValue(
                    'DeceasedCustomerName',
                    selectedOption?.label || ''
                  );
                  setFieldValue(
                    'DeceasedCustomerID',
                    selectedOption?.value || ''
                  );
                }}
                selectedValue={values.DeceasedCustomerID}
                error={errors.DeceasedCustomerName}
                touched={touched.DeceasedCustomerName}
              />
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
                label="Age"
                name="Age"
                type="number"
                required
                value={values.Age}
                onChange={handleChange}
                touched={touched.Age}
                error={touched.Age && errors.Age}
              />
              <FormField
                label="Sex"
                name="Sex"
                type="select"
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                ]}
                value={values.Sex}
                onChange={handleChange}
                touched={touched.Sex}
                required
                error={touched.sex && errors.sex}
              />
              <FormField
                label="Date of Death"
                name="DeathDate"
                type="date"
                required
                value={values.DeathDate}
                onChange={handleChange}
                touched={touched.DeathDate}
                error={touched.DeathDate && errors.DeathDate}
              />
              <FormField
                label="Cause of Death"
                name="CauseofDeath"
                type="text"
                required
                value={values.CauseofDeath}
                onChange={handleChange}
                touched={touched.CauseofDeath}
                error={touched.CauseofDeath && errors.CauseofDeath}
              />
              <FormField
                label="Name of Cemetery"
                name="Cementery"
                type="text"
                required
                value={values.Cementery}
                onChange={handleChange}
                touched={touched.Cementery}
                error={touched.Cementery && errors.Cementery}
              />
            </div>

            {/* Service Type Radio Buttons */}
            <div className="space-y-2">
              <label className="block font-medium">Service Type</label>
              <div className="flex space-x-4">
                {['INTER', 'DISINTER', 'REMOVE'].map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="BurialType"
                      value={type}
                      checked={values.BurialType === type}
                      onChange={(e) =>
                        handleServiceTypeChange(e, setFieldValue)
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">{type.toUpperCase()}</span>
                  </label>
                ))}
              </div>
              {touched.BurialType && errors.BurialType && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.BurialType}
                </div>
              )}
            </div>

            {/* Additional Fields */}
            {showAdditionalFields && (
              <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="Infectious"
                      value={values.Infectious}
                      checked={values.Infectious}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2">Infectious</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="Embalmed"
                      value={values.Embalmed}
                      checked={values.Embalmed}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2">Embalmed</span>
                  </label>
                </div>
                <FormField
                  label="Disposition of Remains"
                  name="Disposition"
                  type="textarea"
                  rows={2}
                  value={values.Disposition}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required={values.BurialType !== 'INTER'}
                  error={touched.Disposition && errors.Disposition}
                />
              </div>
            )}

            {/* Payment Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Invoice Date"
                name="InvoiceDate"
                type="date"
                required
                value={values.InvoiceDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.InvoiceDate && errors.InvoiceDate}
              />
              {/* TODO : Add Payment Method */}
              <FormField
                label="Payment Method"
                name="paymentMethod"
                type="select"
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'check', label: 'Check' },
                  { value: 'card', label: 'Credit Card' },
                ]}
                required
                value={values.paymentMethod}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.paymentMethod}
                error={touched.paymentMethod && errors.paymentMethod}
              />
              <FormField
                label="Amount Received"
                name="Total"
                type="number"
                required
                min="0"
                value={values.Total}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.Total}
                error={touched.Total && errors.Total}
              />
              <FormField
                label="Reference Number"
                name="ReferenceNumber"
                type="text"
                value={values.ReferenceNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.ReferenceNumber}
                error={touched.ReferenceNumber && errors.ReferenceNumber}
              />
            </div>

            {/* Remarks */}
            <FormField
              label="Remarks"
              name="Remarks"
              type="textarea"
              rows={2}
              value={values.Remarks}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.Remarks}
              error={touched.Remarks && errors.Remarks}
            />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            {/* Error Message */}
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
        )}
      </Formik>
    </div>
  );
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default BurialServiceReceiptForm;
