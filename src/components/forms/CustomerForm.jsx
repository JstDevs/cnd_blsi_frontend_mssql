import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

import { fetchRegions } from '../../features/settings/regionsSlice';
import { fetchProvinces } from '../../features/settings/provincesSlice';
import { fetchMunicipalities } from '../../features/settings/municipalitiesSlice';
import { fetchBarangays } from '../../features/settings/barangaysSlice';
import { fetchIndustries } from '../../features/settings/industrySlice';
import { fetchTaxCodes } from '../../features/settings/taxCodeSlice';
import { fetchPaymentTerms } from '../../features/settings/paymentTermsSlice';
import { fetchModeOfPayments } from '../../features/settings/modeOfPaymentSlice';

function CustomerForm({ initialData, onSubmit, onClose }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRegions());
    dispatch(fetchProvinces());
    dispatch(fetchMunicipalities());
    dispatch(fetchBarangays());
    dispatch(fetchIndustries());
    dispatch(fetchTaxCodes());
    dispatch(fetchPaymentTerms());
    dispatch(fetchModeOfPayments());
  }, [dispatch]);

  const { regions } = useSelector((state) => state.regions);
  const { provinces } = useSelector((state) => state.provinces);
  const { municipalities } = useSelector((state) => state.municipalities);
  const { barangays } = useSelector((state) => state.barangays);
  const { industries } = useSelector((state) => state.industries);
  const { taxCodes } = useSelector((state) => state.taxCodes);
  const { paymentTerms } = useSelector((state) => state.paymentTerms);
  const { modeOfPayments } = useSelector((state) => state.modeOfPayments);

  const validationSchema = Yup.object({
    Code: Yup.string().required('Code is required'),
    Name: Yup.string().required('Name is required'),
    TIN: Yup.string().required('TIN is required'),
    PhoneNumber: Yup.string().required('Phone Number is required'),
    MobileNumber: Yup.string().required('Mobile Number is required'),
    EmailAddress: Yup.string().email().required('Email is required'),
    Website: Yup.string().required('Website is required'),
    RegionID: Yup.string().required('Region is required'),
    ProvinceID: Yup.string().required('Province is required'),
    MunicipalityID: Yup.string().required('Municipality is required'),
    BarangayID: Yup.string().required('Barangay is required'),
    ZIPCode: Yup.string().required('ZIP Code is required'),
    StreetAddress: Yup.string().required('Street Address is required'),
    RDO: Yup.string().required('RDO is required'),
    PlaceofIncorporation: Yup.string().required('Place of Incorporation is required'),
    TaxCodeID: Yup.string().required('Tax Code is required'),
    IndustryTypeID: Yup.string().required('Industry is required'),
    PaymentTermsID: Yup.string().required('Payment Terms is required'),
    PaymentMethodID: Yup.string().required('Payment Method is required'),
    ContactPerson: Yup.string().required('Contact Person is required'),
    DateofRegistration: Yup.date().required('Date of Registration is required'),
    KindofOrganization: Yup.string().required('Kind of Organization is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      Code: '',
      Name: '',
      TIN: '',
      PhoneNumber: '',
      MobileNumber: '',
      EmailAddress: '',
      Website: '',
      RegionID: '',
      ProvinceID: '',
      MunicipalityID: '',
      BarangayID: '',
      ZIPCode: '',
      StreetAddress: '',
      RDO: '',
      PlaceofIncorporation: '',
      TaxCodeID: '',
      IndustryTypeID: '',
      PaymentTermsID: '',
      PaymentMethodID: '',
      ContactPerson: '',
      DateofRegistration: '',
      KindofOrganization: '',
    },
    validationSchema,
    onSubmit: onSubmit,
  });

  const { values, handleChange, handleBlur, errors, touched } = formik;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Code" name="Code" value={values.Code} onChange={handleChange} onBlur={handleBlur} error={errors.Code} touched={touched.Code} required />
        <FormField label="TIN" name="TIN" value={values.TIN} onChange={handleChange} onBlur={handleBlur} error={errors.TIN} touched={touched.TIN} required />
        <FormField label="Phone Number" name="PhoneNumber" value={values.PhoneNumber} onChange={handleChange} onBlur={handleBlur} error={errors.PhoneNumber} touched={touched.PhoneNumber} required />
        <FormField label="Mobile Number" name="MobileNumber" value={values.MobileNumber} onChange={handleChange} onBlur={handleBlur} error={errors.MobileNumber} touched={touched.MobileNumber} required />
        <FormField label="Name" name="Name" value={values.Name} onChange={handleChange} onBlur={handleBlur} error={errors.Name} touched={touched.Name} required />
        <FormField label="Email" name="EmailAddress" type="email" value={values.EmailAddress} onChange={handleChange} onBlur={handleBlur} error={errors.EmailAddress} touched={touched.EmailAddress} required />
        <FormField label="Website" name="Website" value={values.Website} onChange={handleChange} onBlur={handleBlur} error={errors.Website} touched={touched.Website} required />
        <FormField label="Region" name="RegionID" type="select" options={regions.map(r => ({ value: r.ID, label: r.Name }))} value={values.RegionID} onChange={handleChange} onBlur={handleBlur} error={errors.RegionID} touched={touched.RegionID} required />
        <FormField label="Province" name="ProvinceID" type="select" options={provinces.map(p => ({ value: p.ID, label: p.Name }))} value={values.ProvinceID} onChange={handleChange} onBlur={handleBlur} error={errors.ProvinceID} touched={touched.ProvinceID} required />
        <FormField label="Municipality" name="MunicipalityID" type="select" options={municipalities.map(m => ({ value: m.ID, label: m.Name }))} value={values.MunicipalityID} onChange={handleChange} onBlur={handleBlur} error={errors.MunicipalityID} touched={touched.MunicipalityID} required />
        <FormField label="Barangay" name="BarangayID" type="select" options={barangays.map(b => ({ value: b.ID, label: b.Name }))} value={values.BarangayID} onChange={handleChange} onBlur={handleBlur} error={errors.BarangayID} touched={touched.BarangayID} required />
        <FormField label="ZIP Code" name="ZIPCode" value={values.ZIPCode} onChange={handleChange} onBlur={handleBlur} error={errors.ZIPCode} touched={touched.ZIPCode} required />
        <FormField label="Street Address" name="StreetAddress" type="textarea" rows={2} value={values.StreetAddress} onChange={handleChange} onBlur={handleBlur} error={errors.StreetAddress} touched={touched.StreetAddress} required />
        <FormField label="Revenue District Office" name="RDO" value={values.RDO} onChange={handleChange} onBlur={handleBlur} error={errors.RDO} touched={touched.RDO} required />
        <FormField label="Place of Incorporation" name="PlaceofIncorporation" value={values.PlaceofIncorporation} onChange={handleChange} onBlur={handleBlur} error={errors.PlaceofIncorporation} touched={touched.PlaceofIncorporation} required />
        <FormField label="Tax Code" name="TaxCodeID" type="select" options={taxCodes.map(tc => ({ value: tc.ID, label: tc.Name }))} value={values.TaxCodeID} onChange={handleChange} onBlur={handleBlur} error={errors.TaxCodeID} touched={touched.TaxCodeID} required />
        <FormField label="Industry" name="IndustryTypeID" type="select" options={industries.map(i => ({ value: i.ID, label: i.Name }))} value={values.IndustryTypeID} onChange={handleChange} onBlur={handleBlur} error={errors.IndustryTypeID} touched={touched.IndustryTypeID} required />
        <FormField label="Payment Terms" name="PaymentTermsID" type="select" options={paymentTerms.map(pt => ({ value: pt.ID, label: pt.Name }))} value={values.PaymentTermsID} onChange={handleChange} onBlur={handleBlur} error={errors.PaymentTermsID} touched={touched.PaymentTermsID} required />
        <FormField label="Mode of Payment" name="PaymentMethodID" type="select" options={modeOfPayments.map(pm => ({ value: pm.ID, label: pm.Name }))} value={values.PaymentMethodID} onChange={handleChange} onBlur={handleBlur} error={errors.PaymentMethodID} touched={touched.PaymentMethodID} required />
        <FormField label="Contact Person" name="ContactPerson" value={values.ContactPerson} onChange={handleChange} onBlur={handleBlur} error={errors.ContactPerson} touched={touched.ContactPerson} required />
        <FormField label="Date of Registration" name="DateofRegistration" type="date" value={values.DateofRegistration} onChange={handleChange} onBlur={handleBlur} error={errors.DateofRegistration} touched={touched.DateofRegistration} required />
        <FormField label="Kind of Organization" name="KindofOrganization" type="select" options={[
          { value: "Association", label: "Association" },
          { value: "Partnership", label: "Partnership" },
          { value: "Corporation", label: "Corporation" },
        ]} value={values.KindofOrganization} onChange={handleChange} onBlur={handleBlur} error={errors.KindofOrganization} touched={touched.KindofOrganization} required />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}

export default CustomerForm;
