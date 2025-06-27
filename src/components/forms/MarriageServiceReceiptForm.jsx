import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

const MARRIAGE_SERVICE_RECEIPT_SCHEMA = Yup.object().shape({
  invoiceNumber: Yup.string().required('Invoice number is required'),
  customer: Yup.string().required('Customer is required'),
  customerAge: Yup.number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be a whole number'),
  remarks: Yup.string().required('Remarks are required'),
  invoiceDate: Yup.date().required('Invoice date is required'),
  cenomar: Yup.string().required('CENOMAR is required'),
  marryTo: Yup.string().required('"Marry to" is required'),
  marryToAge: Yup.number()
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be a whole number'),
  registerNumber: Yup.string().required('Register number is required'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price cannot be negative'),
  remainingBalance: Yup.number()
    .required('Balance is required')
    .min(0, 'Balance cannot be negative'),
  amountReceived: Yup.number()
    .required('Amount received is required')
    .min(0, 'Amount cannot be negative'),
});

function MarriageServiceReceiptForm({ initialData, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = initialData || {
    invoiceNumber: 'MA-RE-30GE-CEIPT',
    customer: '',
    customerAge: '',
    remarks: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    cenomar: '',
    marryTo: '',
    marryToAge: '',
    registerNumber: '',
    price: 1002,
    remainingBalance: 0,
    amountReceived: 0,
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={MARRIAGE_SERVICE_RECEIPT_SCHEMA}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form className="space-y-4">
          {/* Attachments Section */}
          <div>
            <label className="block font-medium mb-2">Attachments</label>
            <input
              type="file"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {/* Invoice Number */}
          <FormField
            label="Invoice Number"
            name="invoiceNumber"
            type="text"
            required
            value={values.invoiceNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.invoiceNumber}
            touched={touched.invoiceNumber}
          />

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Customer"
              name="customer"
              type="text"
              required
              value={values.customer}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.customer}
              touched={touched.customer}
            />
            <FormField
              label="Age"
              name="customerAge"
              type="number"
              required
              value={values.customerAge}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.customerAge}
              touched={touched.customerAge}
              min="1"
            />
          </div>

          {/* Remarks */}
          <FormField
            label="Remarks"
            name="remarks"
            type="textarea"
            rows={3}
            required
            value={values.remarks}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.remarks}
            touched={touched.remarks}
          />

          {/* Invoice Date */}
          <FormField
            label="Invoice Date"
            name="invoiceDate"
            type="date"
            required
            value={values.invoiceDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.invoiceDate}
            touched={touched.invoiceDate}
          />

          {/* Marriage Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="CENOMAR"
              name="cenomar"
              type="text"
              required
              value={values.cenomar}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.cenomar}
              touched={touched.cenomar}
            />
            <FormField
              label="Marry to"
              name="marryTo"
              type="text"
              required
              value={values.marryTo}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.marryTo}
              touched={touched.marryTo}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Age"
              name="marryToAge"
              type="number"
              required
              value={values.marryToAge}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.marryToAge}
              touched={touched.marryToAge}
              min="1"
            />
            <FormField
              label="Register Number"
              name="registerNumber"
              type="text"
              required
              value={values.registerNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.registerNumber}
              touched={touched.registerNumber}
            />
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Price"
              name="price"
              type="number"
              required
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.price}
              touched={touched.price}
              min="0"
            />
            <FormField
              label="Remaining Balance"
              name="remainingBalance"
              type="number"
              required
              value={values.remainingBalance}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.remainingBalance}
              touched={touched.remainingBalance}
              min="0"
            />
            <FormField
              label="Amount Received"
              name="amountReceived"
              type="number"
              required
              value={values.amountReceived}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.amountReceived}
              touched={touched.amountReceived}
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
  );
}

export default MarriageServiceReceiptForm;
