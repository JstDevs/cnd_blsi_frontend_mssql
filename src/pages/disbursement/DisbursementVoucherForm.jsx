import { useState, useRef, useEffect } from 'react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Formik,
  Form,
  FieldArray,
  Field,
  ErrorMessage,
  useFormikContext,
} from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import FormField from '../../components/common/FormField';
import ObligationRequestAddItemForm from './ObligationRequestAddItemForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { convertAmountToWords } from '../../utils/amountToWords';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  BuildingOfficeIcon,
  DocumentCheckIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  createDisbursementVoucher,
  updateDisbursementVoucher,
  fetchRequestOptions,
  fetchDisbursementVouchers,
} from '../../features/disbursement/disbursementVoucherSlice';
import { ChevronDownIcon, UserIcon, UsersIcon } from 'lucide-react';

import { obligationRequestItemsCalculator } from '../../utils/obligationRequestItemsCalculator';
const API_URL = import.meta.env.VITE_API_URL;
const payeeTypes = [
  { value: 'Employee', label: 'Employee' },
  { value: 'Vendor', label: 'Vendor' },
  { value: 'Individual', label: 'Individual' },
];

const requestTypes = [
  { value: 'Obligation Request', label: 'Obligation Request' },
  { value: 'FURS', label: 'FURS' },
  { value: 'Standalone Request', label: 'Standalone Request' },
];

function DisbursementVoucherForm({
  initialData,
  onClose,
  employeeOptions = [],
  vendorOptions = [],
  individualOptions = [],
  employeeData = [],
  vendorData = [],
  individualData = [],
  departmentOptions = [],
  fundOptions = [],
  projectOptions = [],
  fiscalYearOptions = [],
  particularsOptions = [],
  unitOptions = [],
  taxCodeOptions = [],
  budgetOptions = [],
  taxCodeFull = [],
  chartOfAccountsOptions = [],
}) {
  const dispatch = useDispatch();
  const formikRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [accountingEntries, setAccountingEntries] = useState([]);
  // Add state to track the selected mode of payment
  const [selectedModeOfPayment, setSelectedModeOfPayment] = useState(
    initialData?.modeOfPayment || ''
  );
  const getValidationSchema = () => {
    return Yup.object().shape({
      payeeType: Yup.string().required('Payee type is required'),
      payeeId: Yup.string().required('Payee selection is required'),
      accountingEntries:
        selectedRequestType === 'Standalone Request'
          ? Yup.array()
          : Yup.array().min(1, 'At least one item is required'),
      // contraAccount: Yup.string().required('Contra Account is required'),
      modeOfPayment: Yup.string().required('Mode of Payment is required'),
      bank:
        selectedModeOfPayment === 'Check'
          ? Yup.string().required('Bank is required')
          : Yup.string(),
      checkNumber:
        selectedModeOfPayment === 'Check'
          ? Yup.string().required('Check Number is required')
          : Yup.string(),
      receivedPaymentBy: Yup.string().required(
        'Received Payment By is required'
      ),
      // Amount: Yup.string().required('Amount By is required'),
      // Updated validation for contra accounts array
      contraAccounts: Yup.array()
        .min(1, 'At least one contra account is required')
        .of(
          Yup.object().shape({
            account: Yup.string().required('Account is required'),
            normalBalance: Yup.string()
              .oneOf(
                ['Debit', 'Credit'],
                'Normal balance must be Debit or Credit'
              )
              .required('Normal balance is required'),
            amount: Yup.number()
              .min(0, 'Amount must be positive')
              .required('Amount is required'),
          })
        ),
    });
  };
  const handleAddEntry = (entry) => {
    setAccountingEntries([...accountingEntries, entry]);
  };

  const { requestOptions, requestOptionsLoading, requestOptionsError } =
    useSelector((state) => state.disbursementVouchers);

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
    obrNo: initialData?.obrNo || '',
    obrDate: initialData?.obrDate || new Date().toISOString().split('T')[0],
    dvDate: initialData?.dvDate || new Date().toISOString().split('T')[0],
    paymentDate:
      initialData?.paymentDate || new Date().toISOString().split('T')[0],
    payeeType:
      initialData?.payeeType ||
      (initialData?.VendorID
        ? 'Vendor'
        : initialData?.CustomerID
        ? 'Individual'
        : initialData?.EmployeeID
        ? 'Employee'
        : ''),
    payeeName: initialData?.payeeName || '',
    payeeId:
      initialData?.payeeId ||
      initialData?.VendorID ||
      initialData?.CustomerID ||
      initialData?.EmployeeID ||
      '',
    payeeAddress: initialData?.payeeAddress || '',
    officeUnitProject: initialData?.officeUnitProject || '',
    orsNumber: initialData?.orsNumber || '',
    responsibilityCenter: initialData?.responsibilityCenter || '',
    requestForPayment: initialData?.requestForPayment || '',
    items:
      Array.isArray(initialData?.items) && initialData.items.length > 0
        ? initialData.items
        : [defaultItem],
    taxes: Array.isArray(initialData?.taxes) ? initialData.taxes : [],
    contraAccounts:
      Array.isArray(initialData?.contraAccounts) &&
      initialData.contraAccounts.length > 0
        ? initialData.contraAccounts
        : [
            {
              code: '',
              account: '',
              amount: '',
              normalBalance: '',
            },
          ],
    accountingEntries: Array.isArray(initialData?.accountingEntries)
      ? initialData.accountingEntries
      : [],
    Attachments: Array.isArray(initialData?.Attachments)
      ? initialData.Attachments
      : [],
    OBR_LinkID: initialData?.OBR_LinkID || '',
    // contraAccount: initialData?.ContraAccountID || '',
    modeOfPayment: initialData?.modeOfPayment || '',
    bank: initialData?.bank || '',
    checkNumber: initialData?.checkNumber || '',
    receivedPaymentBy: initialData?.ReceivedPaymentBy || '',
    // Amount: initialData?.Amount || '',
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);

    const { grossAmount, totalTaxes, netAmount } = calculateTotals(
      values.items,
      values.taxes
    );

    const fd = new FormData();

    if (values.payeeType === 'Employee') {
      fd.append('EmployeeID', values.payeeId);
      fd.append('VendorID', '');
      fd.append('CustomerID', '');
    } else if (values.payeeType === 'Vendor') {
      fd.append('EmployeeID', '');
      fd.append('VendorID', values.payeeId);
      fd.append('CustomerID', '');
    } else if (values.payeeType === 'Individual') {
      fd.append('EmployeeID', '');
      fd.append('VendorID', '');
      fd.append('CustomerID', values.payeeId);
    }

    fd.append('PayeeType', values.payeeType);

    // IF STANDALONE REQUEST THEN MAKE IT TRU OR WE HAVE THE OBR LINK ID
    values?.requestType === 'Standalone Request'
      ? fd.append('IsStandaloneRequest', true)
      : fd.append('OBR_LinkID', values.OBR_LinkID || '');

    fd.append(
      'Payee',
      selectedPayee?.Name ||
        selectedPayee?.FirstName +
          ' ' +
          selectedPayee?.MiddleName +
          ' ' +
          selectedPayee?.LastName ||
        ''
    );
    fd.append('Address', selectedPayee?.StreetAddress || '');
    fd.append('InvoiceNumber', values.obrNo);
    fd.append('InvoiceDate', values.obrDate);
    fd.append('ResponsibilityCenter', values.responsibilityCenter);

    const total = values.accountingEntries.reduce(
      (sum, e) => sum + Number(e.subtotal || 0),
      0
    );
    const ewt = values.accountingEntries.reduce(
      (sum, e) => sum + Number(e.ewt || 0),
      0
    );
    const withheldAmount = values.accountingEntries.reduce(
      (sum, e) => sum + Number(e.withheld || 0),
      0
    );
    const vat = values.accountingEntries.reduce(
      (sum, e) => sum + Number(e.vat || 0),
      0
    );
    const discounts = values.accountingEntries.reduce(
      (sum, e) => sum + Number(e.discount || 0),
      0
    );

    fd.append('Total', total.toFixed(2));
    fd.append('EWT', ewt.toFixed(2));
    fd.append('WithheldAmount', withheldAmount.toFixed(2));
    fd.append('Vat_Total', vat.toFixed(2));
    fd.append('Discounts', discounts.toFixed(2));

    fd.append('FundsID', values.fund);
    fd.append('FiscalYearID', values.fiscalYear);
    fd.append('ProjectID', values.project);

    fd.append('TravelID', '');

    /* ⬇︎ Totals */
    // fd.append('grossAmount',  grossAmount);
    // fd.append('totalTaxes',   totalTaxes);
    // fd.append('netAmount',    netAmount);

    /* ⬇︎ Complex arrays → stringify */
    fd.append('Items', JSON.stringify(values.accountingEntries));
    // fd.append('taxes',            JSON.stringify(values.taxes));
    // fd.append('contraAccounts',   JSON.stringify(values.contraAccounts));
    // fd.append('accountingEntries',JSON.stringify(values.accountingEntries));

    /* ⬇︎ Attachments (handle files or IDs) */
    values.Attachments.forEach((att, idx) => {
      if (att.ID) {
        fd.append(`Attachments[${idx}].ID`, att.ID);
      } else {
        fd.append(`Attachments[${idx}].File`, att.File);
      }
    });

    // fd.append('ContraAccountID', values.contraAccount);
    fd.append('ModeOfPayment', values.modeOfPayment);
    fd.append('BankID', values.bank);
    fd.append('CheckNumber', values.checkNumber);
    fd.append('ReceivedPaymentBy', values.receivedPaymentBy);
    // fd.append('Amount', values.Amount);
    // NEW: Handle contra accounts array
    fd.append(
      'ContraAccounts',
      JSON.stringify(
        values.contraAccounts.map((account) => ({
          ContraAccountID: parseInt(account.account),
          NormalBalance: account.normalBalance,
          Amount: parseFloat(account.amount),
        }))
      )
    );
    if (initialData) {
      fd.append('LinkID', initialData.LinkID);
      fd.append('IsNew', false);
    } else {
      fd.append('IsNew', true);
    }

    const action = createDisbursementVoucher(fd);

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success('Success');
        onClose();
        dispatch(fetchDisbursementVouchers());
      })
      .catch((error) => {
        toast.error(error?.message || 'Failed to submit');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const PayeeTypeIcon = ({ type }) => {
    switch (type) {
      case 'Employee':
        return <UsersIcon className="w-5 h-5" />;
      case 'Vendor':
        return <BuildingOfficeIcon className="w-5 h-5" />;
      case 'Individual':
        return <UserIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };
  // console.log({ taxCodeFull });
  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-6 bg-white">
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={getValidationSchema()}
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
          setFieldError,
          setFieldTouched,
          isValid,
        }) => {
          const { grossAmount, totalTaxes, netAmount } = calculateTotals(
            values.items,
            values.taxes
          );

          const payeeTypeOptions = payeeTypes.map((type) => ({
            value: type.value,
            label: type.label,
          }));

          // Get the selected value object
          const selectedPayeeType = payeeTypeOptions.find(
            (opt) => opt.value === values.payeeType
          );

          const handlePayeeTypeChange = (type) => {
            setSelectedPayee(null);
            setFieldValue('payeeType', type);
            setFieldValue('payeeName', '');
            setFieldValue('payeeId', '');
            setFieldValue('payeeAddress', '');
            setFieldValue('officeUnitProject', '');
            setFieldValue('orsNumber', '');
          };

          const handleRequestTypeChange = async (type) => {
            setSelectedRequest(null);
            setFieldValue('requestType', type);
            console.log('Selected Request Type:', type);
            setSelectedRequestType(type);
            if (type === 'Standalone Request') {
              setFieldValue('accountingEntries', [], false);
              setShowEntryModal(true);
              // await setFieldError('accountingEntries', '');
              return;
            }

            if (values.payeeType && values.payeeId && type) {
              dispatch(
                fetchRequestOptions({
                  requestType: type,
                  payeeType: values.payeeType,
                  payeeId: values.payeeId,
                })
              );
            }
          };

          const handleRequestSelect = (option) => {
            setSelectedRequest(option);

            const entriesFromRequest = option?.raw?.TransactionItemsAll || [];

            // Add mapped fields for display (without losing raw data)
            const enrichedEntries = entriesFromRequest.map((item) => {
              /* 1. build “vals” from the raw item */
              const vals = {
                Price: item.Price ?? 0,
                Quantity: item.Quantity ?? 1,
                DiscountRate: item.DiscountRate ?? 0,
                Vatable: item.Vatable,
                withheldEWT: item.EWTRate ?? 0,
              };

              /* 2. call your helper */
              const computed = obligationRequestItemsCalculator({
                price: vals.Price,
                quantity: vals.Quantity,
                taxRate: item.TaxRate || 0,
                discountPercent: vals.DiscountRate,
                vatable: vals.Vatable,
                ewtRate: vals.withheldEWT,
              });

              /* 3. return the full enriched record */
              return {
                ...item, // raw DB record
                ...computed, // whatever fields the calculator returns
                itemName: item.Item?.Name || '',
                subtotal: item.AmountDue || 0,
                Remarks: item.Remarks || '',
                FPP: item.FPP || '',
                accountCode:
                  item.ChargeAccount?.ChartofAccounts?.AccountCode || '',
                accountName: item.ChargeAccount?.ChartofAccounts?.Name || '',
                fundCode: option?.raw?.sourceFunds?.Code || '',
              };
            });

            if (formikRef.current) {
              // Append enriched full raw records
              formikRef.current.setFieldValue(
                'accountingEntries',
                enrichedEntries
              );
              formikRef.current.setFieldValue(
                'OBR_LinkID',
                option?.raw?.LinkID || ''
              );
            }
          };

          const handlePayeeSelect = (payee) => {
            let selectedItem = null;
            switch (values.payeeType) {
              case 'Employee':
                selectedItem = employeeData.find((item) => item.ID === payee);
                break;
              case 'Vendor':
                selectedItem = vendorData.find((item) => item.ID === payee);
                break;
              case 'Individual':
                selectedItem = individualData.find((item) => item.ID === payee);
                break;
              default:
                break;
            }
            setSelectedPayee(selectedItem);
            setFieldValue('payeeName', selectedItem?.Name);
            setFieldValue('payeeId', selectedItem?.ID);
          };

          const getPayeeOptions = (type) => {
            switch (type) {
              case 'Employee':
                return employeeOptions; // must be an array of { label, value }
              case 'Vendor':
                return vendorOptions;
              case 'Individual':
                return individualOptions;
              // Add more as needed
              default:
                return [];
            }
          };

          const getRequestOptions = (type) => {
            switch (type) {
              case 'Obligation Request':
                return employeeOptions; // must be an array of { label, value }
              case 'FURS':
                return vendorOptions;
              default:
                return [];
            }
          };
          // Add handler for mode of payment change
          const handleModeOfPaymentChange = (e) => {
            setSelectedModeOfPayment(e.target.value);
            handleChange(e); // Update formik value

            // Clear bank and check number when switching to Cash
            if (e.target.value === 'Cash') {
              setFieldValue('bank', '');
              setFieldValue('checkNumber', '');
            }
          };
          console.log('values', errors);
          return (
            <Form className="space-y-8">
              {/* Payee Type Selection */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payee Information
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Payee Type Buttons */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payee Type <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {payeeTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handlePayeeTypeChange(type.value)}
                          className={`w-full flex items-center px-4 py-3 text-left border rounded-lg transition-all duration-200 ${
                            values.payeeType === type.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400 text-gray-700'
                          }`}
                        >
                          <PayeeTypeIcon type={type.value} />
                          <span className="ml-3 font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                    {errors.payeeType && touched.payeeType && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.payeeType}
                      </p>
                    )}
                  </div>

                  {/* Payee List */}
                  {values.payeeType && (
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select {selectedPayeeType?.label}{' '}
                        <span className="text-red-500">*</span>
                      </label>

                      <Select
                        options={getPayeeOptions(values.payeeType)}
                        onChange={(option) => handlePayeeSelect(option.value)}
                        value={
                          getPayeeOptions(values.payeeType).find(
                            (p) => p.value === values.payeeId
                          ) || null
                        }
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                      {errors.payeeType && touched.payeeType && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.payeeType}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Payee Details */}
                  {selectedPayee && (
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-600">
                                Payee:
                              </div>
                              <div className="text-sm text-gray-900">
                                {selectedPayeeType?.label === 'Employee'
                                  ? `${selectedPayee.FirstName || ''} ${
                                      selectedPayee.MiddleName || ''
                                    } ${selectedPayee.LastName || ''}`.trim()
                                  : selectedPayeeType?.label === 'Vendor'
                                  ? selectedPayee.Name
                                  : selectedPayeeType?.label === 'Individual'
                                  ? selectedPayee.Name
                                  : selectedPayee.Name}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600">
                                Address:
                              </div>
                              <div className="text-sm text-gray-900">
                                {selectedPayeeType?.label === 'Employee'
                                  ? selectedPayee.StreetAddress
                                  : selectedPayeeType?.label === 'Vendor'
                                  ? selectedPayee.StreetAddress
                                  : selectedPayeeType?.label === 'Individual'
                                  ? selectedPayee.StreetAddress
                                  : selectedPayee.StreetAddress}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <hr />
              {/* Payee Type Selection */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Request for Payment
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Payee Type Buttons */}
                  <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Type <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {requestTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleRequestTypeChange(type.value)}
                          className={`w-full flex items-center px-4 py-3 text-left border rounded-lg transition-all duration-200 ${
                            values.requestType === type.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400 text-gray-700'
                          }`}
                        >
                          <span className="ml-3 font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                    {errors.requestType && touched.requestType && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.requestType}
                      </p>
                    )}
                  </div>

                  {/* Payee List */}
                  {values.requestType !== 'Standalone Request' && (
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Request <span className="text-red-500">*</span>
                      </label>

                      <Select
                        options={requestOptions.map((opt) => {
                          let fullName = '';

                          // Conditionally build fullName based on payeeType
                          if (values.payeeType === 'Employee') {
                            fullName = `${opt.Employee?.FirstName || ''} ${
                              opt.Employee?.MiddleName || ''
                            } ${opt.Employee?.LastName || ''}`.trim();
                          } else if (values.payeeType === 'Individual') {
                            if (
                              !opt.Employee?.FirstName &&
                              !opt.Employee?.MiddleName &&
                              !opt.Employee?.LastName
                            ) {
                              fullName = opt.Name || 'N/A';
                            } else {
                              fullName = `${opt.Employee?.FirstName || ''} ${
                                opt.Employee?.MiddleName || ''
                              } ${opt.Employee?.LastName || ''}`.trim();
                            }
                          } else if (values.payeeType === 'Vendor') {
                            fullName = opt.Name || 'N/A';
                          }

                          return {
                            value: opt.ID,
                            label: `${
                              opt.InvoiceNumber || ''
                            } – ${fullName} – ${opt.TIN || ''} – ${
                              opt.InvoiceDate
                            } – ${opt.sourceFunds?.Code || ''}`,
                            raw: opt,
                          };
                        })}
                        isLoading={requestOptionsLoading}
                        value={selectedRequest}
                        onChange={handleRequestSelect}
                        placeholder={
                          requestOptionsLoading
                            ? 'Loading…'
                            : requestOptionsError
                            ? `Error: ${requestOptionsError}`
                            : 'Select request'
                        }
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                      {errors.requestType && touched.requestType && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.requestType + 'request error'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* ── Accounting Entries ─────────────────────────────────────── */}
              <FieldArray name="accountingEntries">
                {({ push, remove }) => (
                  <>
                    {/* Show Add Item only if Standalone */}
                    {values.requestType === 'Standalone Request' && (
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">
                          Stand Alone Items
                        </h3>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setShowEntryModal(true)}
                        >
                          + Item
                        </button>
                      </div>
                    )}

                    {values.accountingEntries.length > 0 && (
                      <div className="space-y-4">
                        <hr />
                        {/* header row (hidden on mobile) */}
                        <div className="hidden md:grid grid-cols-7 gap-2 font-semibold text-sm">
                          <span>ITEM</span>
                          <span>AMOUNT</span>
                          <span>AMOUNT DUE</span>
                          <span>REMARKS</span>
                          {/* <span>FPP</span> */}
                          <span>ACCOUNT</span>
                          <span>ACCOUNT CODE</span>
                          {/* <span>FUND CODE</span> */}
                        </div>
                        {/* {console.log(values.accountingEntries)} */}
                        {/* data rows */}
                        {values.accountingEntries.map((entry, idx) => (
                          <div
                            key={idx}
                            className="border p-3 rounded text-sm flex flex-col gap-2 md:grid md:grid-cols-7 md:items-center md:gap-2"
                          >
                            {/* Mobile stacked view */}
                            <div className="flex flex-col gap-1 md:hidden">
                              <div className="flex justify-between">
                                <span className="font-semibold">ITEM:</span>
                                <span>{entry.itemName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold">AMOUNT:</span>
                                <span>
                                  {parseFloat(entry.subtotal).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold">
                                  AMOUNT DUE:
                                </span>
                                <span>
                                  {parseFloat(entry.subtotal).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold">REMARKS:</span>
                                <span>{entry.Remarks}</span>
                              </div>
                              {/* <div className="flex justify-between">
                                <span className="font-semibold">FPP:</span>
                                <span>{entry.FPP}</span>
                              </div> */}
                              <div className="flex justify-between">
                                <span className="font-semibold">ACCOUNT:</span>
                                <span>{entry.chargeAccountName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="font-semibold">
                                  ACCOUNT CODE:
                                </span>
                                <span>{entry.ChargeAccountID}</span>
                              </div>
                              {/* <div className="flex justify-between">
                                <span className="font-semibold">
                                  FUND CODE:
                                </span>
                                <span>{entry.fundCode}</span>
                              </div> */}
                            </div>

                            {/* Desktop table view */}
                            <span className="hidden md:block">
                              {entry.itemName}
                            </span>
                            <span className="hidden md:block">
                              {parseFloat(entry.subtotal).toFixed(2)}
                            </span>
                            <span className="hidden md:block">
                              {parseFloat(entry.subtotal).toFixed(2)}
                            </span>
                            <span className="hidden md:block">
                              {entry.Remarks}
                            </span>
                            <span className="hidden md:block">{entry.FPP}</span>
                            <span className="hidden md:block">
                              {entry.chargeAccountName}
                            </span>
                            <span className="hidden md:block">
                              {entry.ChargeAccountID}
                            </span>
                            {/* <span className="hidden md:block">
                              {entry.fundCode}
                            </span> */}

                            {/* remove button (bottom for mobile, right-aligned for desktop) */}
                            <div className="flex justify-end md:col-span-8">
                              <button
                                type="button"
                                onClick={() => remove(idx)}
                                className="text-red-600 hover:text-red-800 text-xs flex items-center gap-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* footer total */}
                        <div className="md:grid md:grid-cols-8 md:gap-2 font-semibold pt-2 border-t text-sm">
                          <div className="md:col-span-7 text-right">Total:</div>
                          <div className="text-right">
                            {values.accountingEntries
                              .reduce(
                                (sum, e) => sum + Number(e.subtotal || 0),
                                0
                              )
                              .toFixed(2)}
                          </div>
                        </div>

                        {/* amount in words */}
                        <div className="pt-2 border-t text-sm font-semibold text-right">
                          {convertAmountToWords(
                            values.accountingEntries
                              .reduce(
                                (sum, e) => sum + Number(e.subtotal || 0),
                                0
                              )
                              .toFixed(2)
                          )}
                        </div>
                      </div>
                    )}
                    {/* modal to add a line */}
                    <Modal
                      isOpen={showEntryModal}
                      onClose={() => setShowEntryModal(false)}
                      title="Add Accounting Entry"
                      size="xl"
                    >
                      <ObligationRequestAddItemForm
                        initialData={null}
                        responsibilityOptions={departmentOptions}
                        particularsOptions={particularsOptions}
                        unitOptions={unitOptions}
                        taxCodeOptions={taxCodeOptions}
                        budgetOptions={budgetOptions}
                        taxCodeFull={taxCodeFull}
                        onClose={() => setShowEntryModal(false)}
                        onSubmit={(entry) => {
                          push(entry);
                          setShowEntryModal(false);
                        }}
                      />
                    </Modal>
                  </>
                )}
              </FieldArray>
              {/* show validation error */}
              {errors.accountingEntries &&
                values.requestType !== 'Standalone Request' && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.accountingEntries}
                  </p>
                )}
              {/* ── Tax Summary (auto‑calculated) ───────────────────────────── */}
              {(() => {
                // Build a quick “hash → totals” on each render
                const summary = {};
                values.accountingEntries.forEach((entry) => {
                  console.log('entry', entry);
                  // You can change these keys to match the actual structure
                  const taxName = entry.TaxName || 'N/A';
                  const taxRate = entry.TaxRate || 0;
                  const withheld = Number(entry.withheld || 0);

                  const key = `${taxName}-${taxRate}`;
                  if (!summary[key]) {
                    summary[key] = { taxName, taxRate, withheld: 0 };
                  }
                  summary[key].withheld += withheld;
                });

                const taxRows = Object.values(summary);
                // console.log('taxRows', taxRows);
                return taxRows.length ? (
                  <div className="space-y-2">
                    <hr />
                    <h3 className="text-lg font-medium">Taxes</h3>

                    {/* header */}
                    <div className="grid grid-cols-3 gap-2 text-sm font-semibold">
                      <span>Tax Name</span>
                      <span className="text-right">Tax&nbsp;Rate&nbsp;%</span>
                      <span className="text-right">Total&nbsp;Withheld</span>
                    </div>

                    {/* rows */}
                    {taxRows.map(({ taxName, taxRate, withheld }, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-3 gap-2 text-sm border p-2 rounded"
                      >
                        <span>{taxName}</span>
                        <span className="text-right">
                          {parseFloat(taxRate).toFixed(2)}
                        </span>
                        <span className="text-right">
                          {withheld.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null;
              })()}
              <hr />

              {/* ── Payment Details ─────────────────────────────────────────────── */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Details</h3>

                {/* Contra Accounts Section */}
                <FieldArray name="contraAccounts">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">
                          Contra Accounts{' '}
                          <span className="text-red-500">*</span>
                        </label>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            push({
                              code: '',
                              account: '',
                              amount: '',
                              normalBalance: '',
                            })
                          }
                        >
                          <PlusIcon className="w-4 h-4 mr-1" />
                          Add Contra Account
                        </button>
                      </div>

                      {values.contraAccounts?.length > 0 && (
                        <div className="space-y-3">
                          {/* Header row (hidden on mobile) */}
                          <div className="hidden md:grid grid-cols-4 gap-2 font-semibold text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            <span>Account</span>
                            <span>Normal Balance</span>
                            <span>Amount</span>
                            <span>Actions</span>
                          </div>

                          {/* Contra account rows */}
                          {values.contraAccounts.map((contraAccount, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-3 space-y-3 md:space-y-0 md:grid md:grid-cols-4 md:gap-2 md:items-center"
                            >
                              {/* Mobile labels + Desktop grid */}

                              {/* Account Selection */}
                              <div className="space-y-1">
                                <label className="block text-xs font-medium text-gray-600 md:hidden">
                                  Account
                                </label>
                                <Select
                                  name={`contraAccounts[${index}].account`}
                                  options={chartOfAccountsOptions}
                                  onChange={(opt) => {
                                    setFieldValue(
                                      `contraAccounts[${index}].account`,
                                      opt?.value || ''
                                    );
                                    setFieldValue(
                                      `contraAccounts[${index}].code`,
                                      opt?.code || ''
                                    );
                                  }}
                                  value={
                                    chartOfAccountsOptions.find(
                                      (option) =>
                                        option.value === contraAccount.account
                                    ) || null
                                  }
                                  className="basic-single"
                                  classNamePrefix="select"
                                  placeholder="Select account..."
                                />
                                <ErrorMessage
                                  name={`contraAccounts[${index}].account`}
                                  component="p"
                                  className="text-xs text-red-600 mt-1"
                                />
                              </div>

                              {/* Normal Balance */}
                              <div className="space-y-1">
                                <label className="block text-xs font-medium text-gray-600 md:hidden">
                                  Normal Balance
                                </label>
                                <select
                                  name={`contraAccounts[${index}].normalBalance`}
                                  value={contraAccount.normalBalance}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Select balance type</option>
                                  <option value="Debit">Debit</option>
                                  <option value="Credit">Credit</option>
                                </select>
                                <ErrorMessage
                                  name={`contraAccounts[${index}].normalBalance`}
                                  component="p"
                                  className="text-xs text-red-600 mt-1"
                                />
                              </div>

                              {/* Amount */}
                              <div className="space-y-1">
                                <label className="block text-xs font-medium text-gray-600 md:hidden">
                                  Amount
                                </label>
                                <input
                                  type="number"
                                  name={`contraAccounts[${index}].amount`}
                                  value={contraAccount.amount}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  placeholder="0.00"
                                  step="0.01"
                                  min="0"
                                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <ErrorMessage
                                  name={`contraAccounts[${index}].amount`}
                                  component="p"
                                  className="text-xs text-red-600 mt-1"
                                />
                              </div>

                              {/* Actions */}
                              <div className="flex justify-end md:justify-center">
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-red-600 cursor-pointer hover:text-red-900 p-1 rounded"
                                  disabled={values.contraAccounts.length === 1}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Total */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center font-semibold">
                              <span>Total Contra Accounts:</span>
                              <span>
                                {values.contraAccounts
                                  .reduce(
                                    (sum, account) =>
                                      sum + Number(account.amount || 0),
                                    0
                                  )
                                  .toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Validation error for contra accounts */}
                      {errors.contraAccounts && touched.contraAccounts && (
                        <p className="text-sm text-red-600">
                          {typeof errors.contraAccounts === 'string'
                            ? errors.contraAccounts
                            : 'Please check contra account entries'}
                        </p>
                      )}
                    </div>
                  )}
                </FieldArray>

                {/* Row 1 - Mode of Payment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mode of Payment */}
                  <div>
                    <FormField
                      type="select"
                      label="Mode of Payment"
                      name="modeOfPayment"
                      options={[
                        { value: 'Cash', label: 'Cash' },
                        { value: 'Check', label: 'Check' },
                        { value: 'Others', label: 'Others' },
                      ]}
                      value={values.modeOfPayment}
                      onChange={handleModeOfPaymentChange}
                      onBlur={handleBlur}
                      error={errors.modeOfPayment}
                      touched={touched.modeOfPayment}
                      required
                    />
                  </div>
                </div>

                {/* Row 2 - Conditional fields based on payment mode */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Bank */}
                  {selectedModeOfPayment === 'Check' && (
                    <>
                      {/* Bank */}
                      <FormField
                        type="text"
                        label="Bank"
                        name="bank"
                        value={values.bank}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.bank}
                        touched={touched.bank}
                        required={selectedModeOfPayment === 'Check'}
                      />

                      {/* Check Number */}
                      <FormField
                        type="text"
                        label="Check No."
                        name="checkNumber"
                        value={values.checkNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.checkNumber}
                        touched={touched.checkNumber}
                        required={selectedModeOfPayment === 'Check'}
                      />
                    </>
                  )}

                  <FormField
                    type="text"
                    label="Received Payment By"
                    name="receivedPaymentBy"
                    value={values.receivedPaymentBy}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.receivedPaymentBy}
                    touched={touched.receivedPaymentBy}
                    required
                  />

                  {/* <FormField
                    type="text"
                    label="Amount"
                    name="Amount"
                    value={values.Amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.Amount}
                    touched={touched.Amount}
                    required
                  /> */}
                </div>
              </div>
              <hr />
              <FieldArray
                name="Attachments"
                render={({ remove, push }) => (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Attachments</h3>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => push({ File: null })}
                      >
                        + Attachment
                      </button>
                    </div>

                    {values.Attachments?.map((att, index) => (
                      <div key={index} className="flex items-center gap-4 mb-2">
                        {att.ID ? (
                          <div className="flex-1">
                            <a
                              href={`${API_URL}/uploads/${att.DataImage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {att.DataName}
                            </a>
                            <input
                              type="hidden"
                              name={`Attachments[${index}].ID`}
                              value={att.ID}
                            />
                          </div>
                        ) : (
                          <div className="flex-1 min-w-[300px]">
                            <label className="block text-sm font-medium mb-1">{`File ${
                              index + 1
                            }`}</label>
                            <input
                              type="file"
                              name={`Attachments[${index}].File`}
                              accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                              onChange={(e) =>
                                setFieldValue(
                                  `Attachments[${index}].File`,
                                  e.currentTarget.files[0]
                                )
                              }
                              onBlur={handleBlur}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                          </div>
                        )}

                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          className="bg-red-600 hover:bg-red-700 text-white p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              />
              <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default DisbursementVoucherForm;
// {/* ── Payment Details ─────────────────────────────────────────────── */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-medium">Payment Details</h3>

//                 {/* Row 1 */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Contra Account (React Select) */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Contra Account
//                     </label>
//                     <Select
//                       name="contraAccount"
//                       options={chartOfAccountsOptions} // or use a proper contra account options array
//                       onChange={(opt) =>
//                         setFieldValue('contraAccount', opt?.value)
//                       }
//                       value={
//                         chartOfAccountsOptions.find(
//                           (p) => p.value === values.contraAccount
//                         ) || null
//                       }
//                       className="basic-single"
//                       classNamePrefix="select"
//                     />
//                     {errors.contraAccount && touched.contraAccount && (
//                       <p className="mt-1 text-sm text-red-600">
//                         {errors.contraAccount}
//                       </p>
//                     )}
//                   </div>

//                   {/* Mode of Payment */}
//                   <div>
//                     <FormField
//                       type="select"
//                       label="Mode of Payment"
//                       name="modeOfPayment"
//                       options={[
//                         { value: 'Cash', label: 'Cash' },
//                         { value: 'Check', label: 'Check' },
//                         { value: 'Others', label: 'Others' },
//                       ]}
//                       value={values.modeOfPayment}
//                       onChange={handleModeOfPaymentChange}
//                       onBlur={handleBlur}
//                       error={errors.modeOfPayment}
//                       touched={touched.modeOfPayment}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Row 2 */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {/* Bank */}
//                   {selectedModeOfPayment === 'Check' && (
//                     <>
//                       {/* Bank */}

//                       <FormField
//                         type="text"
//                         label="Bank"
//                         name="bank"
//                         value={values.bank}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={errors.bank}
//                         touched={touched.bank}
//                         required={selectedModeOfPayment === 'Check'}
//                       />

//                       {/* Check Number */}

//                       <FormField
//                         type="text"
//                         label="Check No."
//                         name="checkNumber"
//                         value={values.checkNumber}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         error={errors.checkNumber}
//                         touched={touched.checkNumber}
//                         required={selectedModeOfPayment === 'Check'}
//                       />
//                     </>
//                   )}

//                   <FormField
//                     type="text"
//                     label="Received Payment By"
//                     name="receivedPaymentBy"
//                     value={values.receivedPaymentBy}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     error={errors.receivedPaymentBy}
//                     touched={touched.receivedPaymentBy}
//                     required
//                   />
//                   <FormField
//                     type="text"
//                     label="Amount"
//                     name="Amount"
//                     value={values.Amount}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     error={errors.Amount}
//                     touched={touched.Amount}
//                     required
//                   />
//                 </div>
//               </div>
