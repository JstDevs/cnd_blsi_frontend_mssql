import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import Modal from '@/components/common/Modal';
import FormField from '@/components/common/FormField';
import { convertAmountToWords } from '@/utils/amountToWords';
import { fetchVendorDetails } from '@/features/settings/vendorDetailsSlice';
import { fetchCustomers } from '@/features/settings/customersSlice';
import { useDispatch, useSelector } from 'react-redux';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import Customer from '@/pages/settings/Customer';
import { fetchFunds } from '@/features/budget/fundsSlice';
import {
  Cross,
  CrosshairIcon,
  CrossIcon,
  Paperclip,
  Trash2,
  XIcon,
} from 'lucide-react';
import { fetchItems } from '@/features/settings/itemSlice';
import { fetchBudgets } from '@/features/budget/budgetSlice';
const API_URL = import.meta.env.VITE_API_URL;
const generalServiceReceiptSchema = Yup.object().shape({
  Status: Yup.string().required('Status is required'),
  InvoiceNumber: Yup.string().required('Invoice number is required'),
  InvoiceDate: Yup.date().required('Date is required'),
  FundsID: Yup.number().required('Fund is required'),
  Agency: Yup.string().required('Agency is required'),
  PaymentMethodID: Yup.number().required('Payment method is required'),
  Total: Yup.number().required('Total amount is required'),
  CustomerID: Yup.number().required('Customer is required'),
  CustomerName: Yup.string().required('Customer name is required'),
  Remarks: Yup.string(),
  TransactionItemsAll: Yup.array()
    .of(
      Yup.object().shape({
        ItemID: Yup.number().required('Item ID is required'),
        ChargeAccountID: Yup.number().required('Charges account is required'),
        Quantity: Yup.number()
          .required('Quantity is required')
          .min(1, 'Quantity must be at least 1'),
        Price: Yup.number()
          .required('Price is required')
          .min(0, 'Price cannot be negative'),
        Vatable: Yup.boolean(),
        // TAXCodeID: Yup.number().required('Tax code is required'),
      })
    )
    .min(1, 'At least one item is required'),
});

function GeneralServiceReceiptModal({
  isOpen,
  onClose,
  selectedReceipt,
  onSubmit,
  Print,
}) {
  const [payorType, setPayorType] = useState('Individual');
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const { customers } = useSelector((state) => state.customers);
  const { vendorDetails } = useSelector((state) => state.vendorDetails);
  const { funds } = useSelector((state) => state.funds);
  const { items } = useSelector((state) => state.items);
  const { budgets } = useSelector((state) => state.budget);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchVendorDetails());
    dispatch(fetchFunds());
    dispatch(fetchItems());
    dispatch(fetchBudgets());
  }, [dispatch]);

  const vendorOptions = vendorDetails?.map((vendor) => ({
    value: vendor.ID,
    label: vendor.Name,
  }));
  const individualOptions = customers?.map((customer) => ({
    value: customer.ID,
    label: customer.Name,
  }));
  const fundsOptions = funds?.map((item) => ({
    value: item.ID,
    label: item.Name,
  }));

  const itemsOptions = items?.map((item) => ({
    value: item.ID,
    label: item.Name,
  }));
  const budgetOptions = budgets?.map((code) => ({
    value: code.ID,
    label: code.Name,
  }));

  const initialValues = {
    Status: selectedReceipt?.Status || 'Requested',
    InvoiceNumber: selectedReceipt?.InvoiceNumber || '',
    InvoiceDate:
      selectedReceipt?.InvoiceDate || new Date().toISOString().split('T')[0],

    FundsID: selectedReceipt?.FundsID || '',
    Agency: selectedReceipt?.Agency || '',
    CustomerName: selectedReceipt?.CustomerName || '',
    CustomerID: selectedReceipt?.CustomerID || '',

    Total: selectedReceipt?.Total || 0,
    Remarks: selectedReceipt?.Remarks || '',
    CheckNumber: selectedReceipt?.CheckNumber || '',
    MoneyOrder: selectedReceipt?.MoneyOrder || '',
    PayeeBank: selectedReceipt?.PayeeBank || '',
    CheckDate: selectedReceipt?.CheckDate || '',
    MoneyOrderDate: selectedReceipt?.MoneyOrderDate || '',
    Attachments: selectedReceipt?.Attachments || [],

    PaymentMethodID: 2,
    TransactionItemsAll: selectedReceipt?.TransactionItemsAll || [
      {
        ItemID: '',
        ChargeAccountID: '',
        Quantity: 1,
        Price: 0,
        Vatable: false,
      },
    ],
  };
  console.log('initialValues', initialValues);
  // -------------FILE UPLOAD-------------
  const handleFileUpload = (event, setFieldValue, values) => {
    const files = Array.from(event.target.files);

    // Create new attachments array with just the File objects
    const newAttachments = files.map((file) => file); // Just store the File objects directly

    // Combine with existing attachments
    setFieldValue('Attachments', [...values.Attachments, ...newAttachments]);
  };
  // -----------REMOVE ATTACHMENT-------------
  const removeAttachment = (index, setFieldValue, values) => {
    const updatedAttachments = [...values.Attachments];
    updatedAttachments.splice(index, 1);
    setFieldValue('Attachments', updatedAttachments);
  };
  // -----------SUBMIT ------------
  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();

    // Append all non-attachment fields
    for (const key in values) {
      if (key !== 'Attachments') {
        // For non-file fields, convert to string if not already
        const value =
          typeof values[key] === 'object'
            ? JSON.stringify(values[key])
            : values[key];
        // Rename TransactionItemsAll to Items
        if (key === 'TransactionItemsAll') {
          formData.append('Items', value);
        } else {
          formData.append(key, value);
        }
      }
    }

    // Handle attachments - simplified format (only File objects)
    values?.Attachments.forEach((att, idx) => {
      if (att.ID) {
        formData.append(`Attachments[${idx}].ID`, att.ID);
      } else {
        formData.append(`Attachments[${idx}].File`, att);
      }
    });
    // Add ID if editing existing receipt
    if (selectedReceipt) {
      formData.append('IsNew', 'false');
      formData.append('LinkID', selectedReceipt.LinkID);
      formData.append('ID', selectedReceipt.ID);
    } else {
      formData.append('IsNew', 'true');
    }

    console.log('Form Data:', values);
    try {
      await onSubmit(formData);

      console.log('Form submitted with values:', formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      onClose();
      setSubmitting(false);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        selectedReceipt
          ? 'Edit General Service Receipt'
          : 'New General Service Receipt'
      }
      size="xl"
    >
      <div className="w-full py-4 flex justify-end gap-4 items-center max-sm:flex-col">
        <button type="button" className="btn btn-secondary max-sm:w-full">
          Show List
        </button>
        <button
          className="btn btn-primary max-sm:w-full"
          onClick={() => setShowAttachmentModal(true)}
        >
          Add Attachments
        </button>
        {Print && (
          <button className="btn btn-outline max-sm:w-full">Print</button>
        )}
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={generalServiceReceiptSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          setFieldValue,
          handleChange,
          handleBlur,
          isSubmitting,
          errors,
          touched,
          submitCount,
          isValid,
        }) => {
          // console.log(errors);
          return (
            <Form className="space-y-6">
              {/* Section 5: Attachments */}
              <div className="bg-gray-50 sm:p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-lg">Attachments</h3>

                {values.Attachments.length > 0 ? (
                  <div className="space-y-2">
                    {values.Attachments.map((file, index) => (
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
                            removeAttachment(index, setFieldValue, values)
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No attachments added</p>
                )}
              </div>
              {/* Section 1: Basic Information */}
              <div className="bg-gray-50 sm:p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-lg">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div className="mt-1 px-3 py-2 bg-gray-100 rounded-md">
                      {values?.Status.toUpperCase()}
                    </div>
                  </div>
                  <FormField
                    label="Invoice Number"
                    name="InvoiceNumber"
                    type="text"
                    required
                    onChange={handleChange}
                    value={values.InvoiceNumber}
                    error={errors.InvoiceNumber}
                    touched={touched.InvoiceNumber}
                  />
                </div>

                <FormField
                  label="Date"
                  name="InvoiceDate"
                  type="date"
                  onChange={handleChange}
                  value={values.InvoiceDate}
                  required
                  error={errors.InvoiceDate && touched.InvoiceDate}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Agency"
                    name="Agency"
                    placeholder="Enter Agency"
                    type="text"
                    required
                    onChange={handleChange}
                    value={values.Agency}
                    error={errors.Agency}
                    touched={touched.Agency}
                  />

                  <FormField
                    label="Fund"
                    name="FundsID"
                    type="select"
                    options={fundsOptions}
                    required
                    onChange={handleChange}
                    value={values.FundsID}
                    error={errors.FundsID}
                    touched={touched.FundsID}
                  />
                </div>
              </div>

              {/* Section 2: Payor Information */}
              <div className="bg-gray-50 sm:p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-lg">Payor Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taxpayer Type
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPayorType('Individual');
                        setFieldValue('PayorType', 'Individual');
                        setFieldValue('PayorName', '');
                      }}
                      className={`px-4 py-2 rounded-md ${
                        payorType === 'Individual'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPayorType('Corporation');
                        setFieldValue('PayorType', 'Corporation');
                        setFieldValue('PayorName', '');
                      }}
                      className={`px-4 py-2 rounded-md ${
                        payorType === 'Corporation'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Corporation
                    </button>
                  </div>
                </div>

                <SearchableDropdown
                  label="Payor"
                  name="CustomerName"
                  type="select"
                  options={
                    payorType === 'Individual'
                      ? individualOptions
                      : vendorOptions
                  }
                  required
                  placeholder="Select Payor"
                  onSelect={(value) => {
                    const selectedOption =
                      payorType === 'Individual'
                        ? individualOptions.find(
                            (option) => option.value === value
                          )
                        : vendorOptions.find(
                            (option) => option.value === value
                          );
                    setFieldValue('CustomerName', selectedOption?.label || '');
                    setFieldValue('CustomerID', selectedOption?.value || '');
                  }}
                  selectedValue={values.CustomerID}
                  error={errors.CustomerName}
                  touched={touched.CustomerName}
                />
              </div>

              {/* Section 3: Items */}
              <div className="bg-gray-50 sm:p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-lg">Items</h3>

                <FieldArray name="TransactionItemsAll">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.TransactionItemsAll.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
                        >
                          <FormField
                            label="Item ID"
                            name={`TransactionItemsAll.${index}.ItemID`}
                            type="select"
                            options={itemsOptions}
                            required
                            value={item.ItemID}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.TransactionItemsAll?.[index]?.ItemID &&
                              errors.TransactionItemsAll?.[index]?.ItemID
                            }
                            touched={
                              touched.TransactionItemsAll?.[index]?.ItemID
                            }
                          />

                          <FormField
                            label="Account"
                            name={`TransactionItemsAll.${index}.ChargeAccountID`}
                            type="select"
                            options={budgetOptions}
                            required
                            value={item.ChargeAccountID}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.TransactionItemsAll?.[index]
                                ?.ChargeAccountID &&
                              errors.TransactionItemsAll?.[index]
                                ?.ChargeAccountID
                            }
                            touched={
                              touched.TransactionItemsAll?.[index]
                                ?.ChargeAccountID
                            }
                          />

                          <FormField
                            label="Qty"
                            name={`TransactionItemsAll.${index}.Quantity`}
                            type="number"
                            required
                            min="1"
                            value={item.Quantity}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.TransactionItemsAll?.[index]?.Quantity &&
                              errors.TransactionItemsAll?.[index]?.Quantity
                            }
                            touched={
                              touched.TransactionItemsAll?.[index]?.Quantity
                            }
                          />

                          <FormField
                            label="Price"
                            name={`TransactionItemsAll.${index}.Price`}
                            type="number"
                            required
                            min="0"
                            value={item.Price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.TransactionItemsAll?.[index]?.Price &&
                              errors.TransactionItemsAll?.[index]?.Price
                            }
                            touched={
                              touched.TransactionItemsAll?.[index]?.Price
                            }
                          />

                          <FormField
                            label="Vatable"
                            type="checkbox"
                            id={`TransactionItemsAll.${index}.Vatable`}
                            name={`TransactionItemsAll.${index}.Vatable`}
                            checked={item.Vatable}
                            onChange={handleChange}
                          />
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium">
                              Subtotal:{' '}
                              {(item.Quantity * item.Price).toFixed(2)}
                            </div>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <XIcon />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            ItemID: '',
                            ChargeAccountID: '',
                            Quantity: 1,
                            Price: 0,
                            Vatable: false,
                          })
                        }
                        className="btn btn-primary"
                      >
                        + Add Item
                      </button>
                    </div>
                  )}
                </FieldArray>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Total
                    </label>
                    <div className="mt-1 px-3 py-2 bg-gray-100 rounded-md">
                      {values.TransactionItemsAll.reduce(
                        (sum, item) => sum + item.Quantity * item.Price,
                        0
                      ).toFixed(2)}
                    </div>
                  </div>
                  <FormField
                    label="Amount in Words"
                    name="amountInWords"
                    type="text"
                    value={convertAmountToWords(
                      values.TransactionItemsAll.reduce(
                        (sum, item) => sum + item.Quantity * item.Price,
                        0
                      )
                    )}
                    readOnly
                  />{' '}
                </div>
              </div>

              {/* Section  4: Payment Information */}
              <div className="bg-gray-50 sm:p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-lg">Payment Information</h3>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <div
                    className="inline-flex rounded-md shadow-sm"
                    role="group"
                  >
                    {[
                      { value: 2, label: 'Cash' },
                      { value: 3, label: 'Check' },
                      { value: 8, label: 'Money Order' },
                      { value: 9, label: 'Treasury Warrant' },
                    ].map((method, index) => (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() =>
                          setFieldValue('PaymentMethodID', method.value)
                        }
                        className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border ${
                          values.PaymentMethodID === method.value
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        } ${
                          index === 0
                            ? 'rounded-l-md'
                            : index === 3
                            ? 'rounded-r-md'
                            : 'border-l-0'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {values.PaymentMethodID === 3 && (
                  <>
                    <FormField
                      label="Check Number"
                      name="CheckNumber"
                      type="text"
                      value={values.CheckNumber}
                      onChange={handleChange}
                      error={errors.CheckNumber && touched.CheckNumber}
                    />
                    <FormField
                      label="Bank"
                      name="PayeeBank"
                      type="text"
                      value={values.PayeeBank}
                      onChange={handleChange}
                    />
                    <FormField
                      label="Check Date"
                      name="CheckDate"
                      type="date"
                      value={values.CheckDate}
                      onChange={handleChange}
                      error={errors.CheckDate && touched.CheckDate}
                    />
                  </>
                )}

                {values.PaymentMethodID === 8 && (
                  <>
                    <FormField
                      label="Money Order Number"
                      name="MoneyOrder"
                      type="text"
                      value={values.MoneyOrder}
                      onChange={handleChange}
                      error={errors.MoneyOrder && touched.MoneyOrder}
                    />
                    <FormField
                      label="Money Order Date"
                      name="MoneyOrderDate"
                      type="date"
                      value={values.MoneyOrderDate}
                      onChange={handleChange}
                      error={errors.MoneyOrderDate && touched.MoneyOrderDate}
                    />
                  </>
                )}

                <FormField
                  label="Remarks"
                  name="Remarks"
                  type="textarea"
                  value={values.Remarks}
                  onChange={handleChange}
                  rows={2}
                  error={errors.Remarks && touched.Remarks}
                />
              </div>

              {showAttachmentModal && (
                <Modal
                  isOpen={showAttachmentModal}
                  onClose={() => setShowAttachmentModal(false)}
                  title="Attachments"
                  size="md"
                >
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg sm:p-4 text-center">
                      <label className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center">
                          <Paperclip className="h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">
                            Click to browse or drag and drop files
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            onChange={(e) => {
                              handleFileUpload(e, setFieldValue, values);
                              setShowAttachmentModal(false);
                            }}
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </Modal>
              )}
              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
              {/* {submitCount > 0 && Object.keys(errors).length > 0 && (
                <div className="mt-4 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <h3 className="text-sm font-medium text-red-800">
                    Please fix the following errors:
                  </h3>
                  <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
                    {Object.entries(errors).map(([fieldName, errorMessage]) => {
                      console.log(fieldName, errorMessage);
                      return <li key={fieldName}>{errorMessage}</li>;
                    })}
                  </ul>
                </div>
              )} */}
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default GeneralServiceReceiptModal;
