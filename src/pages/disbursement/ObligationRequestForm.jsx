import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  createObligationRequest,
  updateObligationRequest,
} from '../../features/disbursement/obligationRequestSlice';

// Validation schema for obligation request
const obligationRequestSchema = Yup.object().shape({
  orsDate: Yup.date().required('Date is required'),
  payeeType: Yup.string().required('Payee type is required'),
  payeeName: Yup.string().required('Payee name is required'),
  payeeAddress: Yup.string(),
  requestingOffice: Yup.string().required('Requesting office is required'),
  fund: Yup.string().required('Fund is required'),
  lineItems: Yup.array()
    .of(
      Yup.object().shape({
        accountCode: Yup.string().required('Account code is required'),
        responsibilityCenter: Yup.string().required(
          'Responsibility Center is required'
        ),
        particulars: Yup.string().required('Particulars are required'),
        remarks: Yup.string(),
        changeAccount: Yup.string(),
        quantity: Yup.number().min(0, 'Quantity cannot be negative'),
        itemPrice: Yup.number().min(0, 'Price cannot be negative'),
        vatable: Yup.boolean(),
        fpp: Yup.string(),
        taxCode: Yup.string(),
        taxRate: Yup.number()
          .min(0, 'Tax rate cannot be negative')
          .max(100, 'Tax rate cannot exceed 100%'),
        withheldAndEWT: Yup.number().min(0, 'Value cannot be negative'),
        discounts: Yup.number()
          .min(0, 'Discount cannot be negative')
          .max(100, 'Discount cannot exceed 100%'),
        unit: Yup.string(),
        description: Yup.string(),
        amount: Yup.number()
          .required('Amount is required')
          .moreThan(0, 'Amount must be greater than 0'),
      })
    )
    .min(1, 'At least one line item is required'),
});

// Mock data for dropdowns
const departments = [
  { value: 'Office of the Mayor', label: 'Office of the Mayor' },
  { value: 'Accounting Department', label: 'Accounting Department' },
  { value: 'Treasury Department', label: 'Treasury Department' },
  { value: 'IT Department', label: 'IT Department' },
];

const payeeTypes = [
  { value: 'Vendor', label: 'Vendor' },
  { value: 'Employee', label: 'Employee' },
  { value: 'Other', label: 'Other' },
];

const funds = [
  { value: 'General Fund', label: 'General Fund' },
  { value: 'Special Education Fund', label: 'Special Education Fund' },
  { value: 'Trust Fund', label: 'Trust Fund' },
];

const responsibilityCenters = [
  { value: 'Accounting', label: 'Accounting' },
  { value: 'Budget', label: 'Budget' },
  { value: 'Treasury', label: 'Treasury' },
  { value: 'HR', label: 'Human Resources' },
];

const taxCodes = [
  { value: 'W1010', label: 'W1010 - Withholding Tax' },
  { value: 'VAT', label: 'VAT - Value Added Tax' },
  { value: 'NONVAT', label: 'NONVAT - Non-Vatable' },
];

const accountCodes = [
  { value: '5-01-01-010', label: '5-01-01-010 - Salaries and Wages - Regular' },
  { value: '5-01-01-020', label: '5-01-01-020 - Salaries and Wages - Casual' },
  { value: '5-01-02-010', label: '5-01-02-010 - Office Supplies' },
  { value: '5-02-03-010', label: '5-02-03-010 - Traveling Expenses - Local' },
  { value: '5-02-03-020', label: '5-02-03-020 - Traveling Expenses - Foreign' },
  {
    value: '5-02-12-990',
    label: '5-02-12-990 - Other Maintenance and Operating Expenses',
  },
];

function ObligationRequestForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateTotal = (lineItems) => {
    return lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  };

  const initialValues = initialData
    ? { ...initialData }
    : {
        orsDate: new Date().toISOString().split('T')[0],
        payeeType: '',
        payeeName: '',
        payeeAddress: '',
        requestingOffice: '',
        fund: '',
        lineItems: [
          {
            accountCode: '',
            responsibilityCenter: '',
            particulars: '',
            remarks: '',
            changeAccount: '',
            quantity: 0,
            itemPrice: 0,
            vatable: false,
            fpp: '',
            taxCode: '',
            taxRate: 0,
            withheldAndEWT: 0,
            discounts: 0,
            unit: '',
            description: '',
            amount: 0,
          },
        ],
      };

  const handleSubmit = (values) => {
    setIsSubmitting(true);

    // Calculate the total amount
    const totalAmount = calculateTotal(values.lineItems);
    const dataToSubmit = {
      ...values,
      totalAmount,
    };

    // Dispatch action based on whether we're creating or updating
    const action = initialData
      ? updateObligationRequest({
          ...dataToSubmit,
          id: initialData.id,
          orsNumber: initialData.orsNumber,
        })
      : createObligationRequest(dataToSubmit);

    dispatch(action)
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting OBR:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={obligationRequestSchema}
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
      }) => (
        <Form className="space-y-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="OBR Date"
              name="orsDate"
              type="date"
              required
              value={values.orsDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.orsDate}
              touched={touched.orsDate}
            />

            <FormField
              label="Fund"
              name="fund"
              type="select"
              required
              value={values.fund}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.fund}
              touched={touched.fund}
              options={funds}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              label="Payee Name"
              name="payeeName"
              type="text"
              required
              placeholder="Enter payee name"
              value={values.payeeName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.payeeName}
              touched={touched.payeeName}
            />
          </div>

          <FormField
            label="Payee Address"
            name="payeeAddress"
            type="textarea"
            placeholder="Enter payee address"
            value={values.payeeAddress}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.payeeAddress}
            touched={touched.payeeAddress}
            rows={2}
          />

          <FormField
            label="Requesting Office"
            name="requestingOffice"
            type="select"
            required
            value={values.requestingOffice}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.requestingOffice}
            touched={touched.requestingOffice}
            options={departments}
          />

          <div className="mt-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Line Items
            </label>

            <FieldArray name="lineItems">
              {({ remove, push }) => (
                <div className="space-y-3">
                  {values.lineItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-neutral-700">
                          Item #{index + 1}
                        </h4>
                        {values.lineItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-error-600 hover:text-error-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Account Code"
                          name={`lineItems.${index}.accountCode`}
                          type="select"
                          required
                          value={item.accountCode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.lineItems?.[index]?.accountCode}
                          touched={touched.lineItems?.[index]?.accountCode}
                          options={accountCodes}
                        />

                        <FormField
                          label="Responsibility Center"
                          name={`lineItems.${index}.responsibilityCenter`}
                          type="select"
                          required
                          value={item.responsibilityCenter}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            errors.lineItems?.[index]?.responsibilityCenter
                          }
                          touched={
                            touched.lineItems?.[index]?.responsibilityCenter
                          }
                          options={responsibilityCenters}
                        />
                      </div>

                      <FormField
                        label="Particulars"
                        name={`lineItems.${index}.particulars`}
                        type="textarea"
                        required
                        placeholder="Enter purpose for this line item"
                        value={item.particulars}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.lineItems?.[index]?.particulars}
                        touched={touched.lineItems?.[index]?.particulars}
                        rows={2}
                      />

                      <FormField
                        label="Remarks"
                        name={`lineItems.${index}.remarks`}
                        type="textarea"
                        placeholder="Enter remarks"
                        value={item.remarks}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.lineItems?.[index]?.remarks}
                        touched={touched.lineItems?.[index]?.remarks}
                        rows={2}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Change Account"
                          name={`lineItems.${index}.changeAccount`}
                          type="text"
                          placeholder="Enter change account"
                          value={item.changeAccount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.lineItems?.[index]?.changeAccount}
                          touched={touched.lineItems?.[index]?.changeAccount}
                        />

                        <FormField
                          label="FPP"
                          name={`lineItems.${index}.fpp`}
                          type="text"
                          placeholder="Enter FPP"
                          value={item.fpp}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.lineItems?.[index]?.fpp}
                          touched={touched.lineItems?.[index]?.fpp}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          label="Quantity"
                          name={`lineItems.${index}.quantity`}
                          type="number"
                          placeholder="0"
                          value={item.quantity}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.lineItems?.[index]?.quantity}
                          touched={touched.lineItems?.[index]?.quantity}
                          min="0"
                        />

                        <FormField
                          label="Item Price"
                          name={`lineItems.${index}.itemPrice`}
                          type="number"
                          placeholder="0.00"
                          value={item.itemPrice}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.lineItems?.[index]?.itemPrice}
                          touched={touched.lineItems?.[index]?.itemPrice}
                          min="0"
                          step="0.01"
                        />

                        <FormField
                          label="Unit"
                          name={`lineItems.${index}.unit`}
                          type="text"
                          placeholder="Enter unit"
                          value={item.unit}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.lineItems?.[index]?.unit}
                          touched={touched.lineItems?.[index]?.unit}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`lineItems.${index}.vatable`}
                            name={`lineItems.${index}.vatable`}
                            checked={item.vatable}
                            onChange={() =>
                              setFieldValue(
                                `lineItems.${index}.vatable`,
                                !item.vatable
                              )
                            }
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                          />
                          <label
                            htmlFor={`lineItems.${index}.vatable`}
                            className="ml-2 block text-sm text-neutral-700"
                          >
                            Vatable
                          </label>
                        </div>

                        <FormField
                          label="Tax Code"
                          name={`lineItems.${index}.taxCode`}
                          type="select"
                          value={item.taxCode}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.lineItems?.[index]?.taxCode}
                          touched={touched.lineItems?.[index]?.taxCode}
                          options={taxCodes}
                        />

                        <FormField
                          label="Tax Rate (%)"
                          name={`lineItems.${index}.taxRate`}
                          type="number"
                          placeholder="0.00"
                          value={item.taxRate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.lineItems?.[index]?.taxRate}
                          touched={touched.lineItems?.[index]?.taxRate}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          label="Withheld and EWT"
                          name={`lineItems.${index}.withheldAndEWT`}
                          type="number"
                          placeholder="0.00"
                          value={item.withheldAndEWT}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.lineItems?.[index]?.withheldAndEWT}
                          touched={touched.lineItems?.[index]?.withheldAndEWT}
                          min="0"
                          step="0.01"
                        />

                        <FormField
                          label="Discounts (%)"
                          name={`lineItems.${index}.discounts`}
                          type="number"
                          placeholder="0"
                          value={item.discounts}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.lineItems?.[index]?.discounts}
                          touched={touched.lineItems?.[index]?.discounts}
                          min="0"
                          max="100"
                        />
                      </div>

                      <FormField
                        label="Description"
                        name={`lineItems.${index}.description`}
                        type="textarea"
                        placeholder="Enter additional description"
                        value={item.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.lineItems?.[index]?.description}
                        touched={touched.lineItems?.[index]?.description}
                        rows={2}
                      />

                      <FormField
                        label="Amount"
                        name={`lineItems.${index}.amount`}
                        type="number"
                        required
                        placeholder="0.00"
                        value={item.amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.lineItems?.[index]?.amount}
                        touched={touched.lineItems?.[index]?.amount}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      push({
                        accountCode: '',
                        responsibilityCenter: '',
                        particulars: '',
                        remarks: '',
                        changeAccount: '',
                        quantity: 0,
                        itemPrice: 0,
                        vatable: false,
                        fpp: '',
                        taxCode: '',
                        taxRate: 0,
                        withheldAndEWT: 0,
                        discounts: 0,
                        unit: '',
                        description: '',
                        amount: 0,
                      })
                    }
                    className="flex items-center text-sm text-primary-600 hover:text-primary-800 mt-2"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Line Item
                  </button>

                  <div className="mt-4 flex justify-between items-center py-3 px-4 bg-neutral-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-700">
                      Total Amount:
                    </span>
                    <span className="text-lg font-bold text-primary-700">
                      {new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: 'PHP',
                      }).format(calculateTotal(values.lineItems))}
                    </span>
                  </div>
                </div>
              )}
            </FieldArray>
          </div>

          <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-neutral-200">
            <button type="button" onClick={onClose} className="btn btn-outline">
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
      )}
    </Formik>
  );
}

export default ObligationRequestForm;
