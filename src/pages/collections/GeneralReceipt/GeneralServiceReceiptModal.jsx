import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import Modal from '@/components/common/Modal';
import FormField from '@/components/common/FormField';

const generalServiceReceiptSchema = Yup.object().shape({
  status: Yup.string().required('Status is required'),
  pgiNumber: Yup.string().required('PGI number is required'),
  date: Yup.date().required('Date is required'),
  agency: Yup.string().required('Agency is required'),
  fund: Yup.string().required('Fund is required'),
  payorType: Yup.string().required('Payor type is required'),
  payorName: Yup.string().required('Payor name is required'),
  paymentMethod: Yup.string().required('Payment method is required'),
  items: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required('Item name is required'),
        chargesAccount: Yup.string().required('Charges account is required'),
        quantity: Yup.number()
          .required('Quantity is required')
          .min(1, 'Quantity must be at least 1'),
        price: Yup.number()
          .required('Price is required')
          .min(0, 'Price cannot be negative'),
        vatable: Yup.boolean().required('VAT status is required'),
      })
    )
    .min(1, 'At least one item is required'),
  remarks: Yup.string(),
});

function GeneralServiceReceiptModal({
  isOpen,
  onClose,
  selectedReceipt,
  onSubmit,
}) {
  const [payorType, setPayorType] = useState('Individual');

  // Sample data for payor names based on type
  const payorOptions = {
    Individual: [
      { value: 'jeric_morning_star', label: 'Jeric Morning Star' },
      { value: 'john_doe', label: 'John Doe' },
      { value: 'jane_smith', label: 'Jane Smith' },
    ],
    Corporation: [
      { value: 'abc_corp', label: 'ABC Corporation' },
      { value: 'xyz_inc', label: 'XYZ Inc.' },
      { value: 'sample_co', label: 'Sample Company' },
    ],
  };

  const initialValues = selectedReceipt || {
    status: 'posted',
    pgiNumber: '',
    date: new Date().toISOString().split('T')[0],
    agency: '',
    fund: 'Special Education Fund',
    payorType: 'Individual',
    payorName: '',
    paymentMethod: 'cash',
    bank: '',
    number: '',
    paymentDate: '1900-01-01',
    documentNumber: '',
    remarks: '',
    items: [
      {
        name: '',
        chargesAccount: 'Traffic Violation',
        quantity: 1,
        price: 0,
        vatable: false,
      },
    ],
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        selectedReceipt
          ? 'Edit General Service Receipt'
          : 'New General Service Receipt'
      }
      size="xl"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={generalServiceReceiptSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Section 1: Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-lg">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1 px-3 py-2 bg-gray-100 rounded-md">
                    {values.status.toUpperCase()}
                  </div>
                </div>
                <FormField
                  label="No. PGI"
                  name="pgiNumber"
                  type="text"
                  required
                />
              </div>

              <FormField label="Date" name="date" type="date" required />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Agency" name="agency" type="text" required />
                <FormField label="Fund" name="fund" type="text" required />
              </div>
            </div>

            {/* Section 2: Payor Information */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-lg">Payor Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taxpayer Type
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPayorType('Individual');
                      setFieldValue('payorType', 'Individual');
                      setFieldValue('payorName', '');
                    }}
                    className={`px-4 py-2 rounded-md ${
                      values.payorType === 'Individual'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPayorType('Corporation');
                      setFieldValue('payorType', 'Corporation');
                      setFieldValue('payorName', '');
                    }}
                    className={`px-4 py-2 rounded-md ${
                      values.payorType === 'Corporation'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Corporation
                  </button>
                </div>
              </div>

              <FormField
                label="Payor"
                name="payorName"
                type="select"
                options={payorOptions[values.payorType]}
                required
              />
            </div>

            {/* Section 3: Items */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-lg">Items</h3>

              <FieldArray name="items">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    {values.items.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end"
                      >
                        <FormField
                          label="Item"
                          name={`items.${index}.name`}
                          type="text"
                          required
                          className="md:col-span-2"
                        />
                        <FormField
                          label="Charges Account"
                          name={`items.${index}.chargesAccount`}
                          type="text"
                          required
                          className="md:col-span-1"
                        />
                        <FormField
                          label="Qty"
                          name={`items.${index}.quantity`}
                          type="number"
                          required
                          min="1"
                          className="md:col-span-1"
                        />
                        <FormField
                          label="Price"
                          name={`items.${index}.price`}
                          type="number"
                          required
                          min="0"
                          className="md:col-span-1"
                        />
                        <div className="flex items-center space-x-2 md:col-span-1">
                          <div className="flex items-center">
                            <Field
                              type="checkbox"
                              name={`items.${index}.vatable`}
                              id={`items.${index}.vatable`}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`items.${index}.vatable`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              VATable
                            </label>
                          </div>
                          <div className="text-sm font-medium">
                            Subtotal: {(item.quantity * item.price).toFixed(2)}
                          </div>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          name: '',
                          chargesAccount: 'Traffic Violation',
                          quantity: 1,
                          price: 0,
                          vatable: false,
                        })
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      + Add Item
                    </button>
                  </div>
                )}
              </FieldArray>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Total
                  </label>
                  <div className="mt-1 px-3 py-2 bg-gray-100 rounded-md">
                    {values.items
                      .reduce(
                        (sum, item) => sum + item.quantity * item.price,
                        0
                      )
                      .toFixed(2)}
                  </div>
                </div>
                <FormField
                  label="Amount in Words"
                  name="amountInWords"
                  type="text"
                  value={`${convertToWords(
                    values.items.reduce(
                      (sum, item) => sum + item.quantity * item.price,
                      0
                    )
                  )} PESOS`}
                  readOnly
                />
              </div>
            </div>

            {/* Section 4: Payment Information */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-lg">Payment Information</h3>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setFieldValue('paymentMethod', 'cash')}
                      className={`w-full text-left px-4 py-2 rounded-md ${
                        values.paymentMethod === 'cash'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Cash
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="block font-medium">Drawee</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue('paymentMethod', 'treasury')
                        }
                        className={`px-3 py-1 rounded-md text-sm ${
                          values.paymentMethod === 'treasury'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Treasury Warrant
                      </button>
                      <button
                        type="button"
                        onClick={() => setFieldValue('paymentMethod', 'check')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          values.paymentMethod === 'check'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Check
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue('paymentMethod', 'moneyOrder')
                        }
                        className={`px-3 py-1 rounded-md text-sm ${
                          values.paymentMethod === 'moneyOrder'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Money Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {values.paymentMethod !== 'cash' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Bank" name="bank" type="text" />
                    <FormField label="Number" name="number" type="text" />
                    <FormField label="Date" name="paymentDate" type="date" />
                  </div>

                  <FormField
                    label={`${
                      values.paymentMethod === 'treasury'
                        ? 'Treasury Warrant'
                        : values.paymentMethod === 'check'
                        ? 'Check'
                        : 'Money Order'
                    } Number`}
                    name="documentNumber"
                    type="text"
                  />

                  <FormField
                    label={`Date of ${
                      values.paymentMethod === 'treasury'
                        ? 'Treasury Warrant'
                        : values.paymentMethod === 'check'
                        ? 'Check'
                        : 'Money Order'
                    }`}
                    name="paymentDate"
                    type="date"
                  />
                </>
              )}

              <FormField
                label="Remarks"
                name="remarks"
                type="textarea"
                rows={2}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

// Helper function to convert numbers to words (you'll need to implement this)
function convertToWords(num) {
  if (num === 0) return 'ZERO';
  // ... conversion logic ...
  return 'ZERO'; // Placeholder
}

export default GeneralServiceReceiptModal;
