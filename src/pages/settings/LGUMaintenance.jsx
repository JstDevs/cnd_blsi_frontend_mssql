import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Building } from 'lucide-react';
import FormField from '../../components/common/FormField';
import { fetchBarangays } from '../../features/settings/barangaysSlice';
import { fetchMunicipalities } from '../../features/settings/municipalitiesSlice';
import { fetchProvinces } from '../../features/settings/provincesSlice';
import { fetchRegions } from '../../features/settings/regionsSlice';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

const LGUMaintenance = () => {
  const dispatch = useDispatch();
  const [logoFile, setLogoFile] = useState(null);
  // ---------------------USE MODULE PERMISSIONS------------------START (PpeSuppliersPage - MODULE ID = 96 )
  const { Edit } = useModulePermissions(58);
  useEffect(() => {
    dispatch(fetchBarangays());
    dispatch(fetchMunicipalities());
    dispatch(fetchProvinces());
    dispatch(fetchRegions());
    fetchLguData();
  }, [dispatch]);

  const API_URL = import.meta.env.VITE_API_URL;
  const fetchLguData = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/lgu`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch LGU data');
      }
      const data = await response.json();
      const extratedData = extraData(data);

      setLgu(extratedData);
      setImage(data.Logo || 'https://placehold.co/150x150?text=LGU+Logo');
    } catch (error) {
      console.error('Error loading LGU data:', error);
    }
  };
  const extraData = (data) => {
    const { BarangayID, MunicipalityID, ProvinceID, RegionID } = data;
    const BarangayName = barangays.find(
      (barangay) => barangay.ID === BarangayID
    )?.Name;
    const MunicipalityName = municipalities.find(
      (municipality) => municipality.ID === MunicipalityID
    )?.Name;
    const ProvinceName = provinces.find(
      (province) => province.ID === ProvinceID
    )?.Name;
    const RegionName = regions.find((region) => region.ID === RegionID)?.Name;
    data.BarangayName = BarangayName;
    data.MunicipalityName = MunicipalityName;
    data.ProvinceName = ProvinceName;
    data.RegionName = RegionName;
    return data;
  };
  // const updateLguData = async (values) => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     const response = await fetch(`${API_URL}/lgu/${values.ID}`, {
  //       method: "PUT", // or "PATCH"
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(values),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to update LGU");
  //     }

  //     const updated = await response.json();
  //     setLgu(updated);
  //     setImage(updated.LogoUrl || "https://placehold.co/150x150?text=LGU+Logo");
  //     return true;
  //   } catch (error) {
  //     console.error("Update error:", error);
  //     return false;
  //   }
  // };
  const updateLguData = async (values, file) => {
    try {
      const token = localStorage.getItem('token');

      const formData = new FormData();
      // Append fields
      Object.entries(values).forEach(([key, val]) => {
        formData.append(key, val);
      });

      // Append file (if selected)
      if (file) {
        formData.append('Logo', file);
      }

      const response = await fetch(`${API_URL}/lgu/${values.ID}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          // Do not manually set Content-Type!
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update LGU');
      }

      const updated = await response.json();
      setLgu(updated);
      setImage(updated.Logo || 'https://placehold.co/150x150?text=LGU+Logo');
      return true;
    } catch (error) {
      console.error('Update error:', error);
      return false;
    }
  };

  const { barangays } = useSelector((state) => state.barangays);
  const { municipalities } = useSelector((state) => state.municipalities);
  const { provinces } = useSelector((state) => state.provinces);
  const { regions } = useSelector((state) => state.regions);

  const [lgu, setLgu] = useState({
    ID: '1',
    Code: '',
    Name: '',
    TIN: '',
    RDO: '',
    StreetAddress: '',
    BarangayName: '',
    MunicipalityName: '',
    ProvinceName: '',
    RegionName: '',
    ZIPCode: '',
    PhoneNumber: '',
    EmailAddress: '',
    Website: '',
  });

  const [image, setImage] = useState(
    'https://placehold.co/150x150?text=LGU+Logo'
  );
  const [isEditing, setIsEditing] = useState(false);

  const validationSchema = Yup.object({
    Code: Yup.string().required('Code is required'),
    Name: Yup.string().required('Name is required'),
    TIN: Yup.string()
      .required('TIN is required')
      .matches(/^\d{14}$/, 'TIN must be exactly 14 digits'),
    RDO: Yup.string().required('RDO is required'),
    StreetAddress: Yup.string().required('Street Address is required'),
    BarangayID: Yup.string().required('Barangay is required'),
    MunicipalityID: Yup.string().required('Municipality is required'),
    ProvinceID: Yup.string().required('Province is required'),
    RegionID: Yup.string().required('Region is required'),
    ZIPCode: Yup.string().required('Zip Code is required'),
    PhoneNumber: Yup.number().required('Phone Number is required'),
    EmailAddress: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    Website: Yup.string().required('Website is required'),
  });

  const formik = useFormik({
    initialValues: lgu,
    validationSchema,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting }) => {
      // const success = await updateLguData(values);
      const success = await updateLguData(values, logoFile);
      if (success) {
        setIsEditing(false);
        toast.success('LGU updated successfully');
        fetchLguData();
      }
      setSubmitting(false);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file); // store file to send later

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // show preview
      };
      reader.readAsDataURL(file);
    }
  };
  // const handleImageChange = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const rdos = [
    '001',
    '002',
    '003',
    '004',
    '005',
    '006',
    '007',
    '008',
    '009',
    '010',
    '011',
    '012',
    '013',
    '014',
    '015',
    '016',
    '17A',
    '17B',
    '018',
    '019',
    '020',
    '21A',
    '21B',
    '21C',
    '022',
    '23A',
    '23B',
    '024',
    '25A',
    '25B',
    '026',
    '027',
    '028',
    '029',
    '030',
    '031',
    '032',
    '033',
    '034',
    '035',
    '036',
    '037',
    '038',
    '038',
    '039',
    '040',
    '041',
    '042',
    '043',
    '044',
    '045',
    '046',
    '047',
    '048',
    '049',
    '050',
    '051',
    '052',
    '53A',
    '53B',
    '54A',
    '54B',
    '055',
    '056',
    '057',
    '058',
    '059',
    '060',
    '061',
    '062',
    '063',
    '064',
    '065',
    '066',
    '067',
    '068',
    '069',
    '070',
    '071',
    '072',
    '073',
    '074',
    '075',
    '076',
    '077',
    '078',
    '079',
    '080',
    '081',
    '082',
    '083',
    '084',
    '085',
    '086',
    '087',
    '088',
    '089',
    '090',
    '091',
    '092',
    '93A',
    '93B',
    '094',
    '095',
    '096',
    '097',
    '098',
    '099',
    '100',
    '101',
    '102',
    '103',
    '104',
    '105',
    '106',
    '107',
    '108',
    '109',
    '110',
    '111',
    '112',
    '113A',
    '113B',
    '114',
    '115',
  ].map((id, index) => ({
    ID: index + 1,
    Name: id,
  }));
  return (
    <div className="sm:py-6 sm:px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800">LGU Maintenance</h1>
        <p className="mt-2 text-gray-600">
          Manage Local Government Unit information
        </p>
      </header>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Building className="h-5 w-5 mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold">LGU Information</h2>
          </div>
          {Edit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors w-full sm:w-auto text-center"
            >
              Edit Information
            </button>
          )}
        </div>

        <div className="p-3 sm:p-6">
          <div className="flex flex-col items-center mb-6">
            <img
              src={image}
              className="h-[150px] w-[150px] rounded-full object-cover"
              alt="LGU Logo"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 w-full"
              />
            )}
          </div>

          {isEditing ? (
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="LGU Code"
                  name="Code"
                  value={formik.values.Code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.Code}
                  touched={formik.touched.Code}
                  required
                />
                <FormField
                  label="LGU Name"
                  name="Name"
                  value={formik.values.Name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.Name}
                  touched={formik.touched.Name}
                  required
                />
                <FormField
                  label="TIN"
                  name="TIN"
                  value={formik.values.TIN}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.TIN}
                  touched={formik.touched.TIN}
                  required
                />
                <FormField
                  label="RDO"
                  name="RDO"
                  type="select"
                  options={rdos.map((r) => ({ value: r.ID, label: r.Name }))}
                  value={formik.values.RDO}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.RDO}
                  touched={formik.touched.RDO}
                  required
                />
                <FormField
                  label="Street Address"
                  name="StreetAddress"
                  value={formik.values.StreetAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.StreetAddress}
                  touched={formik.touched.StreetAddress}
                  required
                />
                <FormField
                  label="Barangay"
                  name="BarangayID"
                  type="select"
                  value={formik.values.BarangayID}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.BarangayID}
                  touched={formik.touched.BarangayID}
                  options={barangays.map((b) => ({
                    value: b.ID,
                    label: b.Name,
                  }))}
                  required
                />

                <FormField
                  label="Municipality"
                  name="MunicipalityID"
                  type="select"
                  value={formik.values.MunicipalityID}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.MunicipalityID}
                  touched={formik.touched.MunicipalityID}
                  options={municipalities.map((m) => ({
                    value: m.ID,
                    label: m.Name,
                  }))}
                  required
                />

                <FormField
                  label="Province"
                  name="ProvinceID"
                  type="select"
                  value={formik.values.ProvinceID}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.ProvinceID}
                  touched={formik.touched.ProvinceID}
                  options={provinces.map((p) => ({
                    value: p.ID,
                    label: p.Name,
                  }))}
                  required
                />

                <FormField
                  label="Region"
                  name="RegionID"
                  type="select"
                  value={formik.values.RegionID}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.RegionID}
                  touched={formik.touched.RegionID}
                  options={regions.map((r) => ({ value: r.ID, label: r.Name }))}
                  required
                />

                <FormField
                  label="Zip Code"
                  name="ZIPCode"
                  value={formik.values.ZIPCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.ZIPCode}
                  touched={formik.touched.ZIPCode}
                  required
                />
                <FormField
                  label="Mobile Number"
                  name="PhoneNumber"
                  value={formik.values.PhoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.PhoneNumber}
                  touched={formik.touched.PhoneNumber}
                  required
                />
                <FormField
                  label="Email"
                  name="EmailAddress"
                  type="email"
                  value={formik.values.EmailAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.EmailAddress}
                  touched={formik.touched.EmailAddress}
                  required
                />
                <FormField
                  label="Website"
                  name="Website"
                  value={formik.values.Website}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.Website}
                  touched={formik.touched.Website}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    formik.resetForm();
                    setIsEditing(false);
                  }}
                  className="btn btn-outline"
                >
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries({
                Code: 'LGU Code',
                Name: 'LGU Name',
                TIN: 'TIN',
                RDO: 'RDO',
                StreetAddress: 'Street Address',
                BarangayName: 'Barangay',
                MunicipalityName: 'Municipality',
                ProvinceName: 'Province',
                RegionName: 'Region',
                ZIPCode: 'ZIP Code',
                PhoneNumber: 'Phone Number',
                EmailAddress: 'Email Address',
                Website: 'Website',
              }).map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-500">{label}</h3>
                  <p className="mt-1 text-sm text-gray-900">{lgu[key]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LGUMaintenance;
