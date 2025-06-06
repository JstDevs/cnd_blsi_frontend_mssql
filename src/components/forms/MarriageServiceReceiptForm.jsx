import { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

const MARRIAGE_SERVICE_RECEIPT_SCHEMA = Yup.object().shape({
  status: Yup.string().required('Status is required'),
  apAr: Yup.string().required('AP/AR is required'),
  customer: Yup.string().required('Customer is required'),
  totalAmount: Yup.number()
    .typeError('Must be a number')
    .required('Total Amount is required')
    .min(0, 'Amount must be positive'),
  amountReceived: Yup.number()
    .typeError('Must be a number')
    .required('Amount Received is required')
    .min(0, 'Amount must be positive'),
  credit: Yup.number()
    .typeError('Must be a number')
    .required('Credit is required')
    .min(0, 'Amount must be positive'),
  debit: Yup.number()
    .typeError('Must be a number')
    .required('Debit is required')
    .min(0, 'Amount must be positive'),
  ewt: Yup.number()
    .typeError('Must be a number')
    .required('EWT is required')
    .min(0, 'Amount must be positive'),
  withheldAmount: Yup.number()
    .typeError('Must be a number')
    .required('Withheld Amount is required')
    .min(0, 'Amount must be positive'),
  total: Yup.number()
    .typeError('Must be a number')
    .required('Total is required')
    .min(0, 'Amount must be positive'),
  discountPercent: Yup.number()
    .typeError('Must be a number')
    .required('Discount Percent is required')
    .min(0, 'Discount must be between 0 and 100')
    .max(100, 'Discount must be between 0 and 100'),
  amountDue: Yup.number()
    .typeError('Must be a number')
    .required('Amount Due is required')
    .min(0, 'Amount must be positive'),
});

function MarriageServiceReceiptForm({ initialData, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = initialData || {
    status: '',
    apAr: '',
    customer: '',
    totalAmount: '',
    amountReceived: '',
    credit: '',
    debit: '',
    ewt: '',
    withheldAmount: '',
    total: '',
    discountPercent: '',
    amountDue: '',
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Status"
              name="status"
              type="select"
              required
              value={values.status}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.status}
              touched={touched.status}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />

            <FormField
              label="AP/AR"
              name="apAr"
              type="text"
              required
              value={values.apAr}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.apAr}
              touched={touched.apAr}
              placeholder="Enter AP/AR"
            />
          </div>

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
            placeholder="Enter customer name"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Total Amount"
              name="totalAmount"
              type="number"
              required
              value={values.totalAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.totalAmount}
              touched={touched.totalAmount}
              placeholder="Enter total amount"
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
              placeholder="Enter amount received"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Credit"
              name="credit"
              type="number"
              required
              value={values.credit}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.credit}
              touched={touched.credit}
              placeholder="Enter credit amount"
            />

            <FormField
              label="Debit"
              name="debit"
              type="number"
              required
              value={values.debit}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.debit}
              touched={touched.debit}
              placeholder="Enter debit amount"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="EWT"
              name="ewt"
              type="number"
              required
              value={values.ewt}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.ewt}
              touched={touched.ewt}
              placeholder="Enter EWT amount"
            />

            <FormField
              label="Withheld Amount"
              name="withheldAmount"
              type="number"
              required
              value={values.withheldAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.withheldAmount}
              touched={touched.withheldAmount}
              placeholder="Enter withheld amount"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Total"
              name="total"
              type="number"
              required
              value={values.total}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.total}
              touched={touched.total}
              placeholder="Enter total"
            />

            <FormField
              label="Discount (%)"
              name="discountPercent"
              type="number"
              required
              value={values.discountPercent}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.discountPercent}
              touched={touched.discountPercent}
              placeholder="Enter discount percentage"
            />
          </div>

          <FormField
            label="Amount Due"
            name="amountDue"
            type="number"
            required
            value={values.amountDue}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.amountDue}
            touched={touched.amountDue}
            placeholder="Enter amount due"
          />

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
              className="btn btn-primary"
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