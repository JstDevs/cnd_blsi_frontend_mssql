import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useEffect, useState } from 'react';
import SearchableDropdown from '../common/SearchableDropdown';
import toast from 'react-hot-toast';
import { Paperclip, Trash2, Upload } from 'lucide-react';
const API_URL = import.meta.env.VITE_API_URL;
const validationSchema = Yup.object({
  fromFundId: Yup.string().required('Source fund is required'),
  toFundId: Yup.string().required('Target fund is required'),
  transferAmount: Yup.number()
    .required('Amount is required')
    .min(0.01, 'Amount must be positive'),
  remarks: Yup.string().required('Remarks are required'),
  Attachments: Yup.array(),
});

const initialValues = {
  fromFundId: '',
  toFundId: '',
  transferAmount: 0,
  remarks: '',
  fromFund: null,
  toFund: null,
  Attachments: [],
};

function BudgetFundTransferForm({
  initialData,
  onSubmit,
  onClose,
  fundOptions,
}) {
  const [formData, setFormData] = useState({ ...initialValues });
  // console.log('Initial Data:', initialData, 'Form Data:', formData);

  useEffect(() => {
    if (initialData) {
      setFormData(mapApiDataToFormValues(initialData));
    } else {
      setFormData(initialValues);
    }
  }, [initialData]);
  const mapApiDataToFormValues = (apiData) => {
    if (!apiData) return initialValues;

    return {
      fromFundId: apiData.FundsID || '',
      toFundId: apiData.TargetID || '',
      transferAmount: parseFloat(apiData.Total) || 0,
      remarks: apiData.Remarks || '',
      fromFund: apiData.Funds || null,
      toFund: apiData.targetFunds || null,
      Attachments: apiData.Attachments || [],
    };
  };
  const handleSubmit = async (values, { setSubmitting }) => {
    // Check if funds are the same
    if (values.fromFundId === values.toFundId) {
      toast.error('Source and target funds cannot be the same');
      setSubmitting(false);
      return;
    }

    // Find the source fund
    const fromFund = fundOptions.find((f) => f.ID === values.fromFundId);

    // Validate source fund exists
    if (!fromFund) {
      toast.error('Source fund not found');
      setSubmitting(false);
      return;
    }

    // Check if balance is available (handle null/undefined cases)
    const availableBalance = parseFloat(fromFund.Balance || 0);
    const transferAmount = parseFloat(values.transferAmount || 0);

    // Validate transfer amount
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

    // Create FormData for the request
    const formData = new FormData();

    // Append the main form data
    formData.append('FundsID', values.fromFundId);
    formData.append('TargetID', values.toFundId);
    formData.append('Transfer', transferAmount);
    formData.append('Remarks', values.remarks);

    // Handle attachments
    if (values.Attachments && values.Attachments.length > 0) {
      values.Attachments.forEach((file, index) => {
        if (file.ID) {
          // Existing attachment (has ID)
          formData.append(`Attachments[${index}].ID`, file.ID);
        } else {
          // New file attachment
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
      // Submit the form data
      await onSubmit(formData);
    } catch (error) {
      toast.error('Submission failed: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFundSelect = (fieldName, value) => {
    const selectedFund = fundOptions.find((f) => f.ID === value);
    return {
      [`${fieldName}Id`]: value,
      [fieldName]: selectedFund,
    };
  };
  // -------------FILE UPLOAD-------------
  const handleFileUpload = (event, setFieldValue, values) => {
    const files = Array.from(event.target.files);

    // Create new attachments array with just the File objects
    const newAttachments = files.map((file) => file); // Just store the File objects directly
    console.log(newAttachments, values);
    // Combine with existing attachments
    setFieldValue('Attachments', [...values.Attachments, ...newAttachments]);
  };
  // -----------REMOVE ATTACHMENT-------------
  const removeAttachment = (index, setFieldValue, values) => {
    const updatedAttachments = [...values.Attachments];
    updatedAttachments.splice(index, 1);
    setFieldValue('Attachments', updatedAttachments);
  };
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
            {/* From Section (Left) */}
            <div className="flex-1 space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">From</h3>

              <SearchableDropdown
                label="Select Fund"
                name="fromFundId"
                required
                selectedValue={values.fromFundId}
                onSelect={(value) => {
                  const updates = handleFundSelect('fromFund', value);
                  setFieldValue('fromFundId', updates.fromFundId);
                  setFieldValue('fromFund', updates.fromFund);
                }}
                options={fundOptions.map((f) => ({
                  label: `${f.Code} - ${f.Name}`,
                  value: f.ID,
                }))}
                error={touched.fromFundId && errors.fromFundId}
              />

              {values.fromFund && (
                <div className="space-y-3 mt-4">
                  <FormField
                    label="Fund Code"
                    name="fromCode"
                    type="text"
                    value={values.fromFund.Code}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Fund Name"
                    name="fromName"
                    type="text"
                    value={values.fromFund.Name}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Available Balance"
                    name="fromBalance"
                    type="text"
                    value={values.fromFund.Balance || '0'}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                </div>
              )}
            </div>

            {/* To Section (Right) */}
            <div className="flex-1 space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium text-lg">To</h3>

              <SearchableDropdown
                label="Select Fund"
                name="toFundId"
                required
                selectedValue={values.toFundId}
                onSelect={(value) => {
                  const updates = handleFundSelect('toFund', value);
                  setFieldValue('toFundId', updates.toFundId);
                  setFieldValue('toFund', updates.toFund);
                }}
                options={fundOptions.map((f) => ({
                  label: `${f.Code} - ${f.Name}`,
                  value: f.ID,
                }))}
                error={touched.toFundId && errors.toFundId}
              />

              {values.toFund && (
                <div className="space-y-3 mt-4">
                  <FormField
                    label="Fund Code"
                    name="toCode"
                    type="text"
                    value={values.toFund.Code}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Fund Name"
                    name="toName"
                    type="text"
                    value={values.toFund.Name}
                    className="bg-gray-200 cursor-not-allowed"
                    readOnly
                  />
                  <FormField
                    label="Available Balance"
                    name="toBalance"
                    type="text"
                    value={values.toFund.Balance || '0'}
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
              type="text" // change to text so we can format freely
              onChange={(e) => {
                // Remove all non-digit characters
                const rawValue = e.target.value.replace(/\D/g, '');

                // Format as cents (two decimal places)
                const formattedValue = rawValue
                  ? (parseInt(rawValue, 10) / 100).toFixed(2)
                  : '';

                // Pass to Formik
                handleChange({
                  target: {
                    name: 'transferAmount',
                    value: formattedValue,
                  },
                });
              }}
              onBlur={handleBlur}
              value={
                values.transferAmount !== '' && !isNaN(values.transferAmount)
                  ? Number(values.transferAmount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : ''
              }
              error={errors.transferAmount}
              touched={touched.transferAmount}
              required
            />
          </div>
          {/* Attachments Section */}
          <div className="my-4">
            <div className="space-y-2">
              <h2 className="font-bold text-lg">Attachments</h2>

              {/* Hidden file input triggered by button */}
              <input
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e, setFieldValue, values)}
                className="hidden"
                id="file-upload"
                key={values.Attachments?.length || 0}
              />

              {/* Styled upload button */}
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors duration-150"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </label>

              {/* File list */}
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

export default BudgetFundTransferForm;

// <Formik
//   enableReinitialize
//   onSubmit={handleSubmit}
//   initialValues={formData}
//   validationSchema={validationSchema}
// >
//   {({
//     values,
//     errors,
//     touched,
//     handleChange,
//     handleBlur,
//     isSubmitting,
//   }) => (
//     <Form className="space-y-4">
//       <div className="space-y-4">
//         <p className="font-medium">Fund Source</p>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <FormField
//             label="Code"
//             name="targeteCode"
//             type="text"
//             onChange={handleChange}
//             onBlur={handleBlur}
//             value={values.targeteCode}
//             error={errors.targetCode}
//             touched={touched.targetCode}
//             required
//           />
//           <FormField
//             label="Name"
//             name="targetFundName"
//             type="text"
//             onChange={handleChange}
//             onBlur={handleBlur}
//             value={values.targetFundName}
//             error={errors.targetFundName}
//             touched={touched.targetFundName}
//             required
//           />
//           <FormField
//             label="Balance"
//             name="targetBalance"
//             type="text"
//             onChange={handleChange}
//             onBlur={handleBlur}
//             value={values.targetBalance}
//             error={errors.targetBalance}
//             touched={touched.targetBalance}
//             required
//           />
//           <FormField
//             label="Transfer"
//             name="targetTransfer"
//             type="text"
//             onChange={handleChange}
//             onBlur={handleBlur}
//             value={values.targetTransfer}
//             error={errors.targetTransfer}
//             touched={touched.targetTransfer}
//             required
//           />
//           <FormField
//             name="targetRemarks"
//             type="textarea"
//             label="Remarks"
//             onChange={handleChange}
//             onBlur={handleBlur}
//             value={values.targetRemarks}
//             error={errors.targetRemarks}
//             touched={touched.targetRemarks}
//             required
//           />
//         </div>
//       </div>

//       <div className="space-y-4">
//         <p className="font-medium">Fund Target</p>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <FormField
//             label="Code"
//             name="code"
//             type="text"
//             onChange={handleChange}
//             onBlur={handleBlur}
//             value={values.sourceCode}
//             error={errors.sourceCode}
//             touched={touched.sourceCode}
//             required
//           />
//           <FormField
//             label="Name"
//             name="name"
//             type="text"
//             onChange={handleChange}
//             onBlur={handleBlur}
//             value={values.sourceFundName}
//             error={errors.sourceFundName}
//             touched={touched.sourceFundName}
//             required
//           />
//           <FormField
//             label="Balance"
//             name="sourceBalance"
//             type="text"
//             onChange={handleChange}
//             onBlur={handleBlur}
//             value={values.sourceBalance}
//             error={errors.sourceBalance}
//             touched={touched.sourceBalance}
//             required
//           />
//           <FormField
//             label="Transfer"
//             name="sourceTransfer"
//             type="text"
//             onChange={handleChange}
//             onBlur={handleBlur}
//             value={values.sourceTransfer}
//             error={errors.sourceTransfer}
//             touched={touched.sourceTransfer}
//             required
//           />
//           <FormField
//             name="sourceRemarks"
//             type="textarea"
//             label="Remarks"
//             onChange={handleChange}
//             onBlur={handleBlur}
//             value={values.sourceRemarks}
//             error={errors.sourceRemarks}
//             touched={touched.sourceRemarks}
//             required
//           />
//         </div>
//       </div>

//       <div className="flex justify-end space-x-3">
//         <button
//           type="button"
//           onClick={onClose}
//           className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//         >
//           {initialData ? 'Update' : 'Save'}
//         </button>
//       </div>
//     </Form>
//   )}
// </Formik>

// useEffect(() => {
//   if (initialData?.ID) {
//     setFormData({
//       id: initialData?.ID,
//       budgetName: initialData?.Name,
//       fiscalYear: initialData?.FiscalYearID,
//       department: initialData?.DepartmentID,
//       subDepartment: initialData?.SubDepartmentID,
//       chartOfAccounts: initialData?.ChartofAccountsID,
//       fund: initialData?.FundID,
//       project: initialData?.ProjectID,
//       appropriation: initialData?.Appropriation,
//       charges: initialData?.Charges,
//       totalAmount: initialData?.TotalAmount,
//       balance: initialData?.AppropriationBalance,
//       january: initialData?.January,
//       february: initialData?.February,
//       march: initialData?.March,
//       april: initialData?.April,
//       may: initialData?.May,
//       june: initialData?.June,
//       july: initialData?.July,
//       august: initialData?.August,
//       september: initialData?.September,
//       october: initialData?.October,
//       november: initialData?.November,
//       december: initialData?.December,
//     });
//   } else {
//     setFormData(initialValues);
//   }
// }, [initialData]);
