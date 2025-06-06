import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createObligationRequest, updateObligationRequest } from '../../features/disbursement/obligationRequestSlice';

// Validation schema for obligation request
const obligationRequestSchema = Yup.object().shape({
  orsDate: Yup.date().required('Date is required'),
  payeeType: Yup.string().required('Payee type is required'),
  payeeName: Yup.string().required('Payee name is required'),
  payeeAddress: Yup.string(),
  requestingOffice: Yup.string().required('Requesting office is required'),
  particulars: Yup.string().required('Particulars are required'),
  fund: Yup.string().required('Fund is required'),
  lineItems: Yup.array().of(
    Yup.object().shape({
      accountCode: Yup.string().required('Account code is required'),
      description: Yup.string(),
      amount: Yup.number().required('Amount is required').moreThan(0, 'Amount must be greater than 0'),
    })
  ).min(1, 'At least one line item is required'),
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

const accountCodes = [
  { value: '5-01-01-010', label: '5-01-01-010 - Salaries and Wages - Regular' },
  { value: '5-01-01-020', label: '5-01-01-020 - Salaries and Wages - Casual' },
  { value: '5-01-02-010', label: '5-01-02-010 - Office Supplies' },
  { value: '5-02-03-010', label: '5-02-03-010 - Traveling Expenses - Local' },
  { value: '5-02-03-020', label: '5-02-03-020 - Traveling Expenses - Foreign' },
  { value: '5-02-12-990', label: '5-02-12-990 - Other Maintenance and Operating Expenses' },
];

function ObligationRequestForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const calculateTotal = (lineItems) => {
    return lineItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  };

  const initialValues = initialData ? { ...initialData } : {
    orsDate: new Date().toISOString().split('T')[0],
    payeeType: '',
    payeeName: '',
    payeeAddress: '',
    requestingOffice: '',
    particulars: '',
    fund: '',
    lineItems: [{ accountCode: '', description: '', amount: '' }],
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    
    // Calculate the total amount
    const totalAmount = calculateTotal(values.lineItems);
    const dataToSubmit = {
      ...values,
      totalAmount
    };
    
    // Dispatch action based on whether we're creating or updating
    const action = initialData 
      ? updateObligationRequest({ ...dataToSubmit, id: initialData.id, orsNumber: initialData.orsNumber }) 
      : createObligationRequest(dataToSubmit);
    
    dispatch(action)
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting ORS:', error);
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
      {({ values, errors, touched, handleChange, handleBlur, isValid }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="ORS Date"
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
          
          <FormField
            label="Particulars"
            name="particulars"
            type="textarea"
            required
            placeholder="Enter purpose of obligation"
            value={values.particulars}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.particulars}
            touched={touched.particulars}
          />
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Line Items</label>
            
            <FieldArray name="lineItems">
              {({ remove, push }) => (
                <div className="space-y-3">
                  {values.lineItems.map((_, index) => (
                    <div key={index} className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-neutral-700">Item #{index + 1}</h4>
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
                      
                      <FormField
                        label="Account Code"
                        name={`lineItems.${index}.accountCode`}
                        type="select"
                        required
                        value={values.lineItems[index].accountCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          errors.lineItems && 
                          errors.lineItems[index] && 
                          errors.lineItems[index].accountCode
                        }
                        touched={
                          touched.lineItems && 
                          touched.lineItems[index] && 
                          touched.lineItems[index].accountCode
                        }
                        options={accountCodes}
                      />
                      
                      <FormField
                        label="Description"
                        name={`lineItems.${index}.description`}
                        type="text"
                        placeholder="Enter description specific to line item"
                        value={values.lineItems[index].description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          errors.lineItems && 
                          errors.lineItems[index] && 
                          errors.lineItems[index].description
                        }
                        touched={
                          touched.lineItems && 
                          touched.lineItems[index] && 
                          touched.lineItems[index].description
                        }
                      />
                      
                      <FormField
                        label="Amount"
                        name={`lineItems.${index}.amount`}
                        type="number"
                        required
                        placeholder="0.00"
                        value={values.lineItems[index].amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          errors.lineItems && 
                          errors.lineItems[index] && 
                          errors.lineItems[index].amount
                        }
                        touched={
                          touched.lineItems && 
                          touched.lineItems[index] && 
                          touched.lineItems[index].amount
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => push({ accountCode: '', description: '', amount: '' })}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-800 mt-2"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Line Item
                  </button>
                  
                  <div className="mt-4 flex justify-between items-center py-3 px-4 bg-neutral-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-700">Total Amount:</span>
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
      )}
    </Formik>
  );
}

export default ObligationRequestForm;