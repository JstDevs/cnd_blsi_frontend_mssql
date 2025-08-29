import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Printer,
  Search,
  Plus,
  Edit,
  Trash2,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  SaveIcon,
  EditIcon,
  Paperclip,
  PrinterIcon,
  CheckLine,
  X,
} from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchBanks } from '@/features/settings/bankSlice';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import FormField from '@/components/common/FormField';
import { fetchEmployees } from '@/features/settings/employeeSlice';
import toast from 'react-hot-toast';
import { convertAmountToWords } from '@/utils/amountToWords';
import axiosInstance from '@/utils/axiosInstance';
import { useModulePermissions } from '@/utils/useModulePremission';
const API_URL = import.meta.env.VITE_API_URL;
// Validation schema
const chequeSchema = Yup.object().shape({
  payee: Yup.string().required('Payee is required'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  date: Yup.date().required('Date is required'),
  bank: Yup.string().required('Bank is required'),
  accountNumber: Yup.string().required('Account number is required'),
  accountName: Yup.string().required('Account name is required'),
  chequeType: Yup.string().required('Cheque type is required'),
  checkNumber: Yup.string().required('Check number is required'),
  brstn: Yup.string().required('BRSTN is required'),
  dv: Yup.string().required('DV is required'),
  signatory1: Yup.string().required('Signatory 1 is required'),
  signatory2: Yup.string()
    .required('Signatory 2 is required')
    .notOneOf([Yup.ref('signatory1')], 'Signatories must be different'),
  Attachments: Yup.array(),
});

function ChequeGeneratorPage() {
  const [attachments, setAttachments] = useState([]);
  const [currentCheck, setCurrentCheck] = useState(null);
  const [chequeList, setChequeList] = useState([]);
  const [isLoadingBAPAction, setIsLoadingBAPAction] = useState(false);

  const dispatch = useDispatch();
  const { banks, isLoading } = useSelector((state) => state.banks);
  const { employees, isLoading: employeeLoading } = useSelector(
    (state) => state.employees
  );
  // ---------------------USE MODULE PERMISSIONS------------------START (ChequeGeneratorPage - MODULE ID = 16 )
  const { Add, Edit, Delete, Print } = useModulePermissions(33);
  // Formik initialization
  const formik = useFormik({
    initialValues: {
      status: 'Pending',
      payee: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      bank: '',
      accountNumber: '',
      accountName: '',
      chequeType: 'Single',
      particulars: '',
      checkNumber: '',
      brstn: '',
      dv: '',
      additionalInformation: '',
      signatory1: '',
      signatory2: '',
      Attachments: [],
    },
    validationSchema: chequeSchema,
    onSubmit: async (values) => {
      await handleChequeSave(values);
    },
  });

  useEffect(() => {
    dispatch(fetchBanks());
    dispatch(fetchEmployees());
    fetchChequeList();
  }, []);

  const fetchChequeList = async () => {
    try {
      const response = await axiosInstance('/chequeGenerator/checkList');
      setChequeList(response.data);
    } catch (error) {
      console.error('Error fetching cheque list:', error);
      throw error;
    }
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
  const handleChequeSave = async (values) => {
    try {
      const formData = new FormData();

      // Add all cheque data fields
      formData.append('IsNew', currentCheck ? 'false' : 'true');
      formData.append('ID', currentCheck?.ID || '');
      formData.append('AddCondition', 'true');
      formData.append('DisbursementID', values.dv);
      formData.append('BankID', values.bank);
      formData.append('SignatoryType', values.chequeType);
      formData.append('AccountNumber', values.accountNumber);
      formData.append('AccountName', values.accountName);
      formData.append('CheckNumber', values.checkNumber);
      formData.append('BRSTN', values.brstn);
      formData.append('CheckDate', values.date);
      formData.append('Payee', values.payee);
      formData.append('Amount', values.amount);
      formData.append('Words', convertAmountToWords(values.amount));
      formData.append('SignatoryOneID', values.signatory1);
      formData.append('SignatoryTwoID', values.signatory2);
      formData.append('Remarks', values.additionalInformation);
      formData.append('OBR', values.obr || '');

      // Add attachments if they exist
      if (attachments.length > 0) {
        attachments.forEach((file, index) => {
          if (file.ID) {
            formData.append(`Attachments[${index}].ID`, file.ID);
          } else {
            formData.append(`Attachments[${index}].File`, file);
          }
        });
      } else {
        formData.append('Attachments', '[]');
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const res = await axiosInstance.post(
        '/chequeGenerator/save',
        formData,
        config
      );

      if (res.data.error && res.status !== 200) {
        toast.error(res.data.error);
        return;
      }

      toast.success('Cheque saved successfully');
      fetchChequeList();
      resetForm();
    } catch (error) {
      console.error('Error saving cheque:', error);
      toast.error('Failed to save cheque');
      throw error;
    }
  };

  const handleEditCheque = (cheque) => {
    setCurrentCheck(cheque);

    // Populate the form fields using Formik's setValues
    formik.setValues({
      status: cheque.Status,
      payee: cheque.Payee,
      amount: cheque.Amount,
      date: cheque.CheckDate,
      bank: cheque.BankID.toString(),
      accountNumber: cheque.AccountNumber,
      accountName: cheque.AccountName,
      chequeType: cheque.SignatoryType,
      particulars: cheque.Particulars || '',
      checkNumber: cheque.CheckNumber,
      brstn: cheque.BRSTN,
      dv: cheque.DisbursementID,
      additionalInformation: cheque.Remarks,
      obr: cheque.OBR || '',
      signatory1: cheque.SignatoryOneID.toString(),
      signatory2: cheque.SignatoryTwoID.toString(),
      Attachments: cheque.Attachments || [],
    });
  };

  const resetForm = () => {
    setCurrentCheck(null);
    formik.resetForm();
    setAttachments([]);
  };

  const columns = [
    {
      key: 'Status',
      header: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 text-xs rounded font-medium ${
            value === 'Posted'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'AccountNumber',
      header: 'Account Number',
      sortable: true,
    },
    {
      key: 'AccountName',
      header: 'Account Name',
      sortable: true,
    },
    {
      key: 'CheckNumber',
      header: 'Check Number',
      sortable: true,
    },
    {
      key: 'Payee',
      header: 'Payee',
      sortable: true,
    },
    {
      key: 'Amount',
      header: 'Amount',
      sortable: true,
      render: (value) => (
        <span className="font-medium">
          {' '}
          {value
            ? Number(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : '—'}
        </span>
      ),
    },
    {
      key: 'ApprovalProgress',
      header: 'Approval Progress',
      sortable: true,
    },
    {
      key: 'ApprovalVersion',
      header: 'Approval Version',
      sortable: true,
    },
  ];

  // const actions = [
  //   Edit && {
  //     icon: PencilIcon,
  //     title: 'Edit',
  //     onClick: (item) => handleEditCheque(item),
  //   },
  // ];
  const handleDelete = (dv) => {
    console.log('Delete', dv);
  };
  const handleView = (dv) => {
    console.log('View', dv);
  };
  const handleCGPAction = async (dv, action) => {
    setIsLoadingBAPAction(true);
    try {
      // TODO : add action
      // const response = await axiosInstance.post(
      //   `/disbursementVoucher/${action}`,
      //   { ID: dv.ID }
      // );
      console.log(`${action}d:`, response.data);
      // dispatch(fetchGeneralServiceReceipts());
      toast.success(`Budget Allotment ${action}d successfully`);
    } catch (error) {
      console.error(`Error ${action}ing Budget Allotment:`, error);
      toast.error(`Error ${action}ing Budget Allotment`);
    } finally {
      setIsLoadingBAPAction(false);
    }
  };
  const actions = (row) => {
    const actionList = [];

    if (row.Status.toLowerCase().includes('rejected') && Edit) {
      actionList.push({
        icon: PencilIcon,
        title: 'Edit',
        onClick: handleEditCheque,
        className:
          'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
      });
      actionList.push({
        icon: TrashIcon,
        title: 'Delete',
        onClick: () => handleDelete(row),
        className:
          'text-error-600 hover:text-error-900 p-1 rounded-full hover:bg-error-50',
      });
    } else if (row.Status.toLowerCase().includes('requested')) {
      actionList.push(
        {
          icon: CheckLine,
          title: 'Approve',
          onClick: () => handleCGPAction(row, 'approve'),
          className:
            'text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50',
        },
        {
          icon: X,
          title: 'Reject',
          onClick: () => handleCGPAction(row, 'reject'),
          className:
            'text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50',
        }
      );
    }
    actionList.push({
      icon: EyeIcon,
      title: 'View',
      onClick: handleView,
      className:
        'text-primary-600 hover:text-primary-900 p-1 rounded-full hover:bg-primary-50',
    });
    return actionList;
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="page-header">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1>Cheque Generator</h1>
            <p>Generate and print cheques</p>
          </div>
          <div className="flex gap-2 max-sm:w-full">
            {/* // SAVE BUTTON  */}
            {!currentCheck && Add && (
              <button
                type="submit"
                onClick={formik.handleSubmit}
                className="btn btn-primary max-sm:w-full"
                disabled={formik.isSubmitting}
              >
                <SaveIcon className="h-5 w-5 mr-2" />
                Save
              </button>
            )}
            {/* ?? EDIT BUTTON  */}
            {currentCheck && Edit && (
              <button
                type="submit"
                onClick={formik.handleSubmit}
                className="btn btn-primary max-sm:w-full"
                disabled={formik.isSubmitting}
              >
                <EditIcon className="h-5 w-5 mr-2" />
                Edit
              </button>
            )}
            {currentCheck && Print && (
              <button
                type="button"
                onClick={() => {
                  console.log('Print');
                }}
                // onClick={formik.handleSubmit}
                className="btn btn-primary max-sm:w-full"
                disabled={formik.isSubmitting}
              >
                <PrinterIcon className="h-5 w-5 mr-2" />
                Print
              </button>
            )}
            {currentCheck && (
              <button
                type="button"
                onClick={() => {
                  console.log('Attachment');
                }}
                // onClick={formik.handleSubmit}
                className="btn btn-primary max-sm:w-full"
                disabled={formik.isSubmitting}
              >
                Attachment
              </button>
            )}
            {currentCheck && (
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-outline mr-2"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Cheque Template Section */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h2 className="text-lg font-semibold mb-4 text-yellow-700">
              Cheque Template
            </h2>

            <div className="space-y-4">
              <div>
                <SearchableDropdown
                  options={banks.map((bank) => ({
                    value: bank.ID.toString(),
                    label: bank.Name,
                  }))}
                  label={'Bank'}
                  placeholder="Select Bank"
                  name="bank"
                  selectedValue={formik.values.bank}
                  onSelect={(value) => formik.setFieldValue('bank', value)}
                  error={formik.touched.bank && formik.errors.bank}
                  touched={formik.touched.bank}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="chequeType"
                      value="Single"
                      checked={formik.values.chequeType === 'Single'}
                      onChange={formik.handleChange}
                      className="mr-2"
                    />
                    Single
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="chequeType"
                      value="Double"
                      checked={formik.values.chequeType === 'Double'}
                      onChange={formik.handleChange}
                      className="mr-2"
                    />
                    Double
                  </label>
                </div>
                {formik.touched.chequeType && formik.errors.chequeType && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.chequeType}
                  </div>
                )}
              </div>

              <FormField
                type="text"
                label={'DV'}
                value={formik.values.dv}
                onChange={formik.handleChange}
                name="dv"
                error={formik.touched.dv && formik.errors.dv}
                touched={formik.touched.dv}
              />
            </div>
            {/* Attachments Section */}
            <div className="my-4">
              <div className="space-y-2">
                <h2 className="font-bold mb-2">Attachments</h2>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    handleFileUpload(e, formik.setFieldValue, formik.values)
                  }
                  key={formik.values.Attachments.length}
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                />
              </div>
              {formik?.values?.Attachments?.length > 0 ? (
                <div className="space-y-2 py-2 mt-2">
                  {formik.values.Attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm">
                          {file.ID ? (
                            <a
                              href={`${API_URL}/uploads/${file.DataImage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {file.name || file.DataName}
                            </a>
                          ) : (
                            file.name || file.DataName
                          )}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          removeAttachment(
                            index,
                            formik.setFieldValue,
                            formik.values
                          )
                        }
                        className="text-red-500 hover:text-red-700"
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

          {/* Cheque Details Section */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-yellow-700">
                Cheque Details
              </h2>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                Status: {formik.values.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FormField
                    type="text"
                    label={'Account Number'}
                    name="accountNumber"
                    value={formik.values.accountNumber}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.accountNumber &&
                      formik.errors.accountNumber
                    }
                    touched={formik.touched.accountNumber}
                  />
                </div>
                <div>
                  <FormField
                    type="text"
                    label={'Account Name'}
                    name="accountName"
                    value={formik.values.accountName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.accountName && formik.errors.accountName
                    }
                    touched={formik.touched.accountName}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FormField
                    type="text"
                    label={'Check Number'}
                    name="checkNumber"
                    value={formik.values.checkNumber}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.checkNumber && formik.errors.checkNumber
                    }
                    touched={formik.touched.checkNumber}
                  />
                </div>
                <div>
                  <FormField
                    type="text"
                    label={'BRSTN'}
                    name="brstn"
                    value={formik.values.brstn}
                    onChange={formik.handleChange}
                    error={formik.touched.brstn && formik.errors.brstn}
                    touched={formik.touched.brstn}
                  />
                </div>
              </div>

              <div>
                <FormField
                  type="date"
                  label={'Date'}
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  error={formik.touched.date && formik.errors.date}
                  touched={formik.touched.date}
                />
              </div>

              <div>
                <FormField
                  type="text"
                  label={'Pay to the order of:'}
                  name="payee"
                  value={formik.values.payee}
                  onChange={formik.handleChange}
                  error={formik.touched.payee && formik.errors.payee}
                  touched={formik.touched.payee}
                />
              </div>

              <div>
                <FormField
                  type="text" // so we can control formatting
                  label="Amount"
                  name="amount"
                  value={
                    formik.values.amount !== '' && !isNaN(formik.values.amount)
                      ? Number(formik.values.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : ''
                  }
                  onChange={(e) => {
                    // Remove all non-digit characters
                    const rawValue = e.target.value.replace(/\D/g, '');

                    // Format as cents (two decimal places)
                    const formattedValue = rawValue
                      ? (parseInt(rawValue, 10) / 100).toFixed(2)
                      : '';

                    formik.setFieldValue('amount', formattedValue);
                  }}
                  step="0.01"
                  error={formik.touched.amount && formik.errors.amount}
                  touched={formik.touched.amount}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount in Words:
                </label>
                <FormField
                  type="text"
                  value={convertAmountToWords(formik.values.amount)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Signatories Section */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <h2 className="text-lg font-semibold mb-4 text-yellow-700">
              Signatories
            </h2>

            <div className="space-y-4">
              <div>
                <SearchableDropdown
                  options={employees?.map((employee) => ({
                    value: employee.ID.toString(),
                    label: `${employee.FirstName} ${employee.LastName}`,
                  }))}
                  label="Signatory 1"
                  placeholder="Select signatory"
                  name="signatory1"
                  selectedValue={formik.values.signatory1}
                  onSelect={(value) => {
                    if (value === formik.values.signatory2) {
                      toast.error(
                        'Signatory 1 cannot be the same as Signatory 2'
                      );
                      return;
                    }
                    formik.setFieldValue('signatory1', value);
                  }}
                  error={formik.touched.signatory1 && formik.errors.signatory1}
                  touched={formik.touched.signatory1}
                  required
                />
              </div>

              <div>
                <SearchableDropdown
                  options={employees?.map((employee) => ({
                    value: employee.ID.toString(),
                    label: `${employee.FirstName} ${employee.LastName}`,
                  }))}
                  label="Signatory 2"
                  placeholder="Select signatory"
                  name="signatory2"
                  selectedValue={formik.values.signatory2}
                  onSelect={(value) => {
                    if (value === formik.values.signatory1) {
                      toast.error(
                        'Signatory 2 cannot be the same as Signatory 1'
                      );
                      return;
                    }
                    formik.setFieldValue('signatory2', value);
                  }}
                  error={formik.touched.signatory2 && formik.errors.signatory2}
                  touched={formik.touched.signatory2}
                  required
                />
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 text-yellow-700">
                  Additional Info
                </h3>
                <textarea
                  value={formik.values.additionalInformation}
                  name="additionalInformation"
                  onChange={formik.handleChange}
                  placeholder="Additional information..."
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Check List Section */}
      <div className="bg-white p-4 rounded-lg shadow border mt-4">
        <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
          <h2 className="text-lg font-semibold">Check List</h2>
        </div>

        <DataTable
          columns={columns}
          data={chequeList}
          actions={actions}
          loading={isLoading || employeeLoading || isLoadingBAPAction}
          pagination
        />
      </div>

      {/* Original Cheque Preview */}
      <div className="mt-6 bg-white p-3 sm:p-6 rounded-lg shadow border">
        <h2 className="text-lg font-medium mb-4">Cheque Preview</h2>
        <div className="border border-gray-300 p-6 rounded-lg bg-white shadow">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Bank</p>
                <p className="font-medium">
                  {banks.find((b) => b.ID.toString() === formik.values.bank)
                    ?.Name || 'Select a bank'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {formik.values.date
                    ? new Date(formik.values.date).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500">Pay to the Order of</p>
              <p className="font-medium text-lg border-b border-gray-300 pb-1">
                {formik.values.payee || 'Enter payee name'}
              </p>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Amount in Words</p>
                <p className="font-medium">
                  {formik.values.amount
                    ? convertAmountToWords(formik.values.amount)
                    : 'Enter amount'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-lg">
                  {formik.values.amount
                    ? new Intl.NumberFormat('en-PH', {
                        style: 'currency',
                        currency: 'PHP',
                      }).format(formik.values.amount)
                    : '₱0.00'}
                </p>
              </div>
            </div>

            <div className="mt-12 pt-4 border-t border-gray-300">
              <div className="text-center">
                <p className="text-sm text-gray-500">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChequeGeneratorPage;
