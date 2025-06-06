import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createDisbursementVoucher, updateDisbursementVoucher } from '../../features/disbursement/disbursementVoucherSlice';

// Mock data for dropdowns
const paymentModes = [
  { value: 'Cash', label: 'Cash' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
];

const departments = [
  { value: 'Office of the Mayor', label: 'Office of the Mayor' },
  { value: 'Accounting Department', label: 'Accounting Department' },
  { value: 'Treasury Department', label: 'Treasury Department' },
  { value: 'IT Department', label: 'IT Department' },
];

const accountCodes = [
  { value: '5-01-01-010', label: '5-01-01-010 - Salaries and Wages - Regular' },
  { value: '5-01-01-020', label: '5-01-01-020 - Salaries and Wages - Casual' },
  { value: '5-01-02-010', label: '5-01-02-010 - Office Supplies' },
  { value: '5-02-03-010', label: '5-02-03-010 - Traveling Expenses - Local' },
  { value: '5-02-03-020', label: '5-02-03-020 - Traveling Expenses - Foreign' },
  { value: '5-02-12-990', label: '5-02-12-990 - Other Maintenance and Operating Expenses' },
];

const deductionTypes = [
  { value: 'Withholding Tax', label: 'Withholding Tax' },
  { value: 'SSS Premium', label: 'SSS Premium' },
  { value: 'PhilHealth Premium', label: 'PhilHealth Premium' },
  { value: 'Pag-IBIG Premium', label: 'Pag-IBIG Premium' },
  { value: 'Loan Payment', label: 'Loan Payment' },
];

// Validation schema
const disbursementVoucherSchema = Yup.object().shape({
  dvDate: Yup.date().required('Date is required'),
  payeeName: Yup.string().required('Payee name is required'),
  payeeAddress: Yup.string(),
  orsNumber: Yup.string(),
  particulars: Yup.string().required('Particulars are required'),
  modeOfPayment: Yup.string().required('Mode of payment is required'),
  department: Yup.string().required('Department is required'),
  grossAmount: Yup.number().required('Gross amount is required').min(0, 'Amount must be greater than 0'),
  accountingEntries: Yup.array().of(
    Yup.object().shape({
      accountCode: Yup.string().required('Account code is required'),
      debitAmount: Yup.number().min(0, 'Amount must be greater than 0'),
      creditAmount: Yup.number().min(0, 'Amount must be greater than 0'),
    })
  ).min(1, 'At least one accounting entry is required'),
  deductions: Yup.array().of(
    Yup.object().shape({
      deductionType: Yup.string().required('Deduction type is required'),
      amount: Yup.number().required('Amount is required').min(0, 'Amount must be greater than 0'),
    })
  ),
});

function DisbursementVoucherForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const calculateTotalDeductions = (deductions) => {
    return deductions.reduce((sum, deduction) => sum + Number(deduction.amount || 0), 0);
  };

  const defaultAccountingEntry = {
    accountCode: '',
    debitAmount: '',
    creditAmount: '',
  };

  const initialValues = {
    dvDate: initialData?.dvDate || new Date().toISOString().split('T')[0],
    payeeName: initialData?.payeeName || '',
    payeeAddress: initialData?.payeeAddress || '',
    orsNumber: initialData?.orsNumber || '',
    particulars: initialData?.particulars || '',
    modeOfPayment: initialData?.modeOfPayment || '',
    department: initialData?.department || '',
    grossAmount: initialData?.grossAmount || '',
    accountingEntries: Array.isArray(initialData?.accountingEntries) && initialData.accountingEntries.length > 0
      ? initialData.accountingEntries
      : [defaultAccountingEntry],
    deductions: Array.isArray(initialData?.deductions) ? initialData.deductions : [],
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    
    // Calculate total deductions and net amount
    const totalDeductions = calculateTotalDeductions(values.deductions);
    const dataToSubmit = {
      ...values,
      totalDeductions,
      netAmount: Number(values.grossAmount) - totalDeductions,
    };
    
    // Dispatch action based on whether we're creating or updating
    const action = initialData 
      ? updateDisbursementVoucher({ ...dataToSubmit, id: initialData.id, dvNumber: initialData.dvNumber }) 
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
      {({ values, errors, touched, handleChange, handleBlur, isValid }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <FormField
              label="ORS Number"
              name="orsNumber"
              type="text"
              placeholder="Enter ORS number"
              value={values.orsNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.orsNumber}
              touched={touched.orsNumber}
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
            label="Department"
            name="department"
            type="select"
            required
            value={values.department}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.department}
            touched={touched.department}
            options={departments}
          />
          
          <FormField
            label="Particulars"
            name="particulars"
            type="textarea"
            required
            placeholder="Enter purpose of disbursement"
            value={values.particulars}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.particulars}
            touched={touched.particulars}
          />
          
          <FormField
            label="Gross Amount"
            name="grossAmount"
            type="number"
            required
            placeholder="0.00"
            value={values.grossAmount}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.grossAmount}
            touched={touched.grossAmount}
            min="0"
            step="0.01"
          />
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Accounting Entries</label>
            
            <FieldArray name="accountingEntries">
              {({ remove, push }) => (
                <div className="space-y-3">
                  {values.accountingEntries.map((_, index) => (
                    <div key={index} className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-neutral-700">Entry #{index + 1}</h4>
                        {values.accountingEntries.length > 1 && (
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
                        name={`accountingEntries.${index}.accountCode`}
                        type="select"
                        required
                        value={values.accountingEntries[index].accountCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          errors.accountingEntries && 
                          errors.accountingEntries[index] && 
                          errors.accountingEntries[index].accountCode
                        }
                        touched={
                          touched.accountingEntries && 
                          touched.accountingEntries[index] && 
                          touched.accountingEntries[index].accountCode
                        }
                        options={accountCodes}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          label="Debit Amount"
                          name={`accountingEntries.${index}.debitAmount`}
                          type="number"
                          placeholder="0.00"
                          value={values.accountingEntries[index].debitAmount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            errors.accountingEntries && 
                            errors.accountingEntries[index] && 
                            errors.accountingEntries[index].debitAmount
                          }
                          touched={
                            touched.accountingEntries && 
                            touched.accountingEntries[index] && 
                            touched.accountingEntries[index].debitAmount
                          }
                          min="0"
                          step="0.01"
                        />
                        
                        <FormField
                          label="Credit Amount"
                          name={`accountingEntries.${index}.creditAmount`}
                          type="number"
                          placeholder="0.00"
                          value={values.accountingEntries[index].creditAmount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            errors.accountingEntries && 
                            errors.accountingEntries[index] && 
                            errors.accountingEntries[index].creditAmount
                          }
                          touched={
                            touched.accountingEntries && 
                            touched.accountingEntries[index] && 
                            touched.accountingEntries[index].creditAmount
                          }
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => push({ accountCode: '', debitAmount: '', creditAmount: '' })}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-800 mt-2"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Accounting Entry
                  </button>
                </div>
              )}
            </FieldArray>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">Deductions</label>
            
            <FieldArray name="deductions">
              {({ remove, push }) => (
                <div className="space-y-3">
                  {values.deductions.map((_, index) => (
                    <div key={index} className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-neutral-700">Deduction #{index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-error-600 hover:text-error-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <FormField
                        label="Deduction Type"
                        name={`deductions.${index}.deductionType`}
                        type="select"
                        required
                        value={values.deductions[index].deductionType}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          errors.deductions && 
                          errors.deductions[index] && 
                          errors.deductions[index].deductionType
                        }
                        touched={
                          touched.deductions && 
                          touched.deductions[index] && 
                          touched.deductions[index].deductionType
                        }
                        options={deductionTypes}
                      />
                      
                      <FormField
                        label="Amount"
                        name={`deductions.${index}.amount`}
                        type="number"
                        required
                        placeholder="0.00"
                        value={values.deductions[index].amount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          errors.deductions && 
                          errors.deductions[index] && 
                          errors.deductions[index].amount
                        }
                        touched={
                          touched.deductions && 
                          touched.deductions[index] && 
                          touched.deductions[index].amount
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => push({ deductionType: '', amount: '' })}
                    className="flex items-center text-sm text-primary-600 hover:text-primary-800 mt-2"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Deduction
                  </button>
                  
                  <div className="mt-4 flex justify-between items-center py-3 px-4 bg-neutral-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-700">Total Deductions:</span>
                    <span className="text-lg font-bold text-primary-700">
                      {new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: 'PHP',
                      }).format(calculateTotalDeductions(values.deductions))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 px-4 bg-neutral-100 rounded-lg">
                    <span className="text-sm font-medium text-neutral-700">Net Amount:</span>
                    <span className="text-lg font-bold text-primary-700">
                      {new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: 'PHP',
                      }).format(Number(values.grossAmount || 0) - calculateTotalDeductions(values.deductions))}
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

export default DisbursementVoucherForm;