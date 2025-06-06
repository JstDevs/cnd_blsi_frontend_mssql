import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

// Validation schema
const realPropertyTaxSchema = Yup.object().shape({
  tdNo: Yup.string().required('TD No. is required'),
  owner: Yup.string().required('Owner is required'),
  address: Yup.string().required('Address is required'),
  beneficialUser: Yup.string().required('Beneficial/Administrator User is required'),
  beneficialAddress: Yup.string().required('Beneficial/Administrator address is required'),
  octTctCloaNo: Yup.string().required('OCT/TCT/CLOA No. is required'),
  cct: Yup.string().required('CCT is required'),
  dated: Yup.date().required('Date is required'),
  propertyIdentificationNo: Yup.number().required('Property Identification No. is required'),
  tin: Yup.string().required('TIN is required'),
  ownerTelephoneNo: Yup.number().required('Owner Telephone No. is required'),
  beneficialTin: Yup.string().required('Beneficial/Admin User TIN is required'),
  beneficialTelephoneNo: Yup.number().required('Beneficial/Administrator Telephone No. is required'),
  surveyNo: Yup.string().required('Survey No. is required'),
  lotNo: Yup.string().required('Lot No. is required'),
  blockNo: Yup.string().required('Block No. is required'),
  boundaries: Yup.object().shape({
    taxable: Yup.boolean(),
    north: Yup.string().required('North boundary is required'),
    south: Yup.string().required('South boundary is required'),
    east: Yup.string().required('East boundary is required'),
    west: Yup.string().required('West boundary is required'),
  }),
  cancelledTdNo: Yup.string().required('This Declaration cancels TD no. is required'),
  cancelledOwner: Yup.string().required('Owner is required'),
  effectivityOfAssessment: Yup.string().required('Effectivity of Assessment/Reassessment is required'),
  previousOwner: Yup.string().required('Owner is required'),
  previousAssessedValue: Yup.string().required('Previous Assessed Value is required'),
  propertyDetails: Yup.object().shape({
    kind: Yup.string().required('Kind is required'),
    numberOf: Yup.string().required('Number of is required'),
    description: Yup.string().required('Description is required'),
  }),
  assessmentDetails: Yup.object().shape({
    kind: Yup.string().required('Kind is required'),
    actualUse: Yup.string().required('Actual use is required'),
    classification: Yup.string().required('Classification is required'),
    areaSize: Yup.string().required('Area size is required'),
    assessmentLevel: Yup.string().required('Assessment level is required'),
    marketValue: Yup.string().required('Market value is required'),
  }),
});

function RealPropertyTaxForm({ initialData, onSubmit, onClose }) {
  const initialValues = {
    tdNo: '',
    owner: '',
    address: '',
    beneficialUser: '',
    beneficialAddress: '',
    octTctCloaNo: '',
    cct: '',
    dated: new Date().toISOString().split('T')[0],
    propertyIdentificationNo: '',
    tin: '',
    ownerTelephoneNo: '',
    beneficialTin: '',
    beneficialTelephoneNo: '',
    surveyNo: '',
    lotNo: '',
    blockNo: '',
    boundaries: {
      taxable: false,
      north: '',
      south: '',
      east: '',
      west: '',
    },
    cancelledTdNo: '',
    cancelledOwner: '',
    effectivityOfAssessment: '',
    previousOwner: '',
    previousAssessedValue: '',
    propertyDetails: {
      kind: '',
      numberOf: '',
      description: '',
    },
    assessmentDetails: {
      kind: '',
      actualUse: '',
      classification: '',
      areaSize: '',
      assessmentLevel: '',
      marketValue: '',
    },
    ...initialData,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={realPropertyTaxSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="TD No."
                name="tdNo"
                type="text"
                required
              />
              <FormField
                label="Owner"
                name="owner"
                type="select"
                required
                options={[
                  { value: 'individual', label: 'Individual' },
                  { value: 'corporation', label: 'Corporation' },
                ]}
              />
            </div>
            <FormField
              label="Address"
              name="address"
              type="text"
              required
            />
          </div>

          {/* Beneficial/Administrator Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Beneficial/Administrator Information</h3>
            <FormField
              label="Beneficial/Administrator User"
              name="beneficialUser"
              type="select"
              required
              options={[
                { value: 'individual', label: 'Individual' },
                { value: 'corporation', label: 'Corporation' },
              ]}
            />
            <FormField
              label="Beneficial/Administrator Address"
              name="beneficialAddress"
              type="text"
              required
            />
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Property Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="OCT/TCT/CLOA No."
                name="octTctCloaNo"
                type="text"
                required
              />
              <FormField
                label="CCT"
                name="cct"
                type="text"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Dated"
                name="dated"
                type="date"
                required
              />
              <FormField
                label="Property Identification No."
                name="propertyIdentificationNo"
                type="number"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="TIN"
                name="tin"
                type="text"
                required
              />
              <FormField
                label="Owner Telephone No."
                name="ownerTelephoneNo"
                type="number"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Beneficial/Admin User TIN"
                name="beneficialTin"
                type="text"
                required
              />
              <FormField
                label="Beneficial/Administrator Telephone No."
                name="beneficialTelephoneNo"
                type="number"
                required
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Location Details</h3>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                label="Survey No."
                name="surveyNo"
                type="text"
                required
              />
              <FormField
                label="Lot No."
                name="lotNo"
                type="text"
                required
              />
              <FormField
                label="Block No."
                name="blockNo"
                type="text"
                required
              />
            </div>
          </div>

          {/* Boundaries */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Boundaries</h3>
            <FormField
              label="Taxable"
              name="boundaries.taxable"
              type="checkbox"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="North"
                name="boundaries.north"
                type="text"
                required
              />
              <FormField
                label="South"
                name="boundaries.south"
                type="text"
                required
              />
              <FormField
                label="East"
                name="boundaries.east"
                type="text"
                required
              />
              <FormField
                label="West"
                name="boundaries.west"
                type="text"
                required
              />
            </div>
          </div>

          {/* Cancellation Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Cancellation Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="This Declaration cancels TD no."
                name="cancelledTdNo"
                type="select"
                required
                options={[
                  { value: 'td1', label: 'TD-001' },
                  { value: 'td2', label: 'TD-002' },
                ]}
              />
              <FormField
                label="Owner"
                name="cancelledOwner"
                type="text"
                required
              />
            </div>
            <FormField
              label="Effectivity of Assessment/Reassessment"
              name="effectivityOfAssessment"
              type="text"
              required
            />
          </div>

          {/* Previous Assessment */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Previous Assessment</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Owner"
                name="previousOwner"
                type="text"
                required
              />
              <FormField
                label="Previous Assessed Value"
                name="previousAssessedValue"
                type="text"
                required
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Property Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Kind"
                name="propertyDetails.kind"
                type="text"
                required
              />
              <FormField
                label="Number of"
                name="propertyDetails.numberOf"
                type="text"
                required
              />
            </div>
            <FormField
              label="Description"
              name="propertyDetails.description"
              type="textarea"
              required
            />
          </div>

          {/* Assessment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900">Assessment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Kind"
                name="assessmentDetails.kind"
                type="select"
                required
                options={[
                  { value: 'land', label: 'Land' },
                  { value: 'building', label: 'Building' },
                  { value: 'machinery', label: 'Machinery' },
                ]}
              />
              <FormField
                label="Actual Use"
                name="assessmentDetails.actualUse"
                type="select"
                required
                options={[
                  { value: 'residential', label: 'Residential' },
                  { value: 'commercial', label: 'Commercial' },
                  { value: 'industrial', label: 'Industrial' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Classification"
                name="assessmentDetails.classification"
                type="select"
                required
                options={[
                  { value: 'class1', label: 'Class 1' },
                  { value: 'class2', label: 'Class 2' },
                  { value: 'class3', label: 'Class 3' },
                ]}
              />
              <FormField
                label="Area Size"
                name="assessmentDetails.areaSize"
                type="select"
                required
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Assessment Level"
                name="assessmentDetails.assessmentLevel"
                type="text"
                required
              />
              <FormField
                label="Market Value"
                name="assessmentDetails.marketValue"
                type="text"
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default RealPropertyTaxForm; 