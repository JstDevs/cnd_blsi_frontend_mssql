import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import FormField from '../../components/common/FormField';
import FundUtilizationAddItemForm from './FundUtilizationAddItemForm';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { Trash2, XCircleIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  BuildingOfficeIcon,
  DocumentCheckIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  createFundUtilization,
  fetchFundUtilizations,
  updateFundUtilization,
} from '../../features/disbursement/fundUtilizationSlice';
import { ChevronDownIcon, UserIcon, UsersIcon } from 'lucide-react';
import { current } from '@reduxjs/toolkit';
const API_URL = import.meta.env.VITE_API_URL;
const payeeTypes = [
  { value: 'Employee', label: 'Employee' },
  { value: 'Vendor', label: 'Vendor' },
  { value: 'Individual', label: 'Individual' },
];

// Validation schema
const disbursementVoucherSchema = Yup.object().shape({
  obrNo: Yup.string().required('No. is required'),
  obrDate: Yup.date().required('Date is required'),
  payeeType: Yup.string().required('Payee type is required'),
  payeeId: Yup.string().required('Payee selection is required'),
  fund: Yup.string().required('Fund is required'),
  fiscalYear: Yup.string().required('Fiscal Year is required'),
  project: Yup.string().required('Project is required'),
  accountingEntries: Yup.array().min(1, 'At least one item is required'),
});

function FundUtilizationForm({
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
}) {
  const dispatch = useDispatch();
  const formikRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [showEntryModal, setShowEntryModal] = useState(false);
  const [accountingEntries, setAccountingEntries] = useState([]);
  const handleAddEntry = (entry) => {
    setAccountingEntries([...accountingEntries, entry]);
  };

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
    payeeType: initialData?.payeeType || '',
    payeeName: initialData?.payeeName || '',
    payeeId: initialData?.payeeId || '',
    payeeAddress: initialData?.payeeAddress || '',
    officeUnitProject: initialData?.officeUnitProject || '',
    orsNumber: initialData?.orsNumber || '',
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
    accountingEntries: Array.isArray(initialData?.accountingEntries)
      ? initialData.accountingEntries
      : [],
    Attachments: Array.isArray(initialData?.Attachments)
      ? initialData.Attachments
      : [],
  };

  // const handleAddSubmit = (entry) => {
  //   console.log('Adding entry:', entry);
  //   if (!formikRef.current) return;

  //   const { values, setFieldValue } = formikRef.current;
  //   const updated = [...values.accountingEntries, entry];

  //   setFieldValue('accountingEntries', updated);
  //   setShowEntryModal(false);
  // };

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

    const action = initialData
      ? updateFundUtilization({ formData: fd, id: initialData.ID })
      : createFundUtilization(fd);

    if (initialData) {
      fd.append('IsNew', false);
      fd.append('LinkID', initialData.LinkID);
    } else {
      fd.append('IsNew', true);
    }

    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success('Success');
        dispatch(fetchFundUtilizations());
        onClose();
      })
      .catch((error) => {
        toast.error(error?.message || 'Failed to submit');
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
      case 'Vendor':
        return <BuildingOfficeIcon className="w-5 h-5" />;
      case 'Individual':
        return <UserIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto p-2 sm:p-6 bg-white">
        <Formik
          innerRef={formikRef}
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
                  selectedItem = individualData.find(
                    (item) => item.ID === payee
                  );
                  break;
                default:
                  break;
              }
              setSelectedPayee(selectedItem);
              // console.log('Selected Payee:', selectedItem);

              // setSelectedPayee(payee);
              setFieldValue('payeeName', selectedItem?.Name);
              setFieldValue('payeeId', selectedItem?.ID);
              // setFieldValue('payeeAddress', payee.address);
              // setFieldValue('officeUnitProject', payee.officeUnitProject);
              // setFieldValue('orsNumber', payee.obligationRequestNo);
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

            const handleItemAmountChange = (index, value) => {
              setFieldValue(`items.${index}.amount`, value);
              // Recalculate tax amounts when item amounts change
              values.taxes.forEach((tax, taxIndex) => {
                if (tax.taxType) {
                  const selectedTax = taxTypes.find(
                    (t) => t.value === tax.taxType
                  );
                  if (selectedTax) {
                    const newGrossAmount = values.items.reduce(
                      (sum, item, i) => {
                        const amount =
                          i === index
                            ? Number(value || 0)
                            : Number(item.amount || 0);
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
                            <span className="ml-3 font-medium">
                              {type.label}
                            </span>
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
                          value={
                            getPayeeOptions(values.payeeType).find(
                              (p) => p.value === values.payeeId
                            ) || null
                          }
                          onChange={(option) => handlePayeeSelect(option.value)}
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

                {/* ── New Row: OBR No. / OBR Date ─────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                  <FormField
                    type="text"
                    label="No."
                    name="obrNo"
                    value={values.obrNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.obrNo}
                    touched={touched.obrNo}
                    required
                  />

                  <FormField
                    type="date"
                    label="Date"
                    name="obrDate"
                    value={values.obrDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.obrDate}
                    touched={touched.obrDate}
                    required
                  />
                </div>

                <hr />

                {/* ── Row 1: Responsibility / Fund / Fiscal Year / Project ───────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                  {/* Fund */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fund <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={fundOptions}
                      value={
                        fundOptions.find((opt) => opt.value === values.fund) ||
                        null
                      }
                      onChange={(opt) => setFieldValue('fund', opt.value)}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                    {errors.fund && (
                      <p className="mt-1 text-sm text-red-600">{errors.fund}</p>
                    )}
                  </div>

                  {/* Fiscal Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fiscal Year <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={fiscalYearOptions}
                      value={
                        fiscalYearOptions.find(
                          (opt) => opt.value === values.fiscalYear
                        ) || null
                      }
                      onChange={(opt) => setFieldValue('fiscalYear', opt.value)}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                    {errors.fiscalYear && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fiscalYear}
                      </p>
                    )}
                  </div>

                  {/* Project */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={projectOptions}
                      value={
                        projectOptions.find(
                          (opt) => opt.value === values.project
                        ) || null
                      }
                      onChange={(opt) => setFieldValue('project', opt.value)}
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                    {errors.project && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.project}
                      </p>
                    )}
                  </div>
                </div>

                <FieldArray name="accountingEntries">
                  {({ push, remove }) => (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Items</h3>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setShowEntryModal(true)}
                        >
                          + Item
                        </button>
                      </div>

                      {values.accountingEntries.length > 0 && (
                        <div className="space-y-2">
                          <div className="grid grid-cols-6 gap-2 font-semibold text-sm">
                            <span>RC</span>
                            <span>REMARKS</span>
                            <span>ITEM</span>
                            {/* <span>FPP</span> */}
                            <span>ACCOUNT CODE</span>
                            <span className="text-right">SUB-TOTAL</span>
                          </div>
                          {values.accountingEntries.map((entry, idx) => (
                            <div
                              key={idx}
                              className="grid grid-cols-6 gap-2 text-sm items-center border p-2 rounded"
                            >
                              <span>{entry.responsibilityCenterName}</span>
                              <span>{entry.Remarks}</span>
                              <span>{entry.itemName}</span>
                              {/* <span>{entry.FPP}</span> */}
                              <span>{entry.chargeAccountName}</span>
                              <span className="text-right">
                                {parseFloat(entry.subtotal).toFixed(2)}
                              </span>
                              <div className="col-span-1 text-right">
                                <button
                                  type="button"
                                  onClick={() => remove(idx)}
                                  className="text-red-600 text-xs"
                                >
                                  <XCircleIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                          <div className="grid grid-cols-6 gap-2 font-semibold pt-2 border-t">
                            <div className="col-span-5 text-right">Total:</div>
                            <div className="text-right">
                              {values.accountingEntries
                                .reduce((sum, e) => sum + Number(e.subtotal), 0)
                                .toFixed(2)}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Modal inside FieldArray so `push` is available */}
                      <Modal
                        isOpen={showEntryModal}
                        onClose={() => setShowEntryModal(false)}
                        title={'Add Accounting Entry'}
                        size="xl"
                      >
                        <FundUtilizationAddItemForm
                          initialData={null}
                          responsibilityOptions={departmentOptions}
                          particularsOptions={particularsOptions}
                          unitOptions={unitOptions}
                          taxCodeOptions={taxCodeOptions}
                          budgetOptions={budgetOptions}
                          taxCodeFull={taxCodeFull}
                          onClose={() => setShowEntryModal(false)}
                          onSubmit={(entry) => {
                            // console.log('Adding entry:', entry);
                            push(entry);
                            setShowEntryModal(false);
                          }}
                        />
                      </Modal>
                    </>
                  )}
                </FieldArray>

                {errors.accountingEntries && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.accountingEntries}
                  </p>
                )}

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
                        <div
                          key={index}
                          className="flex items-center gap-4 mb-2"
                        >
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
                  <button type="button" className="btn btn-outline">
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
    </div>
  );
}

export default FundUtilizationForm;
