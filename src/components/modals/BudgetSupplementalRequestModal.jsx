import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import FormField from '../common/FormField'

const validationSchema = Yup.object().shape({
  Status: Yup.string().oneOf(['Requested']).required(),
  APAR: Yup.string().oneOf(['Budget Supplemental']).required(),
  DocumentTypeID: Yup.number().oneOf([21]).required(),
  RequestedBy: Yup.number().required('Requested by (lngUser) is required'),
  InvoiceDate: Yup.date().required('Invoice date is required'),
  InvoiceNumber: Yup.string().required('Invoice number is required'),
  Total: Yup.number()
    .typeError('Total must be a number')
    .positive('Total must be positive')
    .required('Total is required'),
  Active: Yup.boolean().required('Active is required'),
  Remarks: Yup.string().nullable(), // optional, or use `.required()` if needed
  CreatedBy: Yup.string().required('Created by is required'),
  CreatedDate: Yup.date().required('Created date is required'),
  ApprovalProgress: Yup.number()
    .min(0)
    .required('Approval progress is required'),
  BudgetID: Yup.number().required('Budget id is requeired'),
  ApprovalVersion: Yup.number().required('Approval version is required')
})

const initialValues = {
  Status: 'Requested',
  APAR: 'Budget Supplemental',
  DocumentTypeID: 21,
  RequestedBy: 0,
  InvoiceDate: new Date(),
  InvoiceNumber: '',
  Total: 0,
  Active: true,
  Remarks: '',
  CreatedBy: '',
  CreatedDate: new Date(),
  ApprovalProgress: 0,
  BudgetID: 0,
  ApprovalVersion: 1
}

// Mock data for select options
const fiscalYears = [
  { value: 1, label: 'FY 2023–24' },
  { value: 2, label: 'FY 2024–25' },
  { value: 3, label: 'FY 2025–26' }
]

const departments = [
  { value: 1, label: 'Finance' },
  { value: 2, label: 'Human Resources' },
  { value: 3, label: 'Information Technology' }
]

const subDepartments = [
  { value: 1, label: 'Accounts Payable' },
  { value: 2, label: 'Recruitment' },
  { value: 3, label: 'Infrastructure Support' }
]

const chartOfAccounts = [
  { value: 1, label: '1000 - Cash and Cash Equivalents' },
  { value: 2, label: '2000 - Accounts Receivable' },
  { value: 3, label: '3000 - Office Supplies Expense' }
]

const projects = [
  { value: 1, label: 'ERP Implementation' },
  { value: 2, label: 'Employee Onboarding Automation' },
  { value: 3, label: 'Cloud Migration' }
]

function BudgetSupplementalRequestModal({ initialData, onSubmit, onClose }) {
  const [formData, setFormData] = useState({ ...initialValues })

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values)
    setSubmitting(false)
    console.log('Form submitted with values:', values)
  }

  useEffect(() => {
    if (initialData?.ID) {
      setFormData({
        id: initialData?.ID
      })
    } else {
      setFormData(initialValues)
    }
  }, [initialData])

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange }) => (
        <Form className='space-y-4 py-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label>Status</label>
              <Field
                name='Status'
                as='select'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='Requested'>Requested</option>
              </Field>
              <ErrorMessage
                name='Status'
                component='div'
                className='text-red-500'
              />
            </div>

            <div>
              <label>APAR</label>
              <Field
                name='APAR'
                as='select'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value='Budget Supplemental'>Budget Supplemental</option>
              </Field>
              <ErrorMessage
                name='APAR'
                component='div'
                className='text-red-500'
              />
            </div>

            <div>
              <label>Requested By</label>
              <Field
                name='RequestedBy'
                type='number'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <ErrorMessage
                name='RequestedBy'
                component='div'
                className='text-red-500'
              />
            </div>

            <div>
              <label>Invoice Date</label>
              <Field
                name='InvoiceDate'
                type='date'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <ErrorMessage
                name='InvoiceDate'
                component='div'
                className='text-red-500'
              />
            </div>

            <div>
              <label>Invoice Number</label>
              <Field
                name='InvoiceNumber'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <ErrorMessage
                name='InvoiceNumber'
                component='div'
                className='text-red-500'
              />
            </div>

            <div>
              <label>Total</label>
              <Field
                name='Total'
                type='number'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <ErrorMessage
                name='Total'
                component='div'
                className='text-red-500'
              />
            </div>
          </div>

          <div>
            <label>Active</label>
            <Field name='Active' type='checkbox' className='ml-2' />
            <ErrorMessage
              name='Active'
              component='div'
              className='text-red-500'
            />
          </div>

          <div>
            <label>Remarks</label>
            <Field
              name='Remarks'
              as='textarea'
              className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <ErrorMessage
              name='Remarks'
              component='div'
              className='text-red-500'
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label>Created By</label>
              <Field
                name='CreatedBy'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <ErrorMessage
                name='CreatedBy'
                component='div'
                className='text-red-500'
              />
            </div>

            <div>
              <label>Created Date</label>
              <Field
                name='CreatedDate'
                type='date'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <ErrorMessage
                name='CreatedDate'
                component='div'
                className='text-red-500'
              />
            </div>

            <div>
              <label>Approval Progress</label>
              <Field
                name='ApprovalProgress'
                type='number'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <ErrorMessage
                name='ApprovalProgress'
                component='div'
                className='text-red-500'
              />
            </div>

            <div>
              <label>Budget ID</label>
              <Field
                name='BudgetID'
                type='number'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <ErrorMessage
                name='BudgetID'
                component='div'
                className='text-red-500'
              />
            </div>

            <div>
              <label>Approval Version</label>
              <Field
                name='ApprovalVersion'
                type='number'
                className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <ErrorMessage
                name='ApprovalVersion'
                component='div'
                className='text-red-500'
              />
            </div>
          </div>


          <div className='flex pt-4 justify-end space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              {initialData ? 'Update' : 'Save'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default BudgetSupplementalRequestModal
