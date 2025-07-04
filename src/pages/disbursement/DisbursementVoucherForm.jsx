import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import {
  BuildingOfficeIcon,
  DocumentCheckIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  createDisbursementVoucher,
  updateDisbursementVoucher,
} from '../../features/disbursement/disbursementVoucherSlice';
import { ChevronDownIcon, UserIcon, UsersIcon } from 'lucide-react';

// Mock data for request for payment
const requestForPaymentData = {
  Salary: [
    {
      id: 'SAL001',
      name: 'Monthly Salary Payment - March 2025',
      items: [
        {
          item: 'Basic Salary',
          remarks: 'March 2025',
          fpp: 'FPP-2025-007',
          amount: 450000.0,
          amountDue: 450000.0,
          account: 'Salaries',
          accountCode: '1.02-05-994',
          fundCode: 'GF-004',
        },
        {
          item: '13th Month Pay',
          remarks: 'Prorated amount',
          fpp: 'FPP-2025-008',
          amount: 75000.0,
          amountDue: 75000.0,
          account: 'Salaries',
          accountCode: '1.02-05-994',
          fundCode: 'GF-004',
        },
      ],
    },
  ],
  Travel: [
    {
      id: 'TRV001',
      name: 'Travel Expenses Reimbursement',
      items: [
        {
          item: 'Transportation Allowance',
          remarks: 'Manila to Cebu',
          fpp: 'FPP-2025-003',
          amount: 8500.0,
          amountDue: 8500.0,
          account: 'Travel Expenses',
          accountCode: '1.02-05-991',
          fundCode: 'GF-002',
        },
        {
          item: 'Accommodation',
          remarks: '3 days hotel stay',
          fpp: 'FPP-2025-004',
          amount: 12000.0,
          amountDue: 12000.0,
          account: 'Travel Expenses',
          accountCode: '1.02-05-991',
          fundCode: 'GF-002',
        },
      ],
    },
  ],
  Supplies: [
    {
      id: 'SUP001',
      name: 'Office Supplies Purchase - Q1 2025',
      items: [
        {
          item: 'Bond Paper A4 - 500 sheets',
          remarks: 'White, 80gsm',
          fpp: 'FPP-2025-001',
          amount: 2500.0,
          amountDue: 2500.0,
          account: 'Office Supplies',
          accountCode: '1.02-05-992',
          fundCode: 'GF-001',
        },
        {
          item: 'Ballpoint Pens - Blue',
          remarks: '1 box (50 pcs)',
          fpp: 'FPP-2025-002',
          amount: 750.0,
          amountDue: 750.0,
          account: 'Office Supplies',
          accountCode: '1.02-05-992',
          fundCode: 'GF-001',
        },
      ],
    },
  ],
  Maintenance: [
    {
      id: 'MNT001',
      name: 'Equipment Maintenance - Quarterly',
      items: [
        {
          item: 'Air Conditioning Unit Servicing',
          remarks: '4 units, quarterly maintenance',
          fpp: 'FPP-2025-005',
          amount: 15000.0,
          amountDue: 15000.0,
          account: 'Maintenance',
          accountCode: '1.02-05-993',
          fundCode: 'GF-003',
        },
        {
          item: 'Generator Maintenance',
          remarks: 'Annual servicing',
          fpp: 'FPP-2025-006',
          amount: 25000.0,
          amountDue: 25000.0,
          account: 'Maintenance',
          accountCode: '1.02-05-993',
          fundCode: 'GF-003',
        },
      ],
    },
  ],
};

const payeeTypes = [
  { value: 'Employee', label: 'Employee' },
  { value: 'Vendor', label: 'Vendor' },
  { value: 'Individual', label: 'Individual' },
];

const paymentRequests = [
  { value: 'Salary', label: 'Obligation Request' },
  { value: 'Travel', label: 'FURS' },
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
const contraAccountCodes = [
  // ASSETS (1000000)
  // Current Assets - Cash and Cash Equivalents
  {
    code: '1010101',
    account: 'Cash - General Fund',
    normalBalance: 'Debit',
    category: 'Assets',
  },
  {
    code: '1010102',
    account: 'Cash - Special Education Fund',
    normalBalance: 'Debit',
    category: 'Assets',
  },
  {
    code: '1010103',
    account: 'Cash - Local Development Fund',
    normalBalance: 'Debit',
    category: 'Assets',
  },
  {
    code: '1010201',
    account: 'Petty Cash Fund',
    normalBalance: 'Debit',
    category: 'Assets',
  },
  {
    code: '1010301',
    account: 'Cash in Bank - Current Account',
    normalBalance: 'Debit',
    category: 'Assets',
  },
  {
    code: '1010302',
    account: 'Cash in Bank - Savings Account',
    normalBalance: 'Debit',
    category: 'Assets',
  },

  // Receivables
  {
    code: '1020101',
    account: 'Accounts Receivable',
    normalBalance: 'Debit',
    category: 'Assets',
  },
  {
    code: '1020201',
    account: 'Due from National Government',
    normalBalance: 'Debit',
    category: 'Assets',
  },
  {
    code: '1020301',
    account: 'Advances to Officers and Employees',
    normalBalance: 'Debit',
    category: 'Assets',
  },
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
  contraAccounts: Yup.array()
    .of(
      Yup.object().shape({
        code: Yup.string().required('Account code is required'),
        account: Yup.string().required('Account name is required'),
        amount: Yup.number()
          .required('Amount is required')
          .min(0, 'Amount must be greater than 0'),
        normalBalance: Yup.string().required('Normal balance is required'),
      })
    )
    .min(1, 'At least one contra account is required'),
});

function DisbursementVoucherForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employees);
  const { customers } = useSelector((state) => state.customers);
  const { vendorDetails } = useSelector((state) => state.vendorDetails);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

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
    responsibilityCenter:
      initialData?.responsibilityCenter || 'Treasury Office',
    requestForPayment: initialData?.requestForPayment || '',
    modeOfPayment: initialData?.modeOfPayment || '',
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

  const PayeeTypeIcon = ({ type }) => {
    switch (type) {
      case 'Employee':
        return <UsersIcon className="w-5 h-5" />;
      case 'Supplier':
        return <BuildingOfficeIcon className="w-5 h-5" />;
      case 'Contractor':
        return <BuildingOfficeIcon className="w-5 h-5" />;
      case 'Government':
        return <UserIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };
  // console.log({ selectedPayee });
  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-6 bg-white">
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

          const handlePayeeTypeChange = (type) => {
            setSelectedPayee(null);
            setFieldValue('payeeType', type);
            setFieldValue('payeeName', '');
            setFieldValue('payeeId', '');
            setFieldValue('payeeAddress', '');
            setFieldValue('officeUnitProject', '');
            setFieldValue('orsNumber', '');
          };

          const handlePayeeSelect = (payee) => {
            // setSelectedPayee(payee);
            // setFieldValue('payeeName', payee.name);
            // setFieldValue('payeeId', payee.tin);
            // setFieldValue('payeeAddress', payee.address);
            // setFieldValue('officeUnitProject', payee.officeUnitProject);
            // setFieldValue('orsNumber', payee.obligationRequestNo);
            // setFieldValue('responsibilityCenter', payee.responsibilityCenter);

            let selectedItem = null;
            switch (values.payeeType) {
              case 'Employee':
                selectedItem = employees.find((item) => item.ID === payee);
                break;
              case 'Vendor':
                selectedItem = vendorDetails.find((item) => item.ID === payee);
                break;
              case 'Individual':
                selectedItem = customers.find((item) => item.ID === payee);
                break;
              default:
                break;
            }
            setSelectedPayee(selectedItem);
            setFieldValue('payeeName', selectedItem?.Name);
            setFieldValue('payeeId', selectedItem?.ID);
          };

          const handleRequestTypeChange = (type) => {
            setSelectedRequest(null);
            setFieldValue('requestForPayment', type);
            setFieldValue('items', [defaultItem]);
          };

          const handleRequestSelect = (request) => {
            setSelectedRequest(request);
            const requestItems = request.items.map((item) => ({
              description: item.item,
              amount: item.amount,
              accountCode: item.accountCode,
              remarks: item.remarks,
              fpp: item.fpp,
              amountDue: item.amountDue,
              account: item.account,
              fundCode: item.fundCode,
            }));
            setFieldValue('items', requestItems);
          };

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
                const selectedTax = taxTypes.find(
                  (t) => t.value === tax.taxType
                );
                if (selectedTax) {
                  const newGrossAmount = values.items.reduce((sum, item, i) => {
                    const amount =
                      i === index
                        ? Number(value || 0)
                        : Number(item.amount || 0);
                    return sum + amount;
                  }, 0);
                  setFieldValue(
                    `taxes.${taxIndex}.amount`,
                    (newGrossAmount * selectedTax.rate).toFixed(2)
                  );
                }
              }
            });
          };
          const handleContraAccountAmountChange = (index, value) => {
            setFieldValue(`contraAccounts.${index}.amount`, value);
            // Recalculate tax amounts when contra account amounts change
            values.taxes.forEach((tax, taxIndex) => {
              if (tax.taxType) {
                const selectedTax = taxTypes.find(
                  (t) => t.value === tax.taxType
                );
                if (selectedTax) {
                  const newGrossAmount = values.contraAccounts.reduce(
                    (sum, account, i) => {
                      const amount =
                        i === index
                          ? Number(value || 0)
                          : Number(account.amount || 0);
                      return sum + amount;
                    },
                    0
                  );
                  setFieldValue(
                    `taxes.${taxIndex}.amount`,
                    (newGrossAmount * selectedTax.rate).toFixed(2)
                  );
                }
              }
            });
          };
          const getPayeeOptions = (type) => {
            // console.log({ type, vendorDetails, customers });
            switch (type) {
              case 'Employee':
                return employees?.map((emp) => ({
                  label:
                    emp.FirstName + ' ' + emp.MiddleName + ' ' + emp.LastName,
                  value: emp.ID,
                })); // must be an array of { label, value }
              case 'Vendor':
                return vendorDetails?.map((vendor) => ({
                  label: vendor.Name,
                  value: vendor.ID,
                }));
              case 'Individual':
                return customers?.map((customer) => ({
                  label:
                    customer.FirstName +
                    ' ' +
                    customer.MiddleName +
                    ' ' +
                    customer.LastName,
                  value: customer.ID,
                }));
              // Add more as needed
              default:
                return [];
            }
          };
          // console.log(payeeTypes[values.payeeType]);
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

                  {/* Payee Select */}
                  {values.payeeType && (
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select {values.payeeType}{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <Select
                        options={getPayeeOptions(values.payeeType)}
                        value={getPayeeOptions(values.payeeType).find(
                          (option) => option.value === values.payeeType
                        )}
                        onChange={(option) => handlePayeeSelect(option.value)}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder={`Select ${values.payeeType}`}
                        // isLoading={!payeeTypes[values.payeeType]}
                        // isDisabled={!payeeTypes[values.payeeType]}
                      />
                      {errors.payeeId && touched.payeeId && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.payeeId}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Payee Details */}
                  {selectedPayee && (
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Request for Payment
                          </h3>
                          <h4 className="text-md font-medium text-gray-700">
                            Disbursement Voucher
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">
                                Payee:
                              </span>
                              <span className="text-sm text-gray-900 text-right">
                                {selectedPayee.Name ||
                                  `${selectedPayee.FirstName || ''} ${
                                    selectedPayee.LastName || ''
                                  }`.trim()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">
                                Address:
                              </span>
                              <span className="text-sm text-gray-900 text-right max-w-xs">
                                {selectedPayee.Address ||
                                  selectedPayee.StreetAddress}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-gray-600">
                                TIN/EMPLOYEE No.:
                              </span>
                              <span className="text-sm text-gray-900">
                                {selectedPayee.TIN ||
                                  selectedPayee.EmployeeNumber}
                              </span>
                            </div>
                            {selectedPayee.Office && (
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                  Office/Unit/Project:
                                </span>
                                <span className="text-sm text-gray-900 text-right">
                                  {selectedPayee.Office}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="border-t border-gray-300 pt-3 mt-3">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                  DV NO:
                                </span>
                                <span className="text-sm text-gray-900">
                                  {values.dvNumber || '-'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                  DATE:
                                </span>
                                <span className="text-sm text-gray-900">
                                  {values.dvDate
                                    ? new Date(
                                        values.dvDate
                                      ).toLocaleDateString('en-GB')
                                    : '-'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                  PAYMENT:
                                </span>
                                <span className="text-sm text-gray-900">
                                  {values.paymentDate
                                    ? new Date(
                                        values.paymentDate
                                      ).toLocaleDateString('en-GB')
                                    : '-'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Request for Payment Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Request for Payment
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Request Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Type <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {paymentRequests.map((request) => (
                        <button
                          key={request.value}
                          type="button"
                          onClick={() => handleRequestTypeChange(request.value)}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left border rounded-lg transition-all duration-200 ${
                            values.requestForPayment === request.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400 text-gray-700'
                          }`}
                        >
                          <span className="font-medium">{request.label}</span>
                          <ChevronDownIcon className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                    {errors.requestForPayment && touched.requestForPayment && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.requestForPayment}
                      </p>
                    )}
                  </div>

                  {/* Request List */}
                  {values.requestForPayment &&
                    requestForPaymentData[values.requestForPayment] && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select {values.requestForPayment}
                        </label>
                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                          {requestForPaymentData[values.requestForPayment].map(
                            (request) => (
                              <button
                                key={request.id}
                                type="button"
                                onClick={() => handleRequestSelect(request)}
                                className={`w-full text-left px-4 py-3 border-b border-gray-200 last:border-b-0 transition-colors duration-200 ${
                                  selectedRequest?.id === request.id
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <div className="font-medium">
                                  {request.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {request.id}
                                </div>
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Request Details Table */}
                {selectedRequest && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Request Details
                    </h3>
                    <div className="overflow-x-auto border border-gray-300 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Remarks
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              FPP
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount Due
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Account
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Account Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fund Code
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedRequest.items.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item.item}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.remarks}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.fpp}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₱
                                {item.amount.toLocaleString('en-PH', {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₱
                                {item.amountDue.toLocaleString('en-PH', {
                                  minimumFractionDigits: 2,
                                })}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.account}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.accountCode}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.fundCode}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Items Section */}
              {/* <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Items</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue('items', [
                        ...values.items,
                        { ...defaultItem },
                      ])
                    }
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Item
                  </button>
                </div>

                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {values.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Field
                              name={`items.${index}.description`}
                              as="textarea"
                              rows="2"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Enter item description"
                            />
                            <ErrorMessage
                              name={`items.${index}.description`}
                              component="p"
                              className="mt-1 text-sm text-red-600"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Field
                              name={`items.${index}.amount`}
                              type="number"
                              step="0.01"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="0.00"
                              onChange={(e) =>
                                handleItemAmountChange(index, e.target.value)
                              }
                            />
                            <ErrorMessage
                              name={`items.${index}.amount`}
                              component="p"
                              className="mt-1 text-sm text-red-600"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Field
                              name={`items.${index}.accountCode`}
                              type="text"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="Account code"
                            />
                            <ErrorMessage
                              name={`items.${index}.accountCode`}
                              component="p"
                              className="mt-1 text-sm text-red-600"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {values.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = values.items.filter(
                                    (_, i) => i !== index
                                  );
                                  setFieldValue('items', newItems);
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div> */}
              {/* Contra Account Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Contra Account
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue('contraAccounts', [
                        ...values.contraAccounts,
                        {
                          code: '',
                          account: '',
                          amount: '',
                          normalBalance: '',
                        },
                      ])
                    }
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Contra Account
                  </button>
                </div>

                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Account
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Normal Balance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {values.contraAccounts.map((contraAccount, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Field
                              name={`contraAccounts.${index}.code`}
                              as="select"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              onChange={(e) => {
                                const selectedAccount = contraAccountCodes.find(
                                  (acc) => acc.code === e.target.value
                                );
                                if (selectedAccount) {
                                  setFieldValue(
                                    `contraAccounts.${index}.code`,
                                    selectedAccount.code
                                  );
                                  setFieldValue(
                                    `contraAccounts.${index}.account`,
                                    selectedAccount.account
                                  );
                                  setFieldValue(
                                    `contraAccounts.${index}.normalBalance`,
                                    selectedAccount.normalBalance
                                  );
                                }
                              }}
                            >
                              <option value="">Select Account Code</option>
                              {contraAccountCodes.map((account) => (
                                <option key={account.code} value={account.code}>
                                  {account.code} - {account.account}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name={`contraAccounts.${index}.code`}
                              component="p"
                              className="mt-1 text-sm text-red-600"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {contraAccount.account}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Field
                              name={`contraAccounts.${index}.amount`}
                              type="number"
                              step="0.01"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              placeholder="0.00"
                            />
                            <ErrorMessage
                              name={`contraAccounts.${index}.amount`}
                              component="p"
                              className="mt-1 text-sm text-red-600"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {contraAccount.normalBalance}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {values.contraAccounts.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newContraAccounts =
                                    values.contraAccounts.filter(
                                      (_, i) => i !== index
                                    );
                                  setFieldValue(
                                    'contraAccounts',
                                    newContraAccounts
                                  );
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Taxes Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Taxes</h2>
                  <button
                    type="button"
                    onClick={() =>
                      setFieldValue('taxes', [
                        ...values.taxes,
                        { taxType: '', rate: 0, amount: '0.00' },
                      ])
                    }
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Tax
                  </button>
                </div>

                <div className="overflow-x-auto border border-gray-300 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tax Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rate (%)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {values.taxes.map((tax, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Field
                              name={`taxes.${index}.taxType`}
                              as="select"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              onChange={(e) =>
                                handleTaxTypeChange(index, e.target.value)
                              }
                            >
                              <option value="">Select tax type</option>
                              {taxTypes.map((taxType) => (
                                <option
                                  key={taxType.value}
                                  value={taxType.value}
                                >
                                  {taxType.label}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage
                              name={`taxes.${index}.taxType`}
                              component="p"
                              className="mt-1 text-sm text-red-600"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Field
                              name={`taxes.${index}.rate`}
                              type="number"
                              step="0.01"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100"
                              readOnly
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Field
                              name={`taxes.${index}.amount`}
                              type="number"
                              step="0.01"
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100"
                              readOnly
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => {
                                const newTaxes = values.taxes.filter(
                                  (_, i) => i !== index
                                );
                                setFieldValue('taxes', newTaxes);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="dvDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    DV Date <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="dvDate"
                    type="date"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="dvDate"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="paymentDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="paymentDate"
                    type="date"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <ErrorMessage
                    name="paymentDate"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="modeOfPayment"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mode of Payment <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="modeOfPayment"
                    as="select"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select mode of payment</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </Field>
                  <ErrorMessage
                    name="modeOfPayment"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="particulars"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Particulars
                  </label>
                  <Field
                    name="particulars"
                    as="textarea"
                    rows="3"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter particulars"
                  />
                  <ErrorMessage
                    name="particulars"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Gross Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₱
                      {grossAmount.toLocaleString('en-PH', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Total Taxes
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      ₱
                      {totalTaxes.toLocaleString('en-PH', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600">
                      Net Amount
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      ₱
                      {netAmount.toLocaleString('en-PH', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!isValid}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <DocumentCheckIcon className="w-5 h-5 mr-2" />
                  Create Disbursement Voucher
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
