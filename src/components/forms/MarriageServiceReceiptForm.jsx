import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { Paperclip, Trash2, TrashIcon } from 'lucide-react';
import { DocumentIcon } from '@heroicons/react/24/outline';
import SearchableDropdown from '../common/SearchableDropdown';
import toast from 'react-hot-toast';
const API_URL = import.meta.env.VITE_API_URL;
const MARRIAGE_SERVICE_RECEIPT_SCHEMA = Yup.object().shape({
  InvoiceNumber: Yup.string().required('Invoice number is required'),
  CustomerName: Yup.string().required('Customer is required'),
  CustomerAge: Yup.number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be a whole number'),
  Remarks: Yup.string().required('Remarks are required'),
  InvoiceDate: Yup.date().required('Invoice date is required'),
  Cenomar: Yup.string().required('CENOMAR is required'),
  MarrytoID: Yup.string().required('"Marry to" is required'),
  MarrytoName: Yup.string().required('"Marry to Name" is required'),
  MarrytoAge: Yup.number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be a whole number'),
  RegisterNumber: Yup.string().required('Register number is required'),
  Total: Yup.number()
    .required('Price is required')
    .min(0, 'Price cannot be negative'),
  RemainingBalance: Yup.number()
    .required('Balance is required')
    .min(0, 'Balance cannot be negative'),
  AmountReceived: Yup.number()
    .required('Amount received is required')
    .min(0, 'Amount cannot be negative'),

  Attachments: Yup.array(),
});

function MarriageServiceReceiptForm({
  initialData,
  customers,
  onClose,
  onSubmit,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const initialValues = {
    InvoiceNumber: initialData?.InvoiceNumber || 'MA-RE-30GE-CEIPT',
    CustomerName: initialData?.CustomerName || '',
    CustomerAge: initialData?.CustomerAge || '',
    Remarks: initialData?.Remarks || '',
    InvoiceDate:
      initialData?.InvoiceDate || new Date().toISOString().split('T')[0],
    Cenomar: initialData?.Cenomar || '',
    MarrytoID: initialData?.MarrytoID || '',
    MarrytoName: initialData?.MarrytoName || '',
    MarrytoAge: initialData?.MarrytoAge || '',
    RegisterNumber: initialData?.RegisterNumber || '',
    Total: initialData?.Total || 0,
    RemainingBalance: initialData?.RemainingBalance || 0,
    AmountReceived: initialData?.AmountReceived || 0,

    Attachments: initialData?.Attachments || [],
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // const handleFileChange = (e) => {
  //   if (e.target.files) {
  //     const newFiles = Array.from(e.target.files).map((file) => ({
  //       file,
  //       id: Math.random().toString(36).substring(2, 9),
  //       name: file.name,
  //       size: file.size,
  //       type: file.type,
  //     }));
  //     setSelectedFiles((prev) => [...prev, ...newFiles]);
  //   }
  // };

  // const handleDeleteFile = (id) => {
  //   setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
  // };
  // // Helper function to format file size
  // function formatFileSize(bytes) {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  // }
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
  const individualOptions = customers?.map((customer) => ({
    value: customer.ID,
    label:
      customer.Name ||
      `${customer.FirstName} ${customer.MiddleName} ${customer.LastName}`,
  }));
  return (
    <div className="space-y-4">
      <div className="w-full pt-4 flex justify-end gap-4 items-center">
        <button
          type="button"
          // onClick={handleShowList}
          className="btn btn-secondary flex-initial"
        >
          Show List
        </button>
        <button className="btn btn-outline flex-initial">Print</button>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={MARRIAGE_SERVICE_RECEIPT_SCHEMA}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
        }) => (
          <Form className="space-y-4">
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
              {values?.Attachments.length > 0 ? (
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

            {/* Invoice Number */}
            <FormField
              label="Invoice Number"
              name="InvoiceNumber"
              type="text"
              // required
              disabled
              readOnly
              value={values.InvoiceNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.InvoiceNumber}
              touched={touched.InvoiceNumber}
              className="bg-gray-200 cursor-not-allowed"
            />

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* <FormField
                label="Customer"
                name="customer"
                type="text"
                required
                value={values.customer}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.customer}
                touched={touched.customer}
              /> */}

              <SearchableDropdown
                label="Customer"
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
              <FormField
                label="Age"
                name="CustomerAge"
                type="number"
                placeholder="Enter customer age"
                required
                value={values.CustomerAge}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.CustomerAge}
                touched={touched.CustomerAge}
                min="1"
              />
            </div>

            {/* Remarks */}
            <FormField
              label="Remarks"
              name="Remarks"
              type="textarea"
              placeholder="Enter remarks"
              rows={3}
              required
              value={values.Remarks}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Remarks}
              touched={touched.Remarks}
            />

            {/* Invoice Date */}
            <FormField
              label="Invoice Date"
              name="InvoiceDate"
              type="date"
              placeholder="Enter invoice date"
              required
              value={values.InvoiceDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.InvoiceDate}
              touched={touched.InvoiceDate}
            />

            {/* Marriage Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="CENOMAR"
                name="Cenomar"
                type="text"
                required
                placeholder="Enter CENOMAR"
                value={values.Cenomar}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Cenomar}
                touched={touched.Cenomar}
              />
              <SearchableDropdown
                label="Marry to"
                name="MarrytoID"
                type="select"
                options={individualOptions}
                required
                placeholder="Select Marry to"
                onSelect={(value) => {
                  const selectedOption = individualOptions.find(
                    (option) => option.value === value
                  );
                  setFieldValue('MarrytoName', selectedOption?.label || '');
                  setFieldValue('MarrytoID', selectedOption?.value || '');
                }}
                selectedValue={values.MarrytoID}
                error={errors.MarrytoName}
                touched={touched.MarrytoName}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Age"
                name="MarrytoAge"
                type="number"
                required
                placeholder="Enter Marry to age"
                value={values.MarrytoAge}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.MarrytoAge}
                touched={touched.MarrytoAge}
                min="1"
              />
              <FormField
                label="Register Number"
                name="RegisterNumber"
                type="text"
                required
                placeholder="Enter register number"
                value={values.RegisterNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.RegisterNumber}
                touched={touched.RegisterNumber}
              />
            </div>

            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Price"
                name="Total"
                type="number"
                required
                placeholder="Enter price"
                value={values.Total}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Total}
                touched={touched.Total}
                min="0"
              />
              <FormField
                label="Remaining Balance"
                name="RemainingBalance"
                type="number"
                required
                placeholder="Enter remaining balance"
                value={values.RemainingBalance}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.RemainingBalance}
                touched={touched.RemainingBalance}
                min="0"
              />
              <FormField
                label="Amount Received"
                name="AmountReceived"
                type="number"
                required
                placeholder="Enter amount received"
                value={values.AmountReceived}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.AmountReceived}
                touched={touched.AmountReceived}
                min="0"
              />
            </div>

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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {initialData ? 'Update' : 'Create'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default MarriageServiceReceiptForm;
