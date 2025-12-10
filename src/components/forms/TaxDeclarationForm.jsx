import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import FormField from '../common/FormField';
import Button from '../common/Button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers } from '@/features/settings/customersSlice';

function TaxDeclarationForm({ initialData, onSubmit, onClose }) {
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customers);

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
    // validationSchema: Yup.object({
    //   T_D_No: Yup.number().required('TD No. is required'),
    //   PropertyID: Yup.number().required('Property ID is required'),
    //   OwnerID: Yup.number().required('Owner ID is required'),
    //   OwnerTIN: Yup.string().required('Owner TIN is required'),
    //   OwnerTelephoneNumber: Yup.string().required(
    //     'Owner Telephone Number is required'
    //   ),
    //   OwnerAddress: Yup.string().required('Owner Address is required'),

    //   BeneficialorAdminUserID: Yup.number().required(
    //     'Beneficialor Admin User ID is required'
    //   ),
    //   BeneficialorAdminTIN: Yup.string().required(
    //     'Beneficialor Admin TIN is required'
    //   ),
    //   BeneficialorAdminAddress: Yup.string().required(
    //     'Beneficialor Admin Address is required'
    //   ),
    //   BeneficialorAdminTelephoneNumber: Yup.string().required(
    //     'Beneficialor Admin Telephone Number is required'
    //   ),
    //   OCT_TCT_CLOA_Number: Yup.string().required(
    //     'OCT TCT CLOA Number is required'
    //   ),
    //   SurveyNumber: Yup.string().required('Survey Number is required'),
    //   LotNumber: Yup.string().required('Lot Number is required'),
    //   CCT: Yup.string().required('CCT is required'),

    //   North: Yup.string().required('North is required'),
    //   South: Yup.string().required('South is required'),
    //   East: Yup.string().required('East is required'),
    //   West: Yup.string().required('West is required'),

    //   Kind: Yup.string().required('Kind is required'),
    //   Classification: Yup.string().required('Classification is required'),
    //   Area: Yup.string().required('Area is required'),
    //   MarketValue: Yup.string().required('Market Value is required'),
    //   ActualUse: Yup.string().required('Actual Use is required'),
    //   AssessmentLevel: Yup.string().required('Assessment Level is required'),
    //   AssessmentValue: Yup.string().required('Assessment Value is required'),

    //   AmountInWords: Yup.string().required('Amount in Words is required'),
    //   // KindofProperty: Yup.string().required('Kind of Property is required'),
    //   // Storeys: Yup.string().required('Number of Storeys is required'),
    //   // Description: Yup.string().required('Description is required'),
    //   // ActualUse: Yup.string().required('Actual Use is required'),
    //   // Classification: Yup.string().required('Classification is required'),
    //   // AssessmentLevel: Yup.string().required('Assessment Level is required'),
    //   // MarketValue: Yup.string().required('Market Value is required'),
    //   // Memoranda: Yup.string().required('Memoranda is required'),
    //   // BlockNumber: Yup.string().required('Block Number is required'),
    //   // Dated: Yup.date().nullable().required('Dated is required'),
    //   // Taxable: Yup.boolean().required('Taxable is required'),
    //   CancelTDNumber: Yup.string().required('Cancel TD Number is required'),
    //   Effectivity: Yup.date().required('Effectivity is required'),
    //   OwnerPrevious: Yup.string().required('Owner Previous is required'),
    //   PreviousAssessedValue: Yup.string().required(
    //     'Previous Assessed Value is required'
    //   ),
    // }),
    validationSchema: Yup.object({
      T_D_No: Yup.number().required('TD No. is required'),
      PropertyID: Yup.number().required('Property ID is required'),
      OwnerID: Yup.number().required('Owner ID is required'),
      OwnerTIN: Yup.string().required('Owner TIN is required'),
      OwnerTelephoneNumber: Yup.string().required(
        'Owner Telephone Number is required'
      ),
      OwnerAddress: Yup.string().required('Owner Address is required'),
      BeneficialorAdminUserID: Yup.number().required(
        'Beneficialor Admin User ID is required'
      ),
      BeneficialorAdminTIN: Yup.string().required(
        'Beneficialor Admin TIN is required'
      ),
      BeneficialorAdminAddress: Yup.string().required(
        'Beneficialor Admin Address is required'
      ),
      BeneficialorAdminTelephoneNumber: Yup.string().required(
        'Beneficialor Admin Telephone Number is required'
      ),
      OCT_TCT_CLOA_Number: Yup.string().required(
        'OCT TCT CLOA Number is required'
      ),
      SurveyNumber: Yup.string().required('Survey Number is required'),
      LotNumber: Yup.string().required('Lot Number is required'),
      CCT: Yup.string().required('CCT is required'),
      BlockNumber: Yup.string().required('Block Number is required'),
      Dated: Yup.string().required('Dated is required'),
      North: Yup.string().required('North is required'),
      South: Yup.string().required('South is required'),
      East: Yup.string().required('East is required'),
      West: Yup.string().required('West is required'),
      Taxable: Yup.boolean(),
      CancelTDNumber: Yup.string().required('Cancel TD Number is required'),
      Effectivity: Yup.string().required('Effectivity is required'),
      OwnerPrevious: Yup.string().required('Owner Previous is required'),
      PreviousAssessedValue: Yup.number().required(
        'Previous Assessed Value is required'
      ),
      KindofProperty: Yup.string().required('Kind of Property is required'),
      Storeys: Yup.string().required('Number of Storeys is required'),
      Description: Yup.string().required('Description is required'),
      kind: Yup.string().required('Kind is required'),
      ActualUse: Yup.string().required('Actual Use is required'),
      Classification: Yup.string().required('Classification is required'),
      AreaSize: Yup.string().required('Area Size is required'),
      AssessmentLevel: Yup.string().required('Assessment Level is required'),
      MarketValue: Yup.string().required('Market Value is required'),
      AmountInWords: Yup.string().required('Amount in Words is required'),
      Memoranda: Yup.string().required('Memoranda is required'),
      // If you have an array of assessmentRows:
      assessmentRows: Yup.array().of(
        Yup.object().shape({
          Kind: Yup.string().required('Kind is required'),
          Classification: Yup.string().required('Classification is required'),
          Area: Yup.string().required('Area is required'),
          MarketValue: Yup.string().required('Market Value is required'),
          ActualUse: Yup.string().required('Actual Use is required'),
          AssessmentLevel: Yup.string().required(
            'Assessment Level is required'
          ),
          AssessmentValue: Yup.string().required(
            'Assessment Value is required'
          ),
        })
      ),
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
      ? initialData.AssessmentRows.map((row) => ({ ...row })) // clone to prevent mutation issues
      : [
          {
            Kind: '',
            Classification: '',
            Area: '',
            MarketValue: '',
            ActualUse: '',
            AssessmentLevel: '',
            AssessmentValue: '',
          },
        ]
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
  console.log(errors);
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          required
          label="TD No."
          name="T_D_No"
          type="number"
          {...{
            value: values.T_D_No,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.T_D_No && errors.T_D_No,
            touched: touched.T_D_No,
          }}
        />
        <FormField
          required
          label="Property Identification No."
          name="PropertyID"
          type="number"
          {...{
            value: values.PropertyID,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.PropertyID && errors.PropertyID,
            touched: touched.PropertyID,
          }}
        />
      </div>

      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300">
        <FormField
          label="Owner"
          name="OwnerID"
          type="select"
          required
          options={customers.map((customer) => ({
            value: customer.ID,
            label:
              customer.Name ||
              `${customer.FirstName} (${customer.MiddleName} ${customer.LastName})`,
          }))}
          {...{
            value: values.OwnerID,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.OwnerID && errors.OwnerID,
            touched: touched.OwnerID,
          }}
        />
        <FormField
          label="TIN"
          name="OwnerTIN"
          type="number"
          required
          {...{
            value: values.OwnerTIN,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.OwnerTIN && errors.OwnerTIN,
            touched: touched.OwnerTIN,
          }}
        />
        <FormField
          label="Owner Telephone No."
          name="OwnerTelephoneNumber"
          type="number"
          required
          {...{
            value: values.OwnerTelephoneNumber,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.OwnerTelephoneNumber && errors.OwnerTelephoneNumber,
            touched: touched.OwnerTelephoneNumber,
          }}
        />
        <FormField
          label="Address"
          name="OwnerAddress"
          type="text"
          required
          {...{
            value: values.OwnerAddress,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.OwnerAddress && errors.OwnerAddress,
            touched: touched.OwnerAddress,
          }}
        />
      </fieldset>

      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300">
        <FormField
          label="Beneficial/Administrator User"
          options={customers.map((customer) => ({
            value: customer.ID,
            label:
              customer.Name ||
              `${customer.FirstName} (${customer.MiddleName} ${customer.LastName})`,
          }))}
          name="BeneficialorAdminUserID"
          type="select"
          required
          {...{
            value: values.BeneficialorAdminUserID,
            onChange: handleChange,
            onBlur: handleBlur,
            error:
              touched.BeneficialorAdminUserID && errors.BeneficialorAdminUserID,
            touched: touched.BeneficialorAdminUserID,
          }}
        />
        <FormField
          label="Beneficial/Admin User TIN"
          name="BeneficialorAdminTIN"
          type="number"
          required
          {...{
            value: values.BeneficialorAdminTIN,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.BeneficialorAdminTIN && errors.BeneficialorAdminTIN,
            touched: touched.BeneficialorAdminTIN,
          }}
        />
        <FormField
          label="Beneficial/Administrator Telephone No."
          name="BeneficialorAdminTelephoneNumber"
          type="number"
          required
          {...{
            value: values.BeneficialorAdminTelephoneNumber,
            onChange: handleChange,
            onBlur: handleBlur,
            error:
              touched.BeneficialorAdminTelephoneNumber &&
              errors.BeneficialorAdminTelephoneNumber,
            touched: touched.BeneficialorAdminTelephoneNumber,
          }}
        />
        <FormField
          label="Beneficial/Administrator Address"
          name="BeneficialorAdminAddress"
          type="text"
          required
          {...{
            value: values.BeneficialorAdminAddress,
            onChange: handleChange,
            onBlur: handleBlur,
            error:
              touched.BeneficialorAdminAddress &&
              errors.BeneficialorAdminAddress,
            touched: touched.BeneficialorAdminAddress,
          }}
        />
      </fieldset>

      <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-300">
        <FormField
          label="OCT/TCTCLOA No."
          name="OCT_TCT_CLOA_Number"
          type="number"
          required
          {...{
            value: values.OCT_TCT_CLOA_Number,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.OCT_TCT_CLOA_Number && errors.OCT_TCT_CLOA_Number,
            touched: touched.OCT_TCT_CLOA_Number,
          }}
        />
        <FormField
          label="Survey No."
          name="SurveyNumber"
          type="number"
          required
          {...{
            value: values.SurveyNumber,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.SurveyNumber && errors.SurveyNumber,
            touched: touched.SurveyNumber,
          }}
        />
        <FormField
          label="Lot No."
          name="LotNumber"
          type="text"
          required
          {...{
            value: values.LotNumber,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.LotNumber && errors.LotNumber,
            touched: touched.LotNumber,
          }}
        />
        <FormField
          label="CCT"
          name="CCT"
          type="text"
          required
          {...{
            value: values.CCT,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.CCT && errors.CCT,
            touched: touched.CCT,
          }}
        />
        <FormField
          label="Block No."
          name="BlockNumber"
          type="text"
          required
          {...{
            value: values.BlockNumber,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.BlockNumber && errors.BlockNumber,
            touched: touched.BlockNumber,
          }}
        />
        <FormField
          label="Dated"
          name="Dated"
          type="date"
          required
          {...{
            value: values.Dated,
            onChange: handleChange,
            onBlur: handleBlur,
            error: touched.Dated && errors.Dated,
            touched: touched.Dated,
          }}
        />
      </fieldset>

      {/* Boundaries and Taxable */}
      <div className="p-4 border border-gray-300">
        <h3 className="text-lg font-semibold mb-4">Boundaries:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="North"
            name="North"
            type="text"
            required
            value={values.North}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.North && errors.North}
            touched={touched.North}
          />
          <FormField
            label="South"
            name="South"
            type="text"
            required
            value={values.South}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.South && errors.South}
            touched={touched.South}
          />
          <FormField
            label="East"
            name="East"
            type="text"
            required
            value={values.East}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.East && errors.East}
            touched={touched.East}
          />
          <FormField
            label="West"
            name="West"
            type="text"
            required
            value={values.West}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.West && errors.West}
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
          {/* <label className="block text-sm font-medium mb-1">
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
            TODO: Populate dynamically if needed
            <option value="1">TD 1</option>
            <option value="2">TD 2</option>
            <option value="3">TD 3</option>
          </select> */}
          <FormField
            type="select"
            name="CancelTDNumber"
            placeholder="Cancel TD No."
            label={'This Declaration cancels TD No.'}
            options={['1', '2', '3'].map((option) => ({
              label: option,
              value: option,
            }))}
            required
            value={values.CancelTDNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.CancelTDNumber && errors.CancelTDNumber}
            touched={touched.CancelTDNumber}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <FormField
            type="text"
            name="Effectivity"
            placeholder="Effectivity of Assessment/Reassessment"
            label={'Effectivity of Assessment/Reassessment'}
            required
            value={values.Effectivity}
            onChange={handleChange}
            error={touched.Effectivity && errors.Effectivity}
            touched={touched.Effectivity}
            onBlur={handleBlur}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <FormField
            type="text"
            name="OwnerPrevious"
            placeholder="Previous Owner"
            label={'Previous Owner'}
            required
            value={values.OwnerPrevious}
            error={touched.OwnerPrevious && errors.OwnerPrevious}
            touched={touched.OwnerPrevious}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <FormField
            type="number"
            name="PreviousAssessedValue"
            placeholder=" Previous Assessed Value:"
            label={'Previous Assessed Value:'}
            value={values.PreviousAssessedValue}
            error={
              touched.PreviousAssessedValue && errors.PreviousAssessedValue
            }
            touched={touched.PreviousAssessedValue}
            onChange={handleChange}
            required
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
            required
            error={touched.KindofProperty && errors.KindofProperty}
            touched={touched.KindofProperty}
          />
          <FormField
            label="Number of Storeys"
            name="Storeys"
            type="number"
            value={values.Storeys}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            error={touched.Storeys && errors.Storeys}
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
          error={touched.Description && errors.Description}
          required
          touched={touched.Description}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300">
        <div>
          <FormField
            // className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            label="Kind: (LAND / BUILDING)"
            name="kind"
            type="select"
            required
            value={values.kind}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.kind && errors.kind}
            touched={touched.kind}
            options={['LAND', 'BUILDING'].map((option) => ({
              label: option,
              value: option,
            }))}
          />

          {/* <label className="block text-sm font-medium mb-1">Kind:</label>
          <select
            name="kind"
            value={values.kind}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Kind</option>
            <option value="LAND">LAND</option>
            <option value="BUILDING">BUILDING</option>
          </select> */}
        </div>

        <div>
          {/* <label className="block text-sm font-medium mb-1">Actual Use:</label>
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
          </select> */}
          <FormField
            label="Actual Use"
            name="ActualUse"
            type="select"
            required
            value={values.ActualUse}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.ActualUse && errors.ActualUse}
            touched={touched.ActualUse}
            options={['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL'].map(
              (option) => ({
                label: option,
                value: option,
              })
            )}
          />
        </div>

        <div>
          {/* <label className="block text-sm font-medium mb-1">
            Classification:
          </label>
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
          </select> */}
          <FormField
            label="Classification"
            name="Classification"
            type="select"
            required
            value={values.Classification}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.Classification && errors.Classification}
            touched={touched.Classification}
            options={['A', 'B', 'C'].map((option) => ({
              label: option,
              value: option,
            }))}
          />
        </div>

        <div>
          <FormField
            type="text"
            name="AreaSize"
            placeholder="Enter Area Size"
            label={'Area Size'}
            required
            value={values.AreaSize}
            onBlur={handleBlur}
            error={touched.AreaSize && errors.AreaSize}
            touched={touched.AreaSize}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <FormField
            type="number"
            name="AssessmentLevel"
            label={'Assessment Level'}
            placeholder="Enter Assessment Level"
            required
            value={values.AssessmentLevel}
            onBlur={handleBlur}
            error={touched.AssessmentLevel && errors.AssessmentLevel}
            touched={touched.AssessmentLevel}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <FormField
            placeholder="Enter Market Value"
            type="number"
            name="MarketValue"
            label={'Market Value'}
            value={values.MarketValue}
            onBlur={handleBlur}
            error={touched.MarketValue && errors.MarketValue}
            touched={touched.MarketValue}
            required
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
                {[
                  'Kind',
                  'Classification',
                  'Area ',
                  'Market Value',
                  'Actual Use',
                  'Assessment Level',
                  'Assessment Value',
                  'Actions',
                ].map((th) => (
                  <th key={th} className="border border-gray-300 p-2 text-sm">
                    {th} <span className="text-red-500">*</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assessmentRows.map((row, index) => (
                <tr key={index}>
                  {[
                    'Kind',
                    'Classification',
                    'Area',
                    'MarketValue',
                    'ActualUse',
                    'AssessmentLevel',
                    'AssessmentValue',
                  ].map((field) => (
                    <td key={field} className="border border-gray-300 p-1">
                      <FormField
                        type="text"
                        value={row[field]}
                        onChange={(e) =>
                          handleAssessmentChange(index, field, e.target.value)
                        }
                        onBlur={handleBlur}
                        error={
                          touched.assessmentRows?.[index]?.[field] &&
                          errors.assessmentRows?.[index]?.[field]
                        }
                        touched={touched.assessmentRows?.[index]?.[field]}
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
          {errors?.assessmentRows?.length > 0 && (
            <p className="text-red-500 text-sm mt-2">
              At Least One Row Required{' '}
            </p>
          )}
        </div>
      </div>

      {/* Footer Sections */}
      <div className="p-4 border border-gray-300">
        <label className="block text-sm font-medium mb-1">
          Amounts in Words:
        </label>
        <textarea
          name="AmountInWords"
          value={values.AmountInWords}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.AmountInWords && errors.AmountInWords}
          touched={touched.AmountInWords}
          rows="2"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="p-4 border border-gray-300">
        <label className="block text-sm font-medium mb-1 bg-red-100 p-2">
          Memoranda:
        </label>
        <textarea
          name="Memoranda"
          value={values.Memoranda}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.Memoranda && errors.Memoranda}
          touched={touched.Memoranda}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onClose} className="btn btn-outline">
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          // disabled={isSubmitting}
        >
          {/* {isSubmitting ? 'Saving...' : 'Save'} */}
          save
        </button>
      </div>
    </form>
  );
}

export default TaxDeclarationForm;
