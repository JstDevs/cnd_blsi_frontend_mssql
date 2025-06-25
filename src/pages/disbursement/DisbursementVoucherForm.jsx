import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  createDisbursementVoucher,
  updateDisbursementVoucher,
} from '../../features/disbursement/disbursementVoucherSlice';

// Mock data for dropdowns
const payeeTypes = [
  { value: 'Employee', label: 'Employee' },
  { value: 'Supplier', label: 'Supplier' },
  { value: 'Contractor', label: 'Contractor' },
  { value: 'Government', label: 'Government Agency' },
];

const paymentRequests = [
  { value: 'Salary', label: 'Salary' },
  { value: 'Travel', label: 'Travel Expense' },
  { value: 'Supplies', label: 'Office Supplies' },
  { value: 'Maintenance', label: 'Maintenance' },
];

const paymentModes = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
];

const taxTypes = [
  { value: 'Withholding Tax', label: 'Withholding Tax (2%)', rate: 0.02 },
  { value: 'VAT', label: 'VAT (12%)', rate: 0.12 },
  {
    value: 'Expanded Withholding',
    label: 'Expanded Withholding Tax (1%)',
    rate: 0.01,
  },
];

const accountCodes = [
  { value: '1.02-05-991', label: '1.02-05-991 - Travel Expenses' },
  { value: '1.02-05-992', label: '1.02-05-992 - Office Supplies' },
  { value: '1.02-05-993', label: '1.02-05-993 - Maintenance' },
  { value: '1.02-05-994', label: '1.02-05-994 - Salaries' },
];

// Validation schema
const disbursementVoucherSchema = Yup.object().shape({
  dvDate: Yup.date().required('Date is required'),
  paymentDate: Yup.date().required('Payment date is required'),
  payeeType: Yup.string().required('Payee type is required'),
  payeeName: Yup.string().required('Payee name is required'),
  payeeId: Yup.string().required('Payee ID is required'),
  payeeAddress: Yup.string().required('Address is required'),
  officeUnitProject: Yup.string().required('Office/Unit/Project is required'),
  orsNumber: Yup.string().required('ORS Number is required'),
  responsibilityCenter: Yup.string().required(
    'Responsibility Center is required'
  ),
  requestForPayment: Yup.string().required('Request for Payment is required'),
  modeOfPayment: Yup.string().required('Mode of payment is required'),
  items: Yup.array()
    .of(
      Yup.object().shape({
        description: Yup.string().required('Item description is required'),
        amount: Yup.number()
          .required('Amount is required')
          .min(0, 'Amount must be greater than 0'),
        accountCode: Yup.string().required('Account code is required'),
      })
    )
    .min(1, 'At least one item is required'),
  taxes: Yup.array().of(
    Yup.object().shape({
      taxType: Yup.string().required('Tax type is required'),
      rate: Yup.number().required('Rate is required'),
      amount: Yup.number()
        .required('Amount is required')
        .min(0, 'Amount must be greater than 0'),
    })
  ),
});

function DisbursementVoucherForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotals = (items, taxes) => {
    const grossAmount = items.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
    const totalTaxes = taxes.reduce(
      (sum, tax) => sum + Number(tax.amount || 0),
      0
    );
    const netAmount = grossAmount - totalTaxes;

    return { grossAmount, totalTaxes, netAmount };
  };

  const defaultItem = {
    description: '',
    amount: '',
    accountCode: '',
  };

  const defaultTax = {
    taxType: '',
    rate: '',
    amount: '',
  };

  const initialValues = {
    dvDate: initialData?.dvDate || new Date().toISOString().split('T')[0],
    paymentDate:
      initialData?.paymentDate || new Date().toISOString().split('T')[0],
    payeeType: initialData?.payeeType || '',
    payeeName: initialData?.payeeName || '',
    payeeId: initialData?.payeeId || '',
    payeeAddress: initialData?.payeeAddress || '',
    officeUnitProject: initialData?.officeUnitProject || '',
    orsNumber: initialData?.orsNumber || '',
    responsibilityCenter: initialData?.responsibilityCenter || 'Treasury',
    requestForPayment: initialData?.requestForPayment || '',
    modeOfPayment: initialData?.modeOfPayment || '',
    items:
      Array.isArray(initialData?.items) && initialData.items.length > 0
        ? initialData.items
        : [defaultItem],
    taxes: Array.isArray(initialData?.taxes) ? initialData.taxes : [],
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);

    const { grossAmount, totalTaxes, netAmount } = calculateTotals(
      values.items,
      values.taxes
    );
    const dataToSubmit = {
      ...values,
      grossAmount,
      totalTaxes,
      netAmount,
    };

    const action = initialData
      ? updateDisbursementVoucher({
          ...dataToSubmit,
          id: initialData.id,
          dvNumber: initialData.dvNumber,
        })
      : createDisbursementVoucher(dataToSubmit);

    dispatch(action)
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting DV:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={disbursementVoucherSchema}
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
        isValid,
      }) => {
        const { grossAmount, totalTaxes, netAmount } = calculateTotals(
          values.items,
          values.taxes
        );

        const handleTaxTypeChange = (index, value) => {
          const selectedTax = taxTypes.find((tax) => tax.value === value);
          if (selectedTax) {
            setFieldValue(`taxes.${index}.taxType`, selectedTax.value);
            setFieldValue(`taxes.${index}.rate`, selectedTax.rate);
            setFieldValue(
              `taxes.${index}.amount`,
              (grossAmount * selectedTax.rate).toFixed(2)
            );
          }
        };

        const handleItemAmountChange = (index, value) => {
          setFieldValue(`items.${index}.amount`, value);
          // Recalculate tax amounts when item amounts change
          values.taxes.forEach((tax, taxIndex) => {
            if (tax.taxType) {
              const selectedTax = taxTypes.find((t) => t.value === tax.taxType);
              if (selectedTax) {
                setFieldValue(
                  `taxes.${taxIndex}.amount`,
                  (grossAmount * selectedTax.rate).toFixed(2)
                );
              }
            }
          });
        };

        return (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Payee Type"
                name="payeeType"
                type="select"
                required
                value={values.payeeType}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.payeeType}
                touched={touched.payeeType}
                options={payeeTypes}
              />

              <FormField
                label="Request for Payment"
                name="requestForPayment"
                type="select"
                required
                value={values.requestForPayment}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.requestForPayment}
                touched={touched.requestForPayment}
                options={paymentRequests}
              />

              <FormField
                label="Mode of Payment"
                name="modeOfPayment"
                type="select"
                required
                value={values.modeOfPayment}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.modeOfPayment}
                touched={touched.modeOfPayment}
                options={paymentModes}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="DV Date"
                name="dvDate"
                type="date"
                required
                value={values.dvDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dvDate}
                touched={touched.dvDate}
              />

              <FormField
                label="Payment Date"
                name="paymentDate"
                type="date"
                required
                value={values.paymentDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.paymentDate}
                touched={touched.paymentDate}
              />

              <FormField
                label="ORS Number"
                name="orsNumber"
                type="text"
                required
                value={values.orsNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.orsNumber}
                touched={touched.orsNumber}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Payee Name"
                name="payeeName"
                type="text"
                required
                value={values.payeeName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.payeeName}
                touched={touched.payeeName}
              />

              <FormField
                label="Payee ID (TIN/Employee No.)"
                name="payeeId"
                type="text"
                required
                value={values.payeeId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.payeeId}
                touched={touched.payeeId}
              />
            </div>

            <FormField
              label="Payee Address"
              name="payeeAddress"
              type="textarea"
              required
              value={values.payeeAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.payeeAddress}
              touched={touched.payeeAddress}
              rows={2}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Office/Unit/Project"
                name="officeUnitProject"
                type="text"
                required
                value={values.officeUnitProject}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.officeUnitProject}
                touched={touched.officeUnitProject}
              />

              <FormField
                label="Responsibility Center"
                name="responsibilityCenter"
                type="text"
                required
                value={values.responsibilityCenter}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.responsibilityCenter}
                touched={touched.responsibilityCenter}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Items
              </label>

              <FieldArray name="items">
                {({ remove, push }) => (
                  <div className="space-y-3">
                    {values.items.map((_, index) => (
                      <div
                        key={index}
                        className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium text-neutral-700">
                            Item #{index + 1}
                          </h4>
                          {values.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-error-600 hover:text-error-800"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>

                        <FormField
                          label="Description"
                          name={`items.${index}.description`}
                          type="text"
                          required
                          value={values.items[index].description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            errors.items &&
                            errors.items[index] &&
                            errors.items[index].description
                          }
                          touched={
                            touched.items &&
                            touched.items[index] &&
                            touched.items[index].description
                          }
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            label="Amount"
                            name={`items.${index}.amount`}
                            type="number"
                            required
                            placeholder="0.00"
                            value={values.items[index].amount}
                            onChange={(e) =>
                              handleItemAmountChange(index, e.target.value)
                            }
                            onBlur={handleBlur}
                            error={
                              errors.items &&
                              errors.items[index] &&
                              errors.items[index].amount
                            }
                            touched={
                              touched.items &&
                              touched.items[index] &&
                              touched.items[index].amount
                            }
                            min="0"
                            step="0.01"
                          />

                          <FormField
                            label="Account Code"
                            name={`items.${index}.accountCode`}
                            type="select"
                            required
                            value={values.items[index].accountCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              errors.items &&
                              errors.items[index] &&
                              errors.items[index].accountCode
                            }
                            touched={
                              touched.items &&
                              touched.items[index] &&
                              touched.items[index].accountCode
                            }
                            options={accountCodes}
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        push({ description: '', amount: '', accountCode: '' })
                      }
                      className="flex items-center text-sm text-primary-600 hover:text-primary-800 mt-2"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Item
                    </button>
                  </div>
                )}
              </FieldArray>

              <div className="mt-4 flex justify-between items-center py-3 px-4 bg-neutral-100 rounded-lg">
                <span className="text-sm font-medium text-neutral-700">
                  Gross Amount:
                </span>
                <span className="text-lg font-bold text-primary-700">
                  {new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                  }).format(grossAmount)}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Taxes/Deductions
              </label>

              <FieldArray name="taxes">
                {({ remove, push }) => (
                  <div className="space-y-3">
                    {values.taxes.map((_, index) => (
                      <div
                        key={index}
                        className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium text-neutral-700">
                            Tax #{index + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-error-600 hover:text-error-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <FormField
                          label="Tax Type"
                          name={`taxes.${index}.taxType`}
                          type="select"
                          required
                          value={values.taxes[index].taxType}
                          onChange={(e) =>
                            handleTaxTypeChange(index, e.target.value)
                          }
                          onBlur={handleBlur}
                          error={
                            errors.taxes &&
                            errors.taxes[index] &&
                            errors.taxes[index].taxType
                          }
                          touched={
                            touched.taxes &&
                            touched.taxes[index] &&
                            touched.taxes[index].taxType
                          }
                          options={taxTypes}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            label="Rate"
                            name={`taxes.${index}.rate`}
                            type="text"
                            required
                            disabled
                            value={
                              values.taxes[index].rate
                                ? `${values.taxes[index].rate * 100}%`
                                : ''
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />

                          <FormField
                            label="Amount"
                            name={`taxes.${index}.amount`}
                            type="number"
                            required
                            disabled
                            value={values.taxes[index].amount}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              errors.taxes &&
                              errors.taxes[index] &&
                              errors.taxes[index].amount
                            }
                            touched={
                              touched.taxes &&
                              touched.taxes[index] &&
                              touched.taxes[index].amount
                            }
                          />
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        push({ taxType: '', rate: '', amount: '' })
                      }
                      className="flex items-center text-sm text-primary-600 hover:text-primary-800 mt-2"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Tax/Deduction
                    </button>

                    <div className="mt-4 flex justify-between items-center py-3 px-4 bg-neutral-100 rounded-lg">
                      <span className="text-sm font-medium text-neutral-700">
                        Total Taxes/Deductions:
                      </span>
                      <span className="text-lg font-bold text-primary-700">
                        {new Intl.NumberFormat('en-PH', {
                          style: 'currency',
                          currency: 'PHP',
                        }).format(totalTaxes)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-3 px-4 bg-neutral-100 rounded-lg">
                      <span className="text-sm font-medium text-neutral-700">
                        Net Amount:
                      </span>
                      <span className="text-lg font-bold text-primary-700">
                        {new Intl.NumberFormat('en-PH', {
                          style: 'currency',
                          currency: 'PHP',
                        }).format(netAmount)}
                      </span>
                    </div>
                  </div>
                )}
              </FieldArray>
            </div>

            <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default DisbursementVoucherForm;
