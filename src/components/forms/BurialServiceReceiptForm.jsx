import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useState } from 'react';

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
  // Sample names data - replace with your actual data source
  const NAME_OPTIONS = [
    { value: 'shewin_pua_ola', label: 'Shewin, Pua, Ola' },
    { value: 'john_doe', label: 'Doe, John' },
    { value: 'jane_smith', label: 'Smith, Jane' },
    // Add more names as needed
  ];
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={BURIAL_RECEIPT_SCHEMA}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, setFieldValue }) => (
        <Form className="space-y-4 p-4 bg-white rounded-lg">
          {/* Attachments Section */}
          <div>
            <h2 className="font-bold mb-2">Attachments</h2>
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

          {/* Receipt Header */}
          <div className="text-center">
            {/* <h2 className="font-bold">
              CITY/MUNICIPAL BURIAL PERMIT AND FREE RECEIPT
            </h2> */}
            <FormField
              // label="No."
              name="receiptNumber"
              type="text"
              // required
              value="BU-RE-36AL-CEIPT"
              readOnly
              className="font-bold text-center"
            />
          </div>

          {/* Title and Name */}
          {/* Name Section */}
          <div>
            {/* <label className="block font-medium">MR. / MRS.</label> */}
            <FormField
              label="MR. / MRS."
              name="name"
              type="select"
              options={NAME_OPTIONS}
              placeholder="Select name"
              required
            />
          </div>

          {/* Deceased Information */}
          <div className="space-y-4">
            <FormField label="Name" name="deceasedName" type="text" required />
            <FormField
              label="Nationality"
              name="nationality"
              type="text"
              required
            />
            <FormField label="Age" name="age" type="number" required />
            <FormField
              label="Date of Death"
              name="dateOfDeath"
              type="date"
              required
            />
            <FormField
              label="Cause of Death"
              name="causeOfDeath"
              type="text"
              required
            />
            <FormField
              label="Name of Cemetery"
              name="cemeteryName"
              type="text"
              required
            />
          </div>

          {/* Service Type Radio Buttons */}
          <div className="space-y-2">
            <label className="block font-medium">Service Type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="serviceType"
                  value="inter"
                  checked={values.serviceType === 'inter'}
                  onChange={(e) => handleServiceTypeChange(e, setFieldValue)}
                  className="form-radio"
                />
                <span className="ml-2">INTER</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="serviceType"
                  value="disinter"
                  checked={values.serviceType === 'disinter'}
                  onChange={(e) => handleServiceTypeChange(e, setFieldValue)}
                  className="form-radio"
                />
                <span className="ml-2">DISINTER</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="serviceType"
                  value="remove"
                  checked={values.serviceType === 'remove'}
                  onChange={(e) => handleServiceTypeChange(e, setFieldValue)}
                  className="form-radio"
                />
                <span className="ml-2">REMOVE</span>
              </label>
            </div>
          </div>

          {/* Additional Fields (shown when not INTER) */}
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
            />
            <FormField
              label="Payment Method"
              name="paymentMethod"
              type="text"
              required
            />
            <FormField
              label="Amount Received"
              name="amountReceived"
              type="number"
              required
              min="0"
            />
            <FormField
              label="Reference Number"
              name="referenceNumber"
              type="text"
            />
          </div>

          {/* Remarks */}
          <FormField label="Remarks" name="remarks" type="textarea" rows={2} />

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
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default BurialServiceReceiptForm;
