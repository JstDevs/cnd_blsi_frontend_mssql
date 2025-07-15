import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useEffect } from 'react';

function VendorDetailsForm({
  initialData,
  onSubmit,
  onClose,
  provinces = [],
  municipalities = [],
  barangays = [],
  regionOptions = [],
  provinceOptions = [],
  municipalityOptions = [],
  barangayOptions = [],
  industryOptions = [],
  taxCodeOptions = [],
  vendorTypeOptions = [],
  paymentTermsOptions = [],
  modeOfPaymentOptions = [],
}) {
  const validationSchema = Yup.object({
    Code: Yup.string().required('Code is required'),
    TIN: Yup.string().required('TIN is required'),
    Name: Yup.string().required('Name is required'),
    PhoneNumber: Yup.string(),
    MobileNumber: Yup.string().required('Mobile number is required'),
    EmailAddress: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    Website: Yup.string(),
    RegionID: Yup.string().required('Region is required'),
    ProvinceID: Yup.string().required('Province is required'),
    MunicipalityID: Yup.string().required('Municipality is required'),
    BarangayID: Yup.string().required('Barangay is required'),
    StreetAddress: Yup.string().required('Street address is required'),
    ZIPCode: Yup.string().required('Zip code is required'),
    TypeID: Yup.string().required('Vendor type is required'),
    RDO: Yup.string().required('Revenue District Office is required'),
    IndustryTypeID: Yup.string().required('Industry is required'),
    TaxCodeID: Yup.string().required('Tax code is required'),
    PaymentTermsID: Yup.string().required('Payment terms are required'),
    Vatable: Yup.boolean(),
    PaymentMethodID: Yup.string().required('Mode of payment is required'),
    ContactPerson: Yup.string().required('Contact person is required'),
    DeliveryLeadTime: Yup.number()
      .required('Delivery lead time is required')
      .typeError('Must be a number'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      Code: '',
      TIN: '',
      Name: '',
      PhoneNumber: '',
      MobileNumber: '',
      EmailAddress: '',
      Website: '',
      RegionID: '',
      ProvinceID: '',
      MunicipalityID: '',
      BarangayID: '',
      StreetAddress: '',
      ZIPCode: '',
      TypeID: '',
      RDO: '',
      IndustryTypeID: '',
      TaxCodeID: '',
      PaymentTermsID: '',
      Vatable: false,
      PaymentMethodID: '',
      ContactPerson: '',
      DeliveryLeadTime: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const { values, handleChange, handleBlur, errors, touched, setFieldValue } =
    formik;
  useEffect(() => {
    const selectedBarangay = barangays.find(
      (b) => b.ID.toString() === values.BarangayID
    );
    if (selectedBarangay) {
      if (selectedBarangay.MunicipalityCode)
        setFieldValue('MunicipalityID', selectedBarangay.MunicipalityCode);
      if (selectedBarangay.ProvinceCode)
        setFieldValue('ProvinceID', selectedBarangay.ProvinceCode);
      if (selectedBarangay.RegionCode)
        setFieldValue('RegionID', selectedBarangay.RegionCode);
    }
  }, [values.BarangayID]);

  useEffect(() => {
    const selectedMunicipality = municipalities.find(
      (m) => m.ID.toString() === values.MunicipalityID
    );
    if (selectedMunicipality) {
      if (selectedMunicipality.ProvinceCode)
        setFieldValue('ProvinceID', selectedMunicipality.ProvinceCode);
      if (selectedMunicipality.RegionCode)
        setFieldValue('RegionID', selectedMunicipality.RegionCode);
    }
  }, [values.MunicipalityID]);

  useEffect(() => {
    const selectedProvince = provinces.find(
      (p) => p.ID.toString() === values.ProvinceID
    );
    if (selectedProvince && selectedProvince.RegionCode)
      setFieldValue('RegionID', selectedProvince.RegionCode);
  }, [values.ProvinceID]);
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Code"
          name="Code"
          type="text"
          value={values.Code}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.Code}
          touched={touched.Code}
          required
        />
        <FormField
          label="TIN"
          name="TIN"
          type="text"
          value={values.TIN}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.TIN}
          touched={touched.TIN}
          required
        />
      </div>

      <FormField
        label="Name"
        name="Name"
        type="text"
        value={values.Name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.Name}
        touched={touched.Name}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Phone Number"
          name="PhoneNumber"
          type="text"
          value={values.PhoneNumber}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <FormField
          label="Mobile Number"
          name="MobileNumber"
          type="text"
          value={values.MobileNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.MobileNumber}
          touched={touched.MobileNumber}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Email"
          name="EmailAddress"
          type="email"
          value={values.EmailAddress}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.EmailAddress}
          touched={touched.EmailAddress}
          required
        />
        <FormField
          label="Website"
          name="Website"
          type="text"
          value={values.Website}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Region"
          name="RegionID"
          type="select"
          options={regionOptions}
          value={values.RegionID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.RegionID}
          touched={touched.RegionID}
          required
        />
        <FormField
          label="Province"
          name="ProvinceID"
          type="select"
          options={provinceOptions}
          value={values.ProvinceID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.ProvinceID}
          touched={touched.ProvinceID}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Municipality"
          name="MunicipalityID"
          type="select"
          options={municipalityOptions}
          value={values.MunicipalityID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.MunicipalityID}
          touched={touched.MunicipalityID}
          required
        />
        <FormField
          label="Barangay"
          name="BarangayID"
          type="select"
          options={barangayOptions}
          value={values.BarangayID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.BarangayID}
          touched={touched.BarangayID}
          required
        />
      </div>

      <FormField
        label="Street Address"
        name="StreetAddress"
        type="textarea"
        value={values.StreetAddress}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.StreetAddress}
        touched={touched.StreetAddress}
        required
      />

      <FormField
        label="Zip Code"
        name="ZIPCode"
        type="text"
        value={values.ZIPCode}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.ZIPCode}
        touched={touched.ZIPCode}
        required
      />

      <hr className="border-t border-neutral-300 my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Vendor Type"
          name="TypeID"
          type="select"
          options={vendorTypeOptions}
          value={values.TypeID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.TypeID}
          touched={touched.TypeID}
          required
        />
        <FormField
          label="Revenue District Office"
          name="RDO"
          type="text"
          value={values.RDO}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.RDO}
          touched={touched.RDO}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Industry"
          name="IndustryTypeID"
          type="select"
          options={industryOptions}
          value={values.IndustryTypeID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.IndustryTypeID}
          touched={touched.IndustryTypeID}
          required
        />
        <FormField
          label="Tax Code"
          name="TaxCodeID"
          type="select"
          options={taxCodeOptions}
          value={values.TaxCodeID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.TaxCodeID}
          touched={touched.TaxCodeID}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Payment Terms"
          name="PaymentTermsID"
          type="select"
          options={paymentTermsOptions}
          value={values.PaymentTermsID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.PaymentTermsID}
          touched={touched.PaymentTermsID}
          required
        />
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            name="Vatable"
            checked={values.Vatable}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <label htmlFor="Vatable">Vatable</label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Mode of Payment"
          name="PaymentMethodID"
          type="select"
          options={modeOfPaymentOptions}
          value={values.PaymentMethodID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.PaymentMethodID}
          touched={touched.PaymentMethodID}
          required
        />
        <FormField
          label="Contact Person"
          name="ContactPerson"
          type="text"
          value={values.ContactPerson}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.ContactPerson}
          touched={touched.ContactPerson}
          required
        />
      </div>

      <FormField
        label="Delivery Lead Time (days)"
        name="DeliveryLeadTime"
        type="number"
        value={values.DeliveryLeadTime}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.DeliveryLeadTime}
        touched={touched.DeliveryLeadTime}
        required
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
        <button type="button" onClick={onClose} className="btn btn-outline">
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default VendorDetailsForm;
