import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import SearchableDropdown from '../common/SearchableDropdown';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Paperclip, Trash2, Upload } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;
const validationSchema = Yup.object({
  fromBudgetId: Yup.string().required('Source budget is required'),
  toBudgetId: Yup.string().required('Target budget is required'),
  transferAmount: Yup.number()
    .required('Amount is required')
    .min(0.01, 'Amount must be positive'),
  remarks: Yup.string().required('Remarks are required'),
  Attachments: Yup.array(),
});

const initialValues = {
  fromBudgetId: '',
  toBudgetId: '',
  transferAmount: 0,
  remarks: '',
  fromBudget: null,
  toBudget: null,
  Attachments: [],
};

function BudgetTransferForm({ initialData, onSubmit, onClose, budgetOptions }) {
  const [formData, setFormData] = useState({ ...initialValues });

  const handleSubmit = async (values, { setSubmitting }) => {
    if (values.fromBudgetId === values.toBudgetId) {
      toast.error('Source and target budgets cannot be the same');
      setSubmitting(false);
      return;
    }

    const fromBudget = budgetOptions.find(
      (b) => b.ID.toString() === values.fromBudgetId
    );
    const availableBalance = parseFloat(fromBudget?.AppropriationBalance || 0);
    const transferAmount = parseFloat(values.transferAmount || 0);

    if (transferAmount <= 0) {
      toast.error('Transfer amount must be positive');
      setSubmitting(false);
      return;
    }

    if (transferAmount > availableBalance) {
      toast.error(
        `Transfer amount (${transferAmount}) exceeds available balance (${availableBalance})`
      );
      setSubmitting(false);
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('BudgetID', values.fromBudgetId);
    formData.append('TargetID', values.toBudgetId);
    formData.append('Transfer', values.transferAmount);
    formData.append('Remarks', values.remarks);

    // Handle attachments
    if (values.Attachments?.length > 0) {
      values.Attachments.forEach((file, index) => {
        if (file.ID) {
          formData.append(`Attachments[${index}].ID`, file.ID);
        } else {
          formData.append(`Attachments[${index}].File`, file);
        }
      });
    } else {
      formData.append('Attachments', '[]');
    }
    // Add LinkID IF UPDATING IT
    if (initialData?.LinkID) {
      formData.append('LinkID', initialData?.LinkID);
      formData.append('IsNew', false);
    } else {
      formData.append('IsNew', true);
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      toast.error('Submission failed: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (event, setFieldValue, values) => {
    const files = Array.from(event.target.files);
    setFieldValue('Attachments', [...values.Attachments, ...files]);
  };

  const removeAttachment = (index, setFieldValue, values) => {
    const updatedAttachments = [...values.Attachments];
    updatedAttachments.splice(index, 1);
    setFieldValue('Attachments', updatedAttachments);
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        fromBudgetId: initialData?.BudgetID?.toString() || '',
        toBudgetId: initialData?.TargetID?.toString() || '',
        transferAmount: parseFloat(initialData?.Total) || 0,
        remarks: initialData?.Remarks || '',
        fromBudget:
          budgetOptions.find((b) => b.ID === initialData?.BudgetID) || null,
        toBudget:
          budgetOptions.find((b) => b.ID === initialData?.TargetID) || null,
        Attachments: initialData.Attachments || [],
      });
    } else {
      setFormData(initialValues);
    }
  }, [initialData, budgetOptions]);

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
        setFieldValue,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
        <Form className="space-y-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* From Budget Section */}
            <div className="flex-1 space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">From Budget</h3>

              <SearchableDropdown
                label="Select Budget"
                name="fromBudgetId"
                required
                selectedValue={values.fromBudgetId}
                onSelect={(value) => {
                  const selectedBudget = budgetOptions.find(
                    (b) => b.ID.toString() === value
                  );
                  setFieldValue('fromBudgetId', value);
                  setFieldValue('fromBudget', selectedBudget);
                }}
                options={budgetOptions.map((b) => ({
                  label: `${b.Name} (${b.FiscalYear?.Name})`,
                  value: b.ID.toString(),
                }))}
                error={touched.fromBudgetId && errors.fromBudgetId}
              />

              {values.fromBudget && (
                <div className="space-y-3 mt-4">
                  <FormField
                    label="Budget Name"
                    name="fromBudgetName"
                    type="text"
                    value={values.fromBudget.Name}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Fiscal Year"
                    name="fromFiscalYear"
                    type="text"
                    value={values.fromBudget.FiscalYear?.Name}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Department"
                    name="fromDepartment"
                    type="text"
                    value={values.fromBudget.Department?.Name || 'N/A'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Appropriation Balance"
                    name="fromBalance"
                    type="text"
                    value={values.fromBudget.AppropriationBalance || '0.00'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Sub Department"
                    name="fromSubDepartment"
                    type="text"
                    value={
                      values.fromBudget.SubDepartment?.Name ||
                      'No Subdepartments'
                    }
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Chart of Accounts"
                    name="fromChartOfAccounts"
                    type="text"
                    value={values.fromBudget.ChartofAccounts?.Name || 'N/A'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Fund"
                    name="fromFund"
                    type="text"
                    value={values.fromBudget.Funds?.Name || 'General Fund'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Project"
                    name="fromProject"
                    type="text"
                    value={values.fromBudget.Project?.Name || 'No Project'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Appropriation"
                    name="fromAppropriation"
                    type="text"
                    value={values.fromBudget.Appropriation || '0.00'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Released Allotments"
                    name="fromReleasedAllotments"
                    type="text"
                    value={values.fromBudget.Released || '0.00'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Allotment Balance"
                    name="fromAllotmentBalance"
                    type="text"
                    value={values.fromBudget.AllotmentBalance || '0.00'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />{' '}
                  <FormField
                    label="Balance"
                    name="fromBalance"
                    type="text"
                    value={values.fromBudget.AppropriationBalance || '0.00'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                </div>
              )}
            </div>

            {/* To Budget Section */}
            <div className="flex-1 space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">To Budget</h3>

              <SearchableDropdown
                label="Select Budget"
                name="toBudgetId"
                required
                selectedValue={values.toBudgetId}
                onSelect={(value) => {
                  const selectedBudget = budgetOptions.find(
                    (b) => b.ID.toString() === value
                  );
                  setFieldValue('toBudgetId', value);
                  setFieldValue('toBudget', selectedBudget);
                }}
                options={budgetOptions.map((b) => ({
                  label: `${b.Name} (${b.FiscalYear?.Name})`,
                  value: b.ID.toString(),
                }))}
                error={touched.toBudgetId && errors.toBudgetId}
              />

              {values.toBudget && (
                <div className="space-y-3 mt-4">
                  <FormField
                    label="Budget Name"
                    name="toBudgetName"
                    type="text"
                    value={values.toBudget.Name}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Fiscal Year"
                    name="toFiscalYear"
                    type="text"
                    value={values.toBudget.FiscalYear?.Name}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Department"
                    name="toDepartment"
                    type="text"
                    value={values.toBudget.Department?.Name || 'N/A'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Appropriation Balance"
                    name="toBalance"
                    type="text"
                    value={values.toBudget.AppropriationBalance || '0.00'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Sub Department"
                    name="toSubDepartment"
                    type="text"
                    value={
                      values.toBudget.SubDepartment?.Name || 'No Subdepartments'
                    }
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Chart of Accounts"
                    name="toChartOfAccounts"
                    type="text"
                    value={values.toBudget.ChartofAccounts?.Name || 'N/A'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Fund"
                    name="toFund"
                    type="text"
                    value={values.toBudget.Funds?.Name || 'General Fund'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Project"
                    name="toProject"
                    type="text"
                    value={values.toBudget.Project?.Name || 'No Project'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Appropriation"
                    name="toAppropriation"
                    type="text"
                    value={values.toBudget.Appropriation || '0.00'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />

                  <FormField
                    label="Released Allotments"
                    name="toReleasedAllotments"
                    type="text"
                    value={values.toBudget.Released || '0.00'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Allotment Balance"
                    name="toAllotmentBalance"
                    type="text"
                    value={values.toBudget.AllotmentBalance || '0.00'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Balance"
                    name="toBalance"
                    type="text"
                    value={values.toBudget.AppropriationBalance || '0.00'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                </div>
              )}
            </div>
          </div>

          {/* Transfer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FormField
              name="remarks"
              type="textarea"
              label="Remarks"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.remarks}
              error={errors.remarks}
              touched={touched.remarks}
              required
            />
            <FormField
              label="Transfer Amount"
              name="transferAmount"
              type="number"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.transferAmount}
              error={errors.transferAmount}
              touched={touched.transferAmount}
              required
              min="0.01"
              step="0.01"
            />
          </div>

          {/* Attachments Section */}
          <div className="my-4">
            <div className="space-y-2">
              <h2 className="font-bold text-lg">Attachments</h2>
              <input
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e, setFieldValue, values)}
                className="hidden"
                id="file-upload"
                key={values.Attachments?.length || 0}
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-150"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </label>

              {values?.Attachments?.length > 0 ? (
                <div className="space-y-2 py-2 mt-2">
                  {values.Attachments.map((file, index) => (
                    <div
                      key={file.ID || index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-center min-w-0">
                        <Paperclip className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {file.ID ? (
                            <a
                              href={`${API_URL}/uploads/${file.DataImage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate"
                              title={file.name || file.DataName}
                            >
                              {file.name || file.DataName}
                            </a>
                          ) : (
                            <span title={file.name || file.DataName}>
                              {file.name || file.DataName}
                            </span>
                          )}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeAttachment(index, setFieldValue, values)
                        }
                        className="text-red-500 hover:text-red-700 ml-2 p-1 rounded-full hover:bg-red-50 transition-colors duration-150"
                        aria-label="Remove file"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mt-2">
                  No attachments added
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {initialData ? 'Update Transfer' : 'Create Transfer'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default BudgetTransferForm;

// import { Form, Formik } from 'formik'
// import * as Yup from 'yup'
// import FormField from '../common/FormField'
// import { useEffect, useState } from 'react'

// const validationSchema = Yup.object({
//   sourceBudgetName: Yup.string().required('Code is required'),
//   sourceFiscalYear: Yup.string().required('Code is required'),
//   sourceDepartment: Yup.string().required('Code is required'),
//   sourceSubDepartment: Yup.string().required('Code is required'),
//   sourceAccounts: Yup.string().required('Code is required'),
//   sourceFund: Yup.string().required('Code is required'),
//   sourceProject: Yup.string().required('Code is required'),
//   sourceTransfer: Yup.number()
//     .required('Amount is required')
//     .min(0, 'Amount must be positive'),
//   sourceRemarks: Yup.string().required('Year is required'),
//   sourceAppropriation: Yup.number()
//     .required('Amount is required')
//     .min(0, 'Amount must be positive'),
//   sourceAppropriationBalance: Yup.number()
//     .required('Amount is required')
//     .min(0, 'Amount must be positive'),
//   sourceReleasedAllotments: Yup.number()
//     .required('Amount is required')
//     .min(0, 'Amount must be positive'),
//   sourceAllotmentBalance: Yup.number()
//     .required('Amount is required')
//     .min(0, 'Amount must be positive'),
//   targetBudgetName: Yup.string().required('Code is required'),
//   targetFiscalYear: Yup.string().required('Code is required'),
//   targetDepartment: Yup.string().required('Code is required'),
//   targetSubDepartment: Yup.string().required('Code is required'),
//   targetAccounts: Yup.string().required('Code is required'),
//   targetFund: Yup.string().required('Code is required'),
//   targetProject: Yup.string().required('Code is required'),
//   targetTransfer: Yup.number()
//     .required('Amount is required')
//     .min(0, 'Amount must be positive'),
//   targetRemarks: Yup.string().required('Year is required'),
//   targetAppropriation: Yup.number()
//     .required('Amount is required')
//     .min(0, 'Amount must be positive'),
//   targetAppropriationBalance: Yup.number()
//     .required('Amount is required')
//     .min(0, 'Amount must be positive'),
//   targetReleasedAllotments: Yup.number()
//     .required('Amount is required')
//     .min(0, 'Amount must be positive'),
//   targetAllotmentBalance: Yup.number()
//     .required('Amount is required')
//     .min(0, 'Amount must be positive')
// })

// const initialValues = {
//   sourceBudgetName: '',
//   sourceFiscalYear: '',
//   sourceDepartment: '',
//   sourceSubDepartment: '',
//   sourceAccounts: '',
//   sourceFund: '',
//   sourceProject: '',
//   sourceTransfer: 0,
//   sourceRemarks: '',
//   sourceAppropriation: 0,
//   sourceAppropriationBalance: 0,
//   sourceReleasedAllotments: 0,
//   sourceAllotmentBalance: 0,
//   targetBudgetName: '',
//   targetFiscalYear: '',
//   targetDepartment: '',
//   targetSubDepartment: '',
//   targetAccounts: '',
//   targetFund: '',
//   targetProject: '',
//   targetTransfer: 0,
//   targetRemarks: '',
//   targetAppropriation: 0,
//   targetAppropriationBalance: 0,
//   targetReleasedAllotments: 0,
//   targetAllotmentBalance: 0
// }

// function BudgetTransferForm({ initialData, onSubmit, onClose }) {
//   const [formData, setFormData] = useState({ ...initialValues })

//   const handleSubmit = (values, { setSubmitting }) => {
//     onSubmit(values)
//     setSubmitting(false)
//     console.log('Form submitted with values:', values)
//   }

//   useEffect(() => {
//     if (initialData?.ID) {
//       setFormData({
//         id: initialData?.ID,
//         budgetName: initialData?.Name,
//         fiscalYear: initialData?.FiscalYearID,
//         department: initialData?.DepartmentID,
//         subDepartment: initialData?.SubDepartmentID,
//         chartOfAccounts: initialData?.ChartofAccountsID,
//         fund: initialData?.FundID,
//         project: initialData?.ProjectID,
//         appropriation: initialData?.Appropriation,
//         charges: initialData?.Charges,
//         totalAmount: initialData?.TotalAmount,
//         balance: initialData?.AppropriationBalance,
//         january: initialData?.January,
//         february: initialData?.February,
//         march: initialData?.March,
//         april: initialData?.April,
//         may: initialData?.May,
//         june: initialData?.June,
//         july: initialData?.July,
//         august: initialData?.August,
//         september: initialData?.September,
//         october: initialData?.October,
//         november: initialData?.November,
//         december: initialData?.December
//       })
//     } else {
//       setFormData(initialValues)
//     }
//   }, [initialData])

//   return (
//     <Formik
//       enableReinitialize
//       onSubmit={handleSubmit}
//       initialValues={formData}
//       validationSchema={validationSchema}
//     >
//       {({
//         values,
//         errors,
//         touched,
//         handleChange,
//         handleBlur,
//         isSubmitting
//       }) => (
//         <Form className='space-y-4'>
//           <div className='space-y-6'>
//             <p className='font-medium'>Account Source</p>
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
//               <FormField
//                 label='Budget Name'
//                 name='sourceBudgetName'
//                 type='text'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.sourceBudgetName}
//                 error={errors.sourceBudgetName}
//                 touched={touched.sourceBudgetName}
//                 required
//               />
//               <FormField
//                 label='Fiscal Year'
//                 name='sourceFiscalYear'
//                 type='text'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.sourceFiscalYear}
//                 error={errors.sourceFiscalYear}
//                 touched={touched.sourceFiscalYear}
//                 required
//               />
//               <FormField
//                 label='Department'
//                 name='sourceDepartment'
//                 type='text'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.sourceDepartment}
//                 error={errors.sourceDepartment}
//                 touched={touched.sourceDepartment}
//                 required
//               />
//               <FormField
//                 label='Sub Department'
//                 name='sourceSubDepartment'
//                 type='text'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.sourceSubDepartment}
//                 error={errors.sourceSubDepartment}
//                 touched={touched.sourceSubDepartment}
//                 required
//               />
//               <FormField
//                 name='sourceAccounts'
//                 type='text'
//                 label='Chat of Accounts'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.sourceAccounts}
//                 error={errors.sourceAccounts}
//                 touched={touched.sourceAccounts}
//                 required
//               />
//               <FormField
//                 name='sourceFund'
//                 type='text'
//                 label='Fund'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.sourceFund}
//                 error={errors.sourceFund}
//                 touched={touched.sourceFund}
//                 required
//               />
//               <FormField
//                 name='sourceProject'
//                 type='text'
//                 label='Project'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.sourceProject}
//                 error={errors.sourceProject}
//                 touched={touched.sourceProject}
//                 required
//               />
//               <FormField
//                 name='sourceTransfer'
//                 type='number'
//                 label='Transfer'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.sourceTransfer}
//                 error={errors.sourceTransfer}
//                 touched={touched.sourceTransfer}
//                 required
//               />
//               <FormField
//                 name='sourceAppropriation'
//                 type='number'
//                 label='Appropriation'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.sourceAppropriation}
//                 error={errors.sourceAppropriation}
//                 touched={touched.sourceAppropriation}
//                 required
//               />{' '}
//               <FormField
//                 name='sourceAppropriationBalance'
//                 type='number'
//                 label='Appropriation Balance'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.sourceAppropriationBalance}
//                 error={errors.sourceAppropriationBalance}
//                 touched={touched.sourceAppropriationBalance}
//                 required
//               />
//               <FormField
//                 name='Remarks'
//                 type='textarea'
//                 label='Remarks'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.sourceRemarks}
//                 error={errors.sourceRemarks}
//                 touched={touched.sourceRemarks}
//                 required
//               />
//             </div>
//           </div>

//           <div className='space-y-6'>
//             <p className='font-medium'>Account Target</p>
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
//               <FormField
//                 label='Budget Name'
//                 name='targetBudgetName'
//                 type='text'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.targetBudgetName}
//                 error={errors.targetBudgetName}
//                 touched={touched.targetBudgetName}
//                 required
//               />
//               <FormField
//                 label='Fiscal Year'
//                 name='targetFiscalYear'
//                 type='text'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.targetFiscalYear}
//                 error={errors.targetFiscalYear}
//                 touched={touched.targetFiscalYear}
//                 required
//               />
//               <FormField
//                 label='Department'
//                 name='targetDepartment'
//                 type='text'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.targetDepartment}
//                 error={errors.targetDepartment}
//                 touched={touched.targetDepartment}
//                 required
//               />
//               <FormField
//                 label='Sub Department'
//                 name='targetSubDepartment'
//                 type='text'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.targetSubDepartment}
//                 error={errors.targetSubDepartment}
//                 touched={touched.targetSubDepartment}
//                 required
//               />
//               <FormField
//                 name='targetAccounts'
//                 type='text'
//                 label='Chat of Accounts'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.targetAccounts}
//                 error={errors.targetAccounts}
//                 touched={touched.targetAccounts}
//                 required
//               />
//               <FormField
//                 name='targetFund'
//                 type='text'
//                 label='Fund'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.targetFund}
//                 error={errors.targetFund}
//                 touched={touched.targetFund}
//                 required
//               />
//               <FormField
//                 name='targetProject'
//                 type='text'
//                 label='Project'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.targetProject}
//                 error={errors.targetProject}
//                 touched={touched.targetProject}
//                 required
//               />
//               <FormField
//                 name='targetTransfer'
//                 type='number'
//                 label='Transfer'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.targetTransfer}
//                 error={errors.targetTransfer}
//                 touched={touched.targetTransfer}
//                 required
//               />
//               <FormField
//                 name='targetAppropriation'
//                 type='number'
//                 label='Appropriation'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.targetAppropriation}
//                 error={errors.targetAppropriation}
//                 touched={touched.targetAppropriation}
//                 required
//               />{' '}
//               <FormField
//                 name='targetAppropriationBalance'
//                 type='number'
//                 label='Appropriation Balance'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.targetAppropriationBalance}
//                 error={errors.targetAppropriationBalance}
//                 touched={touched.targetAppropriationBalance}
//                 required
//               />
//               <FormField
//                 name='targetRemarks '
//                 type='textarea'
//                 label='Remarks'
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 value={values.targetRemarks}
//                 error={errors.targetRemarks}
//                 touched={touched.targetRemarks}
//                 required
//               />
//             </div>
//           </div>

//           <div className='flex justify-end space-x-3'>
//             <button
//               type='button'
//               onClick={onClose}
//               className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
//             >
//               Cancel
//             </button>
//             <button
//               type='submit'
//               disabled={isSubmitting}
//               className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
//             >
//               {initialData ? 'Update' : 'Save'}
//             </button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   )
// }

// export default BudgetTransferForm
