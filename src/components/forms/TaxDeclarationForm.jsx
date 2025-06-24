import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import FormField from '../common/FormField';
import Button from '../common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '@/features/settings/customersSlice';

function TaxDeclarationForm({ initialData, onSubmit, onClose }) {
  // const [assessmentRows, setAssessmentRows] = useState(initialData?.AssessmentRows || [
  //   {
  //     Kind: '',
  //     Classification: '',
  //     Area: '',
  //     MarketValue: '',
  //     ActualUse: '',
  //     AssessmentLevel: '',
  //     AssessmentValue: '',
  //   },
  // ]);
  const dispatch = useDispatch();
  const { customers } = useSelector(state => state.customers);

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);


  const formik = useFormik({
    initialValues: {
      T_D_No: '',
      PropertyID: '',
      OwnerID: '',
      OwnerTIN: '',
      OwnerTelephoneNumber: '',
      OwnerAddress: '',

      BeneficialorAdminUserID: '',
      BeneficialorAdminTIN: '',
      BeneficialorAdminAddress: '',
      BeneficialorAdminTelephoneNumber: '',

      OCT_TCT_CLOA_Number: '',
      SurveyNumber: '',
      LotNumber: '',
      CCT: '',
      BlockNumber: '',
      Dated: '',

      North: '',
      South: '',
      East: '',
      West: '',
      Taxable: false,

      CancelTDNumber: '',
      PreviousAssessedValue: '',

      KindofProperty: '',
      Storeys: '',
      Description: '',

      ActualUse: '',
      Classification: '',
      AssessmentLevel: '',
      MarketValue: '',

      AmountInWords: '',
      Memoranda: '',
      ...(initialData || {}),
    },
    validationSchema: Yup.object({
      T_D_No: Yup.number().required('TD No. is required'),
      PropertyID: Yup.number().required('Property ID is required'),
      // KindofProperty: Yup.string().required('Kind of Property is required'),
      // Storeys: Yup.string().required('Number of Storeys is required'),
      // Description: Yup.string().required('Description is required'),
      // ActualUse: Yup.string().required('Actual Use is required'),
      // Classification: Yup.string().required('Classification is required'),
      // AssessmentLevel: Yup.string().required('Assessment Level is required'),
      // MarketValue: Yup.string().required('Market Value is required'),
      // AmountInWords: Yup.string().required('Amount in Words is required'),
      // Memoranda: Yup.string().required('Memoranda is required'),
      // BlockNumber: Yup.string().required('Block Number is required'),
      // Dated: Yup.date().nullable().required('Dated is required'),
      // Taxable: Yup.boolean().required('Taxable is required'),
      // CancelTDNumber: Yup.string().required('Cancel TD Number is required'),
      // Effectivity: Yup.date().nullable().required('Effectivity is required'),
      // OwnerPrevious: Yup.string().required('Owner Previous is required'),
      // PreviousAssessedValue: Yup.string().required('Previous Assessed Value is required'),
    }),
    onSubmit: (values) => {
      onSubmit({
        ...values,
        assessmentRows,
      });
    },
  });

  // useEffect(() => {
  //   if (initialData?.assessmentRows) {
  //     setAssessmentRows(initialData.assessmentRows);
  //   }
  // }, [initialData]);
  const [assessmentRows, setAssessmentRows] = useState(() =>
    initialData?.AssessmentRows?.length
      ? initialData.AssessmentRows.map(row => ({ ...row })) // clone to prevent mutation issues
      : [{
          Kind: '',
          Classification: '',
          Area: '',
          MarketValue: '',
          ActualUse: '',
          AssessmentLevel: '',
          AssessmentValue: '',
        }]
  );


  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
  } = formik;

  const addAssessmentRow = () => {
    setAssessmentRows([
      ...assessmentRows,
      {
        Kind: '',
        Classification: '',
        Area: '',
        MarketValue: '',
        ActualUse: '',
        AssessmentLevel: '',
        AssessmentValue: '',
      },
    ]);
  };

  const deleteAssessmentRow = (index) => {
    if (assessmentRows.length === 1) return;
    const updated = [...assessmentRows];
    updated.splice(index, 1);
    setAssessmentRows(updated);
  };

  const handleAssessmentChange = (index, field, value) => {
    const updated = [...assessmentRows];
    updated[index][field] = value;
    setAssessmentRows(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField required label="TD No." name="T_D_No" type="number" {...{ value: values.T_D_No, onChange: handleChange, onBlur: handleBlur, error: errors.T_D_No, touched: touched.T_D_No }} />
        <FormField required label="Property Identification No." name="PropertyID" type="number" {...{ value: values.PropertyID, onChange: handleChange, onBlur: handleBlur, error: errors.PropertyID, touched: touched.PropertyID }} />
      </div>

      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300">
        <FormField label="Owner" name="OwnerID" type="select" 
        options={customers.map(customer => ({ value: customer.ID, label: customer.Name }))} 
        {...{ value: values.OwnerID, onChange: handleChange, onBlur: handleBlur, error: errors.OwnerID, touched: touched.OwnerID }} />
        <FormField label="TIN" name="OwnerTIN" type="number" {...{ value: values.OwnerTIN, onChange: handleChange, onBlur: handleBlur, error: errors.OwnerTIN, touched: touched.OwnerTIN }} />
        <FormField label="Owner Telephone No." name="OwnerTelephoneNumber" type="number" {...{ value: values.OwnerTelephoneNumber, onChange: handleChange, onBlur: handleBlur, error: errors.OwnerTelephoneNumber, touched: touched.OwnerTelephoneNumber }} />
        <FormField label="Address" name="OwnerAddress" type="text" {...{ value: values.OwnerAddress, onChange: handleChange, onBlur: handleBlur, error: errors.OwnerAddress, touched: touched.OwnerAddress }} />
      </fieldset>

      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300">
        <FormField label="Beneficial/Administrator User"
        options={customers.map(customer => ({ value: customer.ID, label: customer.Name }))} 
        name="BeneficialorAdminUserID" type="select" {...{ value: values.BeneficialorAdminUserID, onChange: handleChange, onBlur: handleBlur, error: errors.BeneficialorAdminUserID, touched: touched.BeneficialorAdminUserID }} />
        <FormField label="Beneficial/Admin User TIN" name="BeneficialorAdminTIN" type="number" {...{ value: values.BeneficialorAdminTIN, onChange: handleChange, onBlur: handleBlur, error: errors.BeneficialorAdminTIN, touched: touched.BeneficialorAdminTIN }} />
        <FormField label="Beneficial/Administrator Telephone No." name="BeneficialorAdminTelephoneNumber" type="number" {...{ value: values.BeneficialorAdminTelephoneNumber, onChange: handleChange, onBlur: handleBlur, error: errors.BeneficialorAdminTelephoneNumber, touched: touched.BeneficialorAdminTelephoneNumber }} />
        <FormField label="Beneficial/Administrator Address" name="BeneficialorAdminAddress" type="text" {...{ value: values.BeneficialorAdminAddress, onChange: handleChange, onBlur: handleBlur, error: errors.BeneficialorAdminAddress, touched: touched.BeneficialorAdminAddress }} />
      </fieldset>

      <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-300">
        <FormField label="OCT/TCT/CLOA No." name="OCT_TCT_CLOA_Number" type="number" {...{ value: values.OCT_TCT_CLOA_Number, onChange: handleChange, onBlur: handleBlur, error: errors.OCT_TCT_CLOA_Number, touched: touched.OCT_TCT_CLOA_Number }} />
        <FormField label="Survey No." name="SurveyNumber" type="number" {...{ value: values.SurveyNumber, onChange: handleChange, onBlur: handleBlur, error: errors.SurveyNumber, touched: touched.SurveyNumber }} />
        <FormField label="Lot No." name="LotNumber" type="text" {...{ value: values.LotNumber, onChange: handleChange, onBlur: handleBlur, error: errors.LotNumber, touched: touched.LotNumber }} />
        <FormField label="CCT" name="CCT" type="text" {...{ value: values.CCT, onChange: handleChange, onBlur: handleBlur, error: errors.CCT, touched: touched.CCT }} />
        <FormField label="Block No." name="BlockNumber" type="text" {...{ value: values.BlockNumber, onChange: handleChange, onBlur: handleBlur, error: errors.BlockNumber, touched: touched.BlockNumber }} />
        <FormField label="Dated" name="Dated" type="date" {...{ value: values.Dated, onChange: handleChange, onBlur: handleBlur, error: errors.Dated, touched: touched.Dated }} />
      </fieldset>

      {/* Boundaries and Taxable */}
      <div className="p-4 border border-gray-300">
        <h3 className="text-lg font-semibold mb-4">Boundaries:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="North"
            name="North"
            type="text"
            value={values.North}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.North}
            touched={touched.North}
          />
          <FormField
            label="South"
            name="South"
            type="text"
            value={values.South}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.South}
            touched={touched.South}
          />
          <FormField
            label="East"
            name="East"
            type="text"
            value={values.East}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.East}
            touched={touched.East}
          />
          <FormField
            label="West"
            name="West"
            type="text"
            value={values.West}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.West}
            touched={touched.West}
          />
        </div>

        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="Taxable"
              checked={values.Taxable}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">Taxable</span>
          </label>
        </div>
      </div>


      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300">
        <div>
          <label className="block text-sm font-medium mb-1">
            This Declaration cancels TD No.
          </label>
          <select
            name="CancelTDNumber"
            value={values.CancelTDNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select TD No.</option>
            {/* Populate dynamically if needed */}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Effectivity of Assessment/Reassessment
          </label>
          <input
            type="date"
            name="Effectivity"
            value={values.Effectivity}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Owner:</label>
          <input
            type="text"
            name="ownerPrevious"
            value={values.ownerPrevious}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Previous Assessed Value:
          </label>
          <input
            type="number"
            name="PreviousAssessedValue"
            value={values.PreviousAssessedValue}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>


      {/* Assessment Table */}
      <div className="p-4 border border-gray-300 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Kind"
            name="KindofProperty"
            type="text"
            value={values.KindofProperty}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.KindofProperty}
            touched={touched.KindofProperty}
          />
          <FormField
            label="Number of Storeys"
            name="Storeys"
            type="number"
            value={values.Storeys}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.Storeys}
            touched={touched.Storeys}
          />
        </div>

        <FormField
          label="Description"
          name="Description"
          type="textarea"
          value={values.Description}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.Description}
          touched={touched.Description}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300">
        <div>
          <label className="block text-sm font-medium mb-1">Kind:</label>
          <select
            name="kind"
            value={values.kind}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Kind</option>
            <option value="LAND">LAND</option>
            <option value="BUILDING">BUILDING</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Actual Use:</label>
          <select
            name="ActualUse"
            value={values.ActualUse}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Use</option>
            <option value="RESIDENTIAL">RESIDENTIAL</option>
            <option value="COMMERCIAL">COMMERCIAL</option>
            <option value="INDUSTRIAL">INDUSTRIAL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Classification:</label>
          <select
            name="Classification"
            value={values.Classification}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Classification</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Area Size:</label>
          <input
            type="text"
            name="AreaSize"
            value={values.AreaSize}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assessment Level:</label>
          <input
            type="number"
            name="AssessmentLevel"
            value={values.AssessmentLevel}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Market Value:</label>
          <input
            type="number"
            name="MarketValue"
            value={values.MarketValue}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>


      {/* Assessment Table */}
      <div className="p-4 border border-gray-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Assessment Details</h3>
          <Button
            type="button"
            onClick={addAssessmentRow}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            ADD
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {['Kind', 'Classification', 'Area', 'Market Value', 'Actual Use', 'Assessment Level', 'Assessment Value', 'Actions'].map((th) => (
                  <th key={th} className="border border-gray-300 p-2 text-sm">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assessmentRows.map((row, index) => (
                <tr key={index}>
                  {['Kind', 'Classification', 'Area', 'MarketValue', 'ActualUse', 'AssessmentLevel', 'AssessmentValue'].map((field) => (
                    <td key={field} className="border border-gray-300 p-1">
                      <input
                        type="text"
                        value={row[field]}
                        onChange={(e) => handleAssessmentChange(index, field, e.target.value)}
                        className="w-full p-1 border-0 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                  ))}
                  <td className="border border-gray-300 p-1 text-center">
                    <Button
                      type="button"
                      onClick={() => deleteAssessmentRow(index)}
                      className="bg-red-600 hover:bg-red-700 text-white p-1"
                      disabled={assessmentRows.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Sections */}
      <div className="p-4 border border-gray-300">
        <label className="block text-sm font-medium mb-1">Amounts in Words:</label>
        <textarea
          name="AmountInWords"
          value={values.AmountInWords}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="2"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="p-4 border border-gray-300">
        <label className="block text-sm font-medium mb-1 bg-red-100 p-2">Memoranda:</label>
        <textarea
          name="Memoranda"
          value={values.Memoranda}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onClose} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default TaxDeclarationForm;
