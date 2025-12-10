import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import FormField from '../common/FormField'

const validationSchema = Yup.object().shape({
  budgetName: Yup.string().required('Budget Name is required'),
  fiscalYear: Yup.string().required('Fiscal Year is required'),
  department: Yup.string().required('Department is required'),
  subDepartment: Yup.string().required('Sub-Department is required'),
  chartOfAccounts: Yup.string().required('Chart of Accounts is required'),
  fund: Yup.string().required('Fund is required'),
  project: Yup.string().required('Project is required'),
  january: Yup.string().required('January is required'),
  february: Yup.string().required('February is required'),
  march: Yup.string().required('March is required'),
  april: Yup.string().required('April is required'),
  may: Yup.string().required('May is required'),
  june: Yup.string().required('June is required'),
  july: Yup.string().required('July is required'),
  august: Yup.string().required('August is required'),
  september: Yup.string().required('September is required'),
  october: Yup.string().required('October is required'),
  november: Yup.string().required('November is required'),
  december: Yup.string().required('December is required')
})

const initialValues = {
  budgetName: '',
  fiscalYear: 1,
  department: 1,
  subDepartment: 1,
  chartOfAccounts: 1,
  fund: 1,
  project: 1,
  appropriation: 0,
  charges: 0,
  totalAmount: 0,
  balance: 0,
  january: 0,
  february: 0,
  march: 0,
  april: 0,
  may: 0,
  june: 0,
  july: 0,
  august: 0,
  september: 0,
  october: 0,
  november: 0,
  december: 0
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

function BudgetAllotmentModal({ initialData, onSubmit, onClose }) {
  const [formData, setFormData] = useState({ ...initialValues })

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values)
    setSubmitting(false)
    console.log('Form submitted with values:', values)
  }

  useEffect(() => {
    if (initialData?.ID) {
      setFormData({
        id: initialData?.ID,
        budgetName: initialData?.Name,
        fiscalYear: initialData?.FiscalYearID,
        department: initialData?.DepartmentID,
        subDepartment: initialData?.SubDepartmentID,
        chartOfAccounts: initialData?.ChartofAccountsID,
        fund: initialData?.FundID,
        project: initialData?.ProjectID,
        appropriation: initialData?.Appropriation,
        charges: initialData?.Charges,
        totalAmount: initialData?.TotalAmount,
        balance: initialData?.AppropriationBalance,
        january: initialData?.January,
        february: initialData?.February,
        march: initialData?.March,
        april: initialData?.April,
        may: initialData?.May,
        june: initialData?.June,
        july: initialData?.July,
        august: initialData?.August,
        september: initialData?.September,
        october: initialData?.October,
        november: initialData?.November,
        december: initialData?.December
      })
    } else {
      setFormData(initialValues)
    }
  }, [initialData])

  return (
    <Formik
      enableReinitialize
      onSubmit={handleSubmit}
      initialValues={formData}
      validationSchema={validationSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting
      }) => (
        <Form className='space-y-6'>
          <div className='bg-white shadow-sm rounded-lg p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Basic Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                label='Budget Name'
                name='budgetName'
                type='text'
                placeholder='Enter name'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.budgetName}
                error={errors.budgetName}
                touched={touched.budgetName}
                required
              />
              <FormField
                label='Fiscal Year'
                name='fiscalYear'
                type='select'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fiscalYear}
                error={errors.fiscalYear}
                touched={touched.fiscalYear}
                options={fiscalYears}
                required
              />
              <FormField
                label='Department'
                name='department'
                type='select'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.department}
                error={errors.department}
                touched={touched.department}
                options={departments}
                required
              />
              <FormField
                label='Sub-Department'
                name='subDepartment'
                type='select'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.subDepartment}
                error={errors.subDepartment}
                touched={touched.subDepartment}
                options={subDepartments}
                required
              />
              <FormField
                label='Chart of Accounts'
                name='chartOfAccounts'
                type='select'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.chartOfAccounts}
                error={errors.chartOfAccounts}
                touched={touched.chartOfAccounts}
                options={chartOfAccounts}
                required
              />
              <FormField
                label='Fund'
                name='fund'
                type='select'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fund}
                error={errors.fund}
                touched={touched.fund}
                options={[{ value: '1', label: 'General Fund' }]}
                required
              />
              <FormField
                label='Project'
                name='project'
                type='select'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.project}
                error={errors.project}
                touched={touched.project}
                options={projects}
                required
              />
            </div>
          </div>

          {/* Row 1: Appropriation (readonly) + Charges */}
          <div className='bg-white shadow-sm rounded-lg p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                label='Appropriation'
                name='appropriation'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.appropriation}
                error={errors.appropriation}
                touched={touched.appropriation}
                type='number'
                required
              />
              <FormField
                label='Charges'
                name='charges'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.charges}
                error={errors.charges}
                touched={touched.charges}
                required
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
              <FormField
                label='Total Amount'
                name='totalAmount'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.totalAmount}
                error={errors.totalAmount}
                touched={touched.totalAmount}
                required
              />
              <FormField
                label='Balance'
                name='balance'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.balance}
                error={errors.balance}
                touched={touched.balance}
                required
              />
            </div>
          </div>

          <div className='bg-white shadow-sm rounded-lg p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Monthly Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <FormField
                label='January'
                name='january'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.january}
                error={errors.january}
                touched={touched.january}
              />
              <FormField
                label='February'
                name='february'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.february}
                error={errors.february}
                touched={touched.february}
              />
              <FormField
                label='March'
                name='march'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.march}
                error={errors.march}
                touched={touched.march}
              />
              <FormField
                label='April'
                name='april'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.april}
                error={errors.april}
                touched={touched.april}
              />
              <FormField
                label='May'
                name='may'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.may}
                error={errors.may}
                touched={touched.may}
              />
              <FormField
                label='June'
                name='june'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.june}
                error={errors.june}
                touched={touched.june}
              />
              <FormField
                label='July'
                name='july'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.july}
                error={errors.july}
                touched={touched.july}
              />
              <FormField
                label='August'
                name='august'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.august}
                error={errors.august}
                touched={touched.august}
              />
              <FormField
                label='September'
                name='september'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.september}
                error={errors.september}
                touched={touched.september}
              />
              <FormField
                label='October'
                name='october'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.october}
                error={errors.october}
                touched={touched.october}
              />
              <FormField
                label='November'
                name='november'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.november}
                error={errors.november}
                touched={touched.november}
              />
              <FormField
                label='December'
                name='december'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.december}
                error={errors.december}
                touched={touched.december}
              />
            </div>
          </div>

          <div className='flex justify-end space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default BudgetAllotmentModal
