import { useEffect, useState } from 'react';
import { FileText, Calendar, Plus, Trash2 } from 'lucide-react';
import FormField from '@/components/common/FormField';
import Button from '@/components/common/Button';
import * as Yup from 'yup';
import SearchableDropdown from '@/components/common/SearchableDropdown';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  addButtonTDNumber,
  getTdNumber,
} from '@/features/collections/realPropertyTaxSlice';
import { convertAmountToWords } from '@/utils/amountToWords';
import toast from 'react-hot-toast';

const validationSchema = Yup.object().shape({
  ownerId: Yup.number().required('Owner ID is required'),
  basicGeneralYearID: Yup.number().required('Basic general year is required'),
  T_D_No: Yup.string().required('Tax declaration number is required'),
  IsNew: Yup.boolean().required(),
  LinkID: Yup.number().nullable(),
  CustomerName: Yup.string().required('Customer name is required'),
  Municipality: Yup.string().required('Municipality is required'),
  AmountinWords: Yup.string().required('Amount in words is required'),
  AmountReceived: Yup.number().min(0).required('Amount received is required'),
  RemainingBalance: Yup.number()
    .min(0)
    .required('Remaining balance is required'),
  CheckNumber: Yup.number().required('Check number is required'),
  AdvancedYear: Yup.number()
    .min(1900)
    .max(2100)
    .required('Advanced year is required'),
  AdvanceFunds: Yup.number().min(0).required('Advance funds is required'),
  FundsID: Yup.number().required('Funds ID is required'),
  ReceivedFrom: Yup.string().required('Received from is required'),
  Location: Yup.string().required('Location is required'),
  Lot: Yup.string().required('Lot is required'),
  Block: Yup.string().required('Block is required'),
  PreviousPaymentList: Yup.array()
    .of(
      Yup.object().shape({
        LandPrice: Yup.number().min(0).required('Land price is required'),
        ImprovementPrice: Yup.number()
          .min(0)
          .required('Improvement price is required'),
        TotalAssessedValue: Yup.number()
          .min(0)
          .required('Total assessed value is required'),
        TaxDue: Yup.number().min(0).required('Tax due is required'),
        InstallmentPayment: Yup.number()
          .min(0)
          .required('Installment payment is required'),
        FullPayment: Yup.number().min(0).required('Full payment is required'),
        Penalty: Yup.number().min(0).required('Penalty is required'),
        Total: Yup.number().min(0).required('Total is required'),
      })
    )
    .min(0, 'At least one previous payment entry is required'),
  PresentPaymentList: Yup.array()
    .of(
      Yup.object().shape({
        LandPrice: Yup.number().min(0).required('Land price is required'),
        ImprovementPrice: Yup.number()
          .min(0)
          .required('Improvement price is required'),
        TotalAssessedValue: Yup.number()
          .min(0)
          .required('Total assessed value is required'),
        TaxDue: Yup.number().min(0).required('Tax due is required'),
        InstallmentPayment: Yup.number()
          .min(0)
          .required('Installment payment is required'),
        FullPayment: Yup.number().min(0).required('Full payment is required'),
        Penalty: Yup.number().min(0).required('Penalty is required'),
        Discount: Yup.number().min(0).required('Discount is required'),
        Total: Yup.number().min(0).required('Total is required'),
        RemainingBalance: Yup.number()
          .min(0)
          .required('Remaining balance is required'),
      })
    )
    .min(0, 'At least one present payment entry is required'),
});
// Helper function to transform properties data for form use
const transformPropertiesData = (properties) => {
  if (!properties || !Array.isArray(properties))
    return { previous: [], present: [] };

  const previous = properties
    .filter((prop) => !prop.Present)
    .map((prop) => ({
      LandPrice: parseFloat(prop.LandPrice || 0),
      ImprovementPrice: parseFloat(prop.ImprovementPrice || 0),
      TotalAssessedValue: parseFloat(prop.TotalAssessedValue || 0),
      TaxDue: parseFloat(prop.TaxDue || 0),
      InstallmentPayment: parseFloat(prop.InstallmentPayment || 0),
      FullPayment: parseFloat(prop.FullPayment || 0),
      Penalty: parseFloat(prop.Penalty || 0),
      Total: parseFloat(prop.Total || 0),
    }));

  const present = properties
    .filter((prop) => prop.Present)
    .map((prop) => ({
      LandPrice: parseFloat(prop.LandPrice || 0),
      ImprovementPrice: parseFloat(prop.ImprovementPrice || 0),
      TotalAssessedValue: parseFloat(prop.TotalAssessedValue || 0),
      TaxDue: parseFloat(prop.TaxDue || 0),
      InstallmentPayment: parseFloat(prop.InstallmentPayment || 0),
      FullPayment: parseFloat(prop.FullPayment || 0),
      Penalty: parseFloat(prop.Penalty || 0),
      Discount: parseFloat(prop.Discount || 0),
      Total: parseFloat(prop.Total || 0),
      RemainingBalance: parseFloat(prop.RemainingBalance || 0),
    }));

  return { previous, present };
};
const RealPropertyTaxForm = ({
  onCreateOrEdit,
  onBack,
  individualOptions,
  generalRevisionsOptions,
  initialData = null, // Add this prop for edit mode
}) => {
  const dispatch = useDispatch();
  const {
    tdNumber,
    addButtonResult,
    isLoading: isTdLoading,
  } = useSelector((state) => state.realPropertyTax);

  const [isBasicInfoComplete, setIsBasicInfoComplete] = useState(false);
  const [advancePayment, setAdvancePayment] = useState(false);

  const [previousValues, setPreviousValues] = useState({
    LandPrice: '',
    ImprovementPrice: '',
    TotalAssessedValue: '',
    Total: '',
    TaxDue: '',
    InstallmentPayment: '',
    FullPayment: '',
    Penalty: '',
    dueDateYear: '',
    payment: '',
  });

  const [presentValues, setPresentValues] = useState({
    LandPrice: '',
    ImprovementPrice: '',
    TotalAssessedValue: '',
    Total: '',
    Discount: '',
    Penalty: '',
    TaxDue: '',
    InstallmentPayment: false,
    FullPayment: false,
    dueDateYear: '',
    payment: '',
  });
  // Get initial values based on whether it's edit mode or create mode
  const getInitialValues = () => {
    if (initialData) {
      const { previous, present } = transformPropertiesData(
        initialData.properties
      );

      // Find the matching owner ID from individualOptions
      const matchingOwner = individualOptions?.find(
        (option) => option.label === initialData.CustomerName
      );

      // Find the matching general revision ID
      const matchingRevision = generalRevisionsOptions?.find(
        (option) => option.label === initialData.GeneralRevision?.toString()
      );

      return {
        IsNew: false, // Edit mode
        LinkID: initialData.LinkID,
        ownerId: matchingOwner?.value || '',
        CustomerName: initialData.CustomerName || '',
        basicGeneralYearID: matchingRevision?.value || '',
        T_D_No: initialData.T_D_No || '',
        Municipality: initialData.Municipality || 'MAKATI',
        AmountinWords: initialData.AmountinWords || '',
        AmountReceived: parseFloat(initialData.AmountReceived || 0),
        RemainingBalance: parseFloat(initialData.RemainingBalance || 0),
        CheckNumber: initialData.CheckNumber || 0,
        AdvancedYear: initialData.AdvancedYear || '',
        AdvanceFunds: parseFloat(initialData.AdvanceFunds || 0),
        FundsID: initialData.FundsID || 0,
        ReceivedFrom: initialData.ReceivedFrom || 'CEDRIC',
        Location: initialData.properties?.[0]?.Location || '',
        Lot: initialData.properties?.[0]?.Lot || '',
        Block: initialData.properties?.[0]?.Block || '',
        PreviousPaymentList: previous,
        PresentPaymentList: present,
      };
    }

    // Default values for create mode
    return {
      IsNew: true,
      LinkID: null,
      ownerId: '',
      CustomerName: '',
      basicGeneralYearID: '',
      T_D_No: '',
      Municipality: 'MAKATI',
      AmountinWords: '',
      AmountReceived: 0,
      RemainingBalance: 0,
      CheckNumber: 0,
      AdvancedYear: '',
      AdvanceFunds: 0,
      FundsID: 0,
      ReceivedFrom: 'CEDRIC',
      Location: '',
      Lot: '',
      Block: '',
      PreviousPaymentList: [],
      PresentPaymentList: [],
    };
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema,
    onSubmit: (values) => {
      onCreateOrEdit(values);
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = formik;

  useEffect(() => {
    const isComplete =
      values.ownerId &&
      values.basicGeneralYearID &&
      values.T_D_No &&
      addButtonResult;
    setIsBasicInfoComplete(isComplete);
  }, [
    values.ownerId,
    values.basicGeneralYearID,
    values.T_D_No,
    addButtonResult,
  ]);

  useEffect(() => {
    if (values.ownerId && values.basicGeneralYearID) {
      const selectedYear = generalRevisionsOptions?.find(
        (item) => item.value === Number(values.basicGeneralYearID)
      )?.label;
      dispatch(
        getTdNumber({
          ownerId: values.ownerId,
          generalRevision: selectedYear,
        })
      );
      setFieldValue('AdvancedYear', selectedYear);
    }
  }, [values.ownerId, values.basicGeneralYearID, dispatch, setFieldValue]);

  const tdNumberOptions = tdNumber
    ? tdNumber.map((item) => ({
        value: item.T_D_No,
        label: item.T_D_No,
      }))
    : [];

  const handleAddTaxDeclaration = async () => {
    try {
      await dispatch(addButtonTDNumber(values.T_D_No)).unwrap();
    } catch (error) {
      console.error('Failed to add tax declaration:', error);
      toast.error('Failed to add tax declaration. ' + error.message);
    }
  };

  const handlePreviousInputChange = (e) => {
    const { name, value } = e.target;
    setPreviousValues((prev) => ({ ...prev, [name]: value }));
  };

  const handlePresentInputChange = (e) => {
    const { name, value } = e.target;
    setPresentValues((prev) => ({ ...prev, [name]: value }));
  };

  const addPreviousBalanceEntry = () => {
    const newEntry = {
      LandPrice: Number(previousValues.LandPrice) || 0,
      ImprovementPrice: Number(previousValues.ImprovementPrice) || 0,
      TotalAssessedValue: Number(previousValues.TotalAssessedValue) || 0,
      TaxDue: Number(previousValues.TaxDue) || 0,
      InstallmentPayment: Number(previousValues.InstallmentPayment) || 0,
      FullPayment: Number(previousValues.FullPayment) || 0,
      Penalty: Number(previousValues.Penalty) || 0,
      Total: Number(previousValues.Total) || 0,
    };
    setFieldValue('PreviousPaymentList', [
      ...values.PreviousPaymentList,
      newEntry,
    ]);
    setPreviousValues({
      LandPrice: '',
      ImprovementPrice: '',
      TotalAssessedValue: '',
      Total: '',
      TaxDue: '',
      InstallmentPayment: '',
      FullPayment: '',
      Penalty: '',
    });
  };

  const removePreviousBalanceEntry = (index) => {
    const newList = values.PreviousPaymentList.filter((_, i) => i !== index);
    setFieldValue('PreviousPaymentList', newList);
  };

  const addPresentBalanceEntry = () => {
    const newEntry = {
      LandPrice: Number(presentValues.LandPrice) || 0,
      ImprovementPrice: Number(presentValues.ImprovementPrice) || 0,
      TotalAssessedValue: Number(presentValues.TotalAssessedValue) || 0,
      TaxDue: Number(presentValues.TaxDue) || 0,
      InstallmentPayment: presentValues.InstallmentPayment ? 1 : 0,
      FullPayment: presentValues.FullPayment ? 1 : 0,
      Penalty: Number(presentValues.Penalty) || 0,
      Discount: Number(presentValues.Discount) || 0,
      Total: Number(presentValues.Total) || 0,
      RemainingBalance: 0,
    };
    setFieldValue('PresentPaymentList', [
      ...values.PresentPaymentList,
      newEntry,
    ]);
    setPresentValues({
      LandPrice: '',
      ImprovementPrice: '',
      TotalAssessedValue: '',
      Total: '',
      Discount: '',
      Penalty: '',
      TaxDue: '',
      InstallmentPayment: false,
      FullPayment: false,
    });
  };

  const removePresentBalanceEntry = (index) => {
    const newList = values.PresentPaymentList.filter((_, i) => i !== index);
    setFieldValue('PresentPaymentList', newList);
  };

  const PropertyTable = ({ entries, title, removeEntry }) => (
    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between sm:items-center gap-4 max-sm:flex-col">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-16 border border-gray-300 p-2 font-medium">
                  #
                </th>
                <th className="w-28 border border-gray-300 p-2 font-medium">
                  Land
                </th>
                <th className="w-32 border border-gray-300 p-2 font-medium">
                  Improvement
                </th>
                <th className="w-32 border border-gray-300 p-2 font-medium">
                  Total Assessed
                </th>
                <th className="w-28 border border-gray-300 p-2 font-medium">
                  Tax Due
                </th>
                <th className="w-28 border border-gray-300 p-2 font-medium">
                  Installment Payment
                </th>
                <th className="w-28 border border-gray-300 p-2 font-medium">
                  Full Payment
                </th>
                <th className="w-20 border border-gray-300 p-2 font-medium">
                  Penalty
                </th>
                <th className="w-20 border border-gray-300 p-2 font-medium">
                  Total
                </th>
                {title.includes('Present') && (
                  <th className="w-20 border border-gray-300 p-2 font-medium">
                    Discount
                  </th>
                )}
                <th className="w-16 border border-gray-300 p-2 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-1 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 p-1 text-right">
                    {entry.LandPrice.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-1 text-right">
                    {entry.ImprovementPrice.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-1 text-right">
                    {entry.TotalAssessedValue.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-1 text-right">
                    {entry.TaxDue.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-1 text-center">
                    {entry.InstallmentPayment ? 'Yes' : 'No'}
                  </td>
                  <td className="border border-gray-300 p-1 text-center">
                    {entry.FullPayment ? 'Yes' : 'No'}
                  </td>
                  <td className="border border-gray-300 p-1 text-right">
                    {entry.Penalty.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-1 text-right">
                    {entry.Total.toFixed(2)}
                  </td>
                  {title.includes('Present') && (
                    <td className="border border-gray-300 p-1 text-right">
                      {entry.Discount.toFixed(2)}
                    </td>
                  )}
                  <td className="border border-gray-300 p-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeEntry(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white md:p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Basic Information Row */}
        <div className="bg-white rounded-lg shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sm:p-6 p-3 rounded-t-lg">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </h3>
          </div>
          <div className="sm:p-6 p-3">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-center border-b ">
              <SearchableDropdown
                label="Owner"
                name="CustomerName"
                options={individualOptions}
                value={values.CustomerName}
                onSelect={(value) => {
                  const selectedOption = individualOptions.find(
                    (option) => option.value === value
                  );
                  setFieldValue('CustomerName', selectedOption?.label || '');
                  setFieldValue('ownerId', selectedOption?.value || '');
                }}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                selectedValue={values.ownerId}
                error={errors.CustomerName}
                required
                touched={touched.CustomerName}
              />
              <FormField
                label="General Revision (Year)"
                name="basicGeneralYearID"
                type="select"
                options={generalRevisionsOptions}
                value={values.basicGeneralYearID}
                onChange={handleChange}
                required
                onBlur={handleBlur}
                error={errors.basicGeneralYearID}
                touched={touched.basicGeneralYearID}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Tax Declaration Number"
                name="T_D_No"
                type="select"
                options={tdNumberOptions}
                value={values.T_D_No}
                disabled={!tdNumberOptions.length || isTdLoading}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.T_D_No}
                required
                touched={touched.T_D_No}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !tdNumberOptions.length || isTdLoading || !values.T_D_No
                }
                onClick={handleAddTaxDeclaration}
              >
                Add
              </button>
            </div>
            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <FormField
                label="Check Number"
                name="CheckNumber"
                value={values.CheckNumber}
                onChange={handleChange}
                required
                onBlur={handleBlur}
                error={errors.CheckNumber}
                touched={touched.CheckNumber}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Received From"
                name="ReceivedFrom"
                value={values.ReceivedFrom}
                onChange={handleChange}
                required
                onBlur={handleBlur}
                error={errors.ReceivedFrom}
                touched={touched.ReceivedFrom}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Municipality"
                name="Municipality"
                value={values.Municipality}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.Municipality}
                touched={touched.Municipality}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Address"
                name="Location"
                value={values.Location}
                onChange={handleChange}
                required
                onBlur={handleBlur}
                error={errors.Location}
                touched={touched.Location}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Block"
                name="Block"
                value={values.Block}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.Block}
                touched={touched.Block}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Lot"
                name="Lot"
                value={values.Lot}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.Lot}
                touched={touched.Lot}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Previous Balance Land Values Section */}
        <div
          className={`bg-white rounded-lg shadow-lg ${
            !isBasicInfoComplete ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <div className="bg-gray-100 p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Previous Balance Land Values
            </h3>
          </div>
          <div className="sm:p-6 p-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <FormField
                label="Land Values"
                name="LandPrice"
                value={previousValues.LandPrice}
                onChange={handlePreviousInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Improvement"
                name="ImprovementPrice"
                value={previousValues.ImprovementPrice}
                onChange={handlePreviousInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Total Assessed Value"
                name="TotalAssessedValue"
                value={previousValues.TotalAssessedValue}
                onChange={handlePreviousInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Tax Due"
                name="TaxDue"
                value={previousValues.TaxDue}
                onChange={handlePreviousInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Installment Payment"
                name="InstallmentPayment"
                value={previousValues.InstallmentPayment}
                onChange={handlePreviousInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Full Payment"
                name="FullPayment"
                value={previousValues.FullPayment}
                onChange={handlePreviousInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Penalty"
                name="Penalty"
                value={previousValues.Penalty}
                onChange={handlePreviousInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Total"
                name="Total"
                value={previousValues.Total}
                onChange={handlePreviousInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!isBasicInfoComplete}
                  onClick={addPreviousBalanceEntry}
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Previous  Balance Table */}
        {touched.PreviousPaymentList && errors.PreviousPaymentList && (
          <div className="text-red-500 text-sm mt-1">
            {errors.PreviousPaymentList}
          </div>
        )}
        {/* Previous Balance Table */}
        <PropertyTable
          entries={values.PreviousPaymentList}
          title="Previous Year Balance - Detailed Property List"
          removeEntry={removePreviousBalanceEntry}
        />

        {/* Present Year Balance Section */}
        <div
          className={`bg-white rounded-lg shadow-lg ${
            !isBasicInfoComplete ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          <div className="bg-gray-100 p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold text-gray-700">
              Present Year Balance
            </h3>
          </div>
          <div className="sm:p-6 p-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <FormField
                label="Land Values"
                name="LandPrice"
                value={presentValues.LandPrice}
                onChange={handlePresentInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Improvement"
                name="ImprovementPrice"
                value={presentValues.ImprovementPrice}
                onChange={handlePresentInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Total Assessed Value"
                name="TotalAssessedValue"
                value={presentValues.TotalAssessedValue}
                onChange={handlePresentInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Tax Due"
                name="TaxDue"
                value={presentValues.TaxDue}
                onChange={handlePresentInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Discount Rate"
                name="Discount"
                value={presentValues.Discount}
                onChange={handlePresentInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Penalty Rate"
                name="Penalty"
                value={presentValues.Penalty}
                onChange={handlePresentInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <FormField
                label="Total"
                name="Total"
                value={presentValues.Total}
                onChange={handlePresentInputChange}
                disabled={!isBasicInfoComplete}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type
                </label>
                <div className="flex gap-4 flex-col">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={presentValues.InstallmentPayment}
                      onChange={() =>
                        setPresentValues({
                          ...presentValues,
                          InstallmentPayment: true,
                          FullPayment: false,
                        })
                      }
                      disabled={!isBasicInfoComplete}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Installment Payment</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentType"
                      checked={presentValues.FullPayment}
                      onChange={() =>
                        setPresentValues({
                          ...presentValues,
                          FullPayment: true,
                          InstallmentPayment: false,
                        })
                      }
                      disabled={!isBasicInfoComplete}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Full Payment</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!isBasicInfoComplete}
                  onClick={addPresentBalanceEntry}
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Present Balance Table */}
        {touched.PresentPaymentList && errors.PresentPaymentList && (
          <div className="text-red-500 text-sm mt-1">
            {errors.PresentPaymentList}
          </div>
        )}
        {/* Present Balance Table */}
        <PropertyTable
          entries={values.PresentPaymentList}
          title="Present Year Balance - Detailed Property List"
          removeEntry={removePresentBalanceEntry}
        />

        {/* Payment Summary */}
        <div className="bg-white rounded-lg shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sm:p-6 p-3 rounded-t-lg">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Payment Summary
            </h3>
          </div>
          <div className="sm:p-6 p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                label="Amount Received"
                name="AmountReceived"
                value={values.AmountReceived}
                onChange={(e) => {
                  setFieldValue('AmountReceived', e.target.value);
                  const convertedValue = convertAmountToWords(e.target.value);
                  setFieldValue('AmountinWords', convertedValue);
                }}
                onBlur={handleBlur}
                required
                error={errors.AmountReceived}
                touched={touched.AmountReceived}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right font-mono"
              />
              <FormField
                label="Remaining Balance"
                name="RemainingBalance"
                value={values.RemainingBalance}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.RemainingBalance}
                touched={touched.RemainingBalance}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-right font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormField
                label="Received From"
                name="ReceivedFrom"
                value={values.ReceivedFrom}
                onChange={handleChange}
                required
                onBlur={handleBlur}
                error={errors.ReceivedFrom}
                touched={touched.ReceivedFrom}
                className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="flex items-center gap-4">
                <label className="flex items-start gap-2">
                  <FormField
                    type="checkbox"
                    name="advancePayment"
                    checked={advancePayment}
                    onChange={(e) => setAdvancePayment(e.target.checked)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium ">Advance Payment</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center gap-4">
                <FormField
                  label="Funds"
                  name="AdvanceFunds"
                  value={values.AdvanceFunds}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={errors.AdvanceFunds}
                  touched={touched.AdvanceFunds}
                  disabled={!advancePayment}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 w-20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-900">Until</span>
                <FormField
                  label="Year"
                  name="AdvancedYear"
                  value={values.AdvancedYear}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={errors.AdvancedYear}
                  touched={touched.AdvancedYear}
                  disabled={!advancePayment}
                  className="border-blue-200 focus:border-blue-500 focus:ring-blue-500 w-20 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fund Type <span className="text-red-600">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="FundsID"
                      checked={values.FundsID === 1}
                      onChange={() => setFieldValue('FundsID', 1)}
                      onBlur={handleBlur}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Basic Fund</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="FundsID"
                      checked={values.FundsID === 2}
                      onChange={() => setFieldValue('FundsID', 2)}
                      onBlur={handleBlur}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Special Education Fund</span>
                  </label>
                </div>
              </div>
            </div>

            <FormField
              label="Amount In Words"
              name="AmountinWords"
              type="textarea"
              value={values.AmountinWords}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.AmountinWords}
              touched={touched.AmountinWords}
              required
              className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter amount in words..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
          <Button
            variant="outline"
            className="btn btn-outline"
            onClick={onBack}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            onClick={handleSubmit}
          >
            Save Draft
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RealPropertyTaxForm;
