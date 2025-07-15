import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';

import { fetchRegions } from '../../features/settings/regionsSlice';
import { fetchProvinces } from '../../features/settings/provincesSlice';
import { fetchMunicipalities } from '../../features/settings/municipalitiesSlice';
import { fetchBarangays } from '../../features/settings/barangaysSlice';

function CustomerForm({ initialData, onSubmit, onClose }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRegions());
    dispatch(fetchProvinces());
    dispatch(fetchMunicipalities());
    dispatch(fetchBarangays());
  }, [dispatch]);

  const { regions } = useSelector((state) => state.regions);
  const { provinces } = useSelector((state) => state.provinces);
  const { municipalities } = useSelector((state) => state.municipalities);
  const { barangays } = useSelector((state) => state.barangays);

  const validationSchema = Yup.object({
    FirstName: Yup.string().required('First Name is required'),
    MiddleName: Yup.string(),
    LastName: Yup.string().required('Last Name is required'),
    Gender: Yup.string().required('Gender is required'),
    Citizenship: Yup.string().required('Citizenship is required'),
    DateOfBirth: Yup.date().required('Date of Birth is required'),
    PlaceOfBirth: Yup.string().required('Place of Birth is required'),
    Occupation: Yup.string().required('Occupation is required'),
    CivilStatus: Yup.string().required('Civil Status is required'),
    TIN: Yup.string().required('TIN is required'),
    EmailAddress: Yup.string().email().required('Email is required'),
    RegionID: Yup.string().required('Region is required'),
    ProvinceID: Yup.string().required('Province is required'),
    MunicipalityID: Yup.string().required('Municipality is required'),
    BarangayID: Yup.string().required('Barangay is required'),
    ZIPCode: Yup.string().required('ZIP Code is required'),
    StreetAddress: Yup.string().required('Street Address is required'),
    RDO: Yup.string().required('RDO is required'),
  });

  const formik = useFormik({
    initialValues: initialData || {
      FirstName: '',
      MiddleName: '',
      LastName: '',
      Gender: '',
      Citizenship: '',
      DateOfBirth: '',
      PlaceOfBirth: '',
      Occupation: '',
      CivilStatus: '',
      TIN: '',
      EmailAddress: '',
      RegionID: '',
      ProvinceID: '',
      MunicipalityID: '',
      BarangayID: '',
      ZIPCode: '',
      StreetAddress: '',
      RDO: '',
    },
    validationSchema,
    onSubmit: onSubmit,
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
          label="First Name"
          name="FirstName"
          value={values.FirstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.FirstName}
          touched={touched.FirstName}
          required
        />
        <FormField
          label="Middle Name"
          name="MiddleName"
          value={values.MiddleName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.MiddleName}
          touched={touched.MiddleName}
        />
        <FormField
          label="Last Name"
          name="LastName"
          value={values.LastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.LastName}
          touched={touched.LastName}
          required
        />
        <FormField
          label="Gender"
          name="Gender"
          type="select"
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Other', label: 'Other' },
          ]}
          value={values.Gender}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.Gender}
          touched={touched.Gender}
          required
        />
        <FormField
          label="Citizenship"
          name="Citizenship"
          value={values.Citizenship}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.Citizenship}
          touched={touched.Citizenship}
          required
        />
        <FormField
          label="Date of Birth"
          name="DateOfBirth"
          type="date"
          value={values.DateOfBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.DateOfBirth}
          touched={touched.DateOfBirth}
          required
        />
        <FormField
          label="Place of Birth"
          name="PlaceOfBirth"
          value={values.PlaceOfBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.PlaceOfBirth}
          touched={touched.PlaceOfBirth}
          required
        />
        <FormField
          label="Occupation"
          name="Occupation"
          value={values.Occupation}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.Occupation}
          touched={touched.Occupation}
          required
        />
        <FormField
          label="Civil Status"
          name="CivilStatus"
          type="select"
          options={[
            { value: 'Single', label: 'Single' },
            { value: 'Married', label: 'Married' },
            { value: 'Widowed', label: 'Widowed' },
            { value: 'Separated', label: 'Separated' },
            { value: 'Divorced', label: 'Divorced' },
          ]}
          value={values.CivilStatus}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.CivilStatus}
          touched={touched.CivilStatus}
          required
        />
        <FormField
          label="TIN"
          name="TIN"
          value={values.TIN}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.TIN}
          touched={touched.TIN}
          required
        />
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
          label="Region"
          name="RegionID"
          type="select"
          options={regions.map((r) => ({ value: r.ID, label: r.Name }))}
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
          options={provinces.map((p) => ({ value: p.ID, label: p.Name }))}
          value={values.ProvinceID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.ProvinceID}
          touched={touched.ProvinceID}
          required
        />
        <FormField
          label="Municipality"
          name="MunicipalityID"
          type="select"
          options={municipalities.map((m) => ({ value: m.ID, label: m.Name }))}
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
          options={barangays.map((b) => ({ value: b.ID, label: b.Name }))}
          value={values.BarangayID}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.BarangayID}
          touched={touched.BarangayID}
          required
        />
        <FormField
          label="ZIP Code"
          name="ZIPCode"
          value={values.ZIPCode}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.ZIPCode}
          touched={touched.ZIPCode}
          required
        />
        <FormField
          label="Street Address"
          name="StreetAddress"
          type="textarea"
          rows={2}
          value={values.StreetAddress}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.StreetAddress}
          touched={touched.StreetAddress}
          required
        />
        <FormField
          label="Revenue District Office"
          name="RDO"
          value={values.RDO}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.RDO}
          touched={touched.RDO}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onClose} className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;
