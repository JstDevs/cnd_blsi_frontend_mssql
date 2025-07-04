import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useState } from 'react';
import { DocumentIcon } from '@heroicons/react/24/outline';
import { TrashIcon } from 'lucide-react';

const BURIAL_RECEIPT_SCHEMA = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  name: Yup.string().required('Name is required'),
  deceasedName: Yup.string().required('Deceased name is required'),
  nationality: Yup.string().required('Nationality is required'),
  age: Yup.number().required('Age is required').min(0, 'Age must be positive'),
  dateOfDeath: Yup.date().required('Date of death is required'),
  causeOfDeath: Yup.string().required('Cause of death is required'),
  cemeteryName: Yup.string().required('Cemetery name is required'),
  serviceType: Yup.string().required('Service type is required'),
  isInfectious: Yup.boolean(),
  isEmbalmed: Yup.boolean(),
  dispositionRemarks: Yup.string().when('serviceType', {
    is: (val) => ['disinter', 'remove'].includes(val),
    then: Yup.string().required('Disposition remarks are required'),
  }),
  invoiceDate: Yup.date().required('Invoice date is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
  amountReceived: Yup.number()
    .required('Amount received is required')
    .min(0, 'Amount must be positive'),
  referenceNumber: Yup.string(),
  remarks: Yup.string(),
});

function BurialServiceReceiptForm({ initialData, onClose, onSubmit }) {
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formError, setFormError] = useState(null);

  const initialValues = initialData || {
    title: 'mr',
    name: '',
    deceasedName: '',
    nationality: '',
    age: '',
    dateOfDeath: '',
    causeOfDeath: '',
    cemeteryName: '',
    serviceType: 'inter',
    isInfectious: false,
    isEmbalmed: false,
    dispositionRemarks: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    amountReceived: '',
    referenceNumber: '',
    remarks: '',
  };

  const handleServiceTypeChange = (e, setFieldValue) => {
    const value = e.target.value;
    setFieldValue('serviceType', value);
    setShowAdditionalFields(value !== 'inter');
  };

  const NAME_OPTIONS = [
    { value: 'shewin_pua_ola', label: 'Shewin, Pua, Ola' },
    { value: 'john_doe', label: 'Doe, John' },
    { value: 'jane_smith', label: 'Smith, Jane' },
  ];

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDeleteFile = (id) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setFormError(null);
      const formData = {
        ...values,
        attachments: selectedFiles,
      };
      await onSubmit(formData);
      onClose(); // Close the form after successful submission
    } catch (error) {
      setFormError(error.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
        }) => (
          <Form className="space-y-4 p-4 bg-white rounded-lg">
            {/* Error Message */}
            {formError && (
              <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                {formError}
              </div>
            )}

            {/* Attachments Section */}
            <div className="mb-4">
              <div>
                <h2 className="font-bold mb-2">Attachments</h2>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                />
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Selected Files:
                  </h3>
                  <ul className="divide-y divide-gray-200">
                    {selectedFiles.map((file) => (
                      <li
                        key={file.id}
                        className="py-2 flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-2">
                          <DocumentIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm text-gray-600 truncate max-w-xs">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({formatFileSize(file.size)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="text-center">
              <FormField
                name="receiptNumber"
                type="text"
                value="BU-RE-36AL-CEIPT"
                readOnly
                className="font-bold text-center"
              />
            </div>

            <div>
              <FormField
                label="MR. / MRS."
                name="name"
                type="select"
                options={NAME_OPTIONS}
                placeholder="Select name"
                required
                error={touched.name && errors.name}
              />
            </div>

            {/* Deceased Information */}
            <div className="space-y-4">
              <FormField
                label="Name"
                name="deceasedName"
                type="select"
                options={NAME_OPTIONS}
                required
                error={touched.deceasedName && errors.deceasedName}
              />
              <FormField
                label="Nationality"
                name="nationality"
                type="select"
                options={[
                  { value: 'filipino', label: 'Filipino' },
                  { value: 'non-filipino', label: 'Non-Filipino' },
                ]}
                required
                error={touched.nationality && errors.nationality}
              />
              <FormField
                label="Age"
                name="age"
                type="number"
                required
                error={touched.age && errors.age}
              />
              <FormField
                label="Sex"
                name="sex"
                type="select"
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                ]}
                required
                error={touched.sex && errors.sex}
              />
              <FormField
                label="Date of Death"
                name="dateOfDeath"
                type="date"
                required
                error={touched.dateOfDeath && errors.dateOfDeath}
              />
              <FormField
                label="Cause of Death"
                name="causeOfDeath"
                type="text"
                required
                error={touched.causeOfDeath && errors.causeOfDeath}
              />
              <FormField
                label="Name of Cemetery"
                name="cemeteryName"
                type="text"
                required
                error={touched.cemeteryName && errors.cemeteryName}
              />
            </div>

            {/* Service Type Radio Buttons */}
            <div className="space-y-2">
              <label className="block font-medium">Service Type</label>
              <div className="flex space-x-4">
                {['inter', 'disinter', 'remove'].map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="serviceType"
                      value={type}
                      checked={values.serviceType === type}
                      onChange={(e) =>
                        handleServiceTypeChange(e, setFieldValue)
                      }
                      className="form-radio"
                    />
                    <span className="ml-2">{type.toUpperCase()}</span>
                  </label>
                ))}
              </div>
              {touched.serviceType && errors.serviceType && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.serviceType}
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
                      name="isInfectious"
                      checked={values.isInfectious}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2">Infectious</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="isEmbalmed"
                      checked={values.isEmbalmed}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <span className="ml-2">Embalmed</span>
                  </label>
                </div>
                <FormField
                  label="Disposition of Remains"
                  name="dispositionRemarks"
                  type="textarea"
                  rows={2}
                  required={values.serviceType !== 'inter'}
                  error={
                    touched.dispositionRemarks && errors.dispositionRemarks
                  }
                />
              </div>
            )}

            {/* Payment Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Invoice Date"
                name="invoiceDate"
                type="date"
                required
                error={touched.invoiceDate && errors.invoiceDate}
              />
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
                error={touched.paymentMethod && errors.paymentMethod}
              />
              <FormField
                label="Amount Received"
                name="amountReceived"
                type="number"
                required
                min="0"
                error={touched.amountReceived && errors.amountReceived}
              />
              <FormField
                label="Reference Number"
                name="referenceNumber"
                type="text"
                error={touched.referenceNumber && errors.referenceNumber}
              />
            </div>

            {/* Remarks */}
            <FormField
              label="Remarks"
              name="remarks"
              type="textarea"
              rows={2}
              error={touched.remarks && errors.remarks}
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
