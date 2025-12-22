import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Building,
  Edit as EditIcon,
  X,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Save,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';
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
  const fileInputRef = useRef(null);
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
      console.log('LGU Data received:', data); // Debug log
      const extratedData = extraData(data);

      setLgu(extratedData);
      
      // Construct image URL properly - check both Logo and LogoUrl fields
      let imageUrl = 'https://placehold.co/150x150?text=LGU+Logo';
      const logoData = data.Logo || data.LogoUrl || data.logo || data.logoUrl;
      if (logoData) {
        // If Logo is already a full URL, try to use proxy in development
        if (logoData.startsWith('http://') || logoData.startsWith('https://')) {
          // In development, use proxy to avoid CORS issues
          if (import.meta.env.DEV) {
            // Handle both localhost:3000 (wrong) and localhost:5001 (correct)
            if (logoData.includes('localhost:3000') || logoData.includes('localhost:5001')) {
              // Extract the path from the full URL and use proxy
              const urlObj = new URL(logoData);
              imageUrl = `/api${urlObj.pathname}`;
            } else {
              imageUrl = logoData;
            }
          } else {
            imageUrl = logoData;
          }
        } 
        // If Logo is a relative path or filename, construct full URL
        else if (logoData.startsWith('/')) {
          // Use proxy in development
          if (import.meta.env.DEV) {
            imageUrl = `/api${logoData}`;
          } else {
            imageUrl = `${API_URL}${logoData}`;
          }
        } else {
          // Assume it's a filename in uploads folder
          if (import.meta.env.DEV) {
            imageUrl = `/api/uploads/${logoData}`;
          } else {
            imageUrl = `${API_URL}/uploads/${logoData}`;
          }
        }
      }
      console.log('Setting image URL:', imageUrl); // Debug log
      setImage(imageUrl);
    } catch (error) {
      console.error('Error loading LGU data:', error);
      toast.error('Failed to load LGU data');
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
      
      // Append fields (but skip Logo field if we have a new file)
      Object.entries(values).forEach(([key, val]) => {
        if (val !== null && val !== undefined) {
          // Skip Logo field if we're uploading a new file
          if (key === 'Logo' && file) {
            return; // Don't append old Logo URL if we have a new file
          }
          formData.append(key, val);
        }
      });

      // Append file (if selected) - this will replace the old Logo
      if (file) {
        console.log('Appending file to FormData:', file.name, file.type, file.size); // Debug log
        formData.append('Logo', file);
      } else {
        console.log('No file selected for upload'); // Debug log
      }

      // Debug: Log FormData contents
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]));
      }

      const response = await fetch(`${API_URL}/lgu/${values.ID}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          // Do not manually set Content-Type! Let browser set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText); // Debug log
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'Failed to update LGU' };
        }
        throw new Error(errorData.message || 'Failed to update LGU');
      }

      const updated = await response.json();
      console.log('Update response:', updated); // Debug log
      
      setLgu(updated);
      
      // Construct image URL properly after update - check both Logo and LogoUrl fields
      let imageUrl = 'https://placehold.co/150x150?text=LGU+Logo';
      const logoData = updated.Logo || updated.LogoUrl || updated.logo || updated.logoUrl;
      if (logoData) {
        // If Logo is already a full URL, try to use proxy in development
        if (logoData.startsWith('http://') || logoData.startsWith('https://')) {
          // In development, use proxy to avoid CORS issues
          if (import.meta.env.DEV) {
            // Handle both localhost:3000 (wrong) and localhost:5001 (correct)
            if (logoData.includes('localhost:3000') || logoData.includes('localhost:5001')) {
              // Extract the path from the full URL and use proxy
              const urlObj = new URL(logoData);
              imageUrl = `/api${urlObj.pathname}`;
            } else {
              imageUrl = logoData;
            }
          } else {
            imageUrl = logoData;
          }
        } 
        // If Logo is a relative path or filename, construct full URL
        else if (logoData.startsWith('/')) {
          // Use proxy in development
          if (import.meta.env.DEV) {
            imageUrl = `/api${logoData}`;
          } else {
            imageUrl = `${API_URL}${logoData}`;
          }
        } else {
          // Assume it's a filename in uploads folder
          if (import.meta.env.DEV) {
            imageUrl = `/api/uploads/${logoData}`;
          } else {
            imageUrl = `${API_URL}/uploads/${logoData}`;
          }
        }
      }
      console.log('Setting updated image URL:', imageUrl); // Debug log
      setImage(imageUrl);
      setLogoFile(null); // Clear logoFile after successful upload
      return true;
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update LGU. Please try again.');
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
      console.log('Form submitted with logoFile:', logoFile); // Debug log
      if (logoFile) {
        console.log('Logo file details:', {
          name: logoFile.name,
          type: logoFile.type,
          size: logoFile.size
        });
      }
      const success = await updateLguData(values, logoFile);
      if (success) {
        setIsEditing(false);
        setLogoFile(null); // Clear logoFile state
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset file input
        }
        toast.success('LGU updated successfully');
        fetchLguData();
      }
      setSubmitting(false);
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setLogoFile(file); // store file to send later

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // show preview
      };
      reader.onerror = () => {
        toast.error('Error reading image file');
        setLogoFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEdit = () => {
    formik.resetForm();
    setIsEditing(false);
    setLogoFile(null); // Clear logoFile state
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
    // Reset image to original
    fetchLguData();
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
    <div className="page-container">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Building className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  LGU Maintenance
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Manage Local Government Unit information and settings
                </p>
              </div>
            </div>
          </div>
          {Edit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <EditIcon className="h-5 w-5" />
              Edit Information
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-neutral-900">
                LGU Information
              </h2>
            </div>
            {isEditing && (
              <button
                onClick={handleCancelEdit}
                className="text-neutral-600 hover:text-neutral-900 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8 pb-8 border-b border-neutral-200">
            <div className="relative group">
              {isEditing && (
                <div className="absolute inset-0 bg-neutral-900 bg-opacity-0 group-hover:bg-opacity-10 rounded-full transition-all duration-200 flex items-center justify-center z-10 pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                </div>
              )}
              <img
                src={image}
                className="h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover border-4 border-neutral-200 shadow-lg bg-neutral-100"
                alt="LGU Logo"
                style={{ display: 'block' }}
                onError={(e) => {
                  console.error('Image failed to load:', image);
                  console.error('Error details:', e);
                  // If image failed to load and it's not already the placeholder, try fallback
                  if (image && !image.includes('placehold.co')) {
                    // Try direct API URL if proxy didn't work
                    if (image.startsWith('/api/')) {
                      const directUrl = image.replace('/api/', `${API_URL}/`);
                      console.log('Trying direct URL:', directUrl);
                      e.target.src = directUrl;
                    } else {
                      // Fallback to placeholder
                      e.target.src = 'https://placehold.co/150x150?text=LGU+Logo';
                    }
                  } else {
                    // Already placeholder, keep it
                    e.target.src = 'https://placehold.co/150x150?text=LGU+Logo';
                  }
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', image);
                }}
              />
            </div>
            {isEditing && (
              <div className="mt-4 flex flex-col items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="btn btn-outline flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Change Logo
                  </div>
                </label>
                {logoFile && (
                  <p className="text-sm text-green-600 font-medium">
                    ✓ {logoFile.name} ready to upload
                  </p>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200 col-span-full">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                  disabled={formik.isSubmitting}
                >
                  <Save className="h-4 w-4" />
                  {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary-600" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">LGU Code</p>
                    <p className="text-base font-semibold text-neutral-900">{lgu.Code || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">LGU Name</p>
                    <p className="text-base font-semibold text-neutral-900">{lgu.Name || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">TIN</p>
                    <p className="text-base font-medium text-neutral-700">{lgu.TIN || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">RDO</p>
                    <p className="text-base font-medium text-neutral-700">{lgu.RDO || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary-600" />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 md:col-span-2">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Street Address</p>
                    <p className="text-base font-medium text-neutral-700">{lgu.StreetAddress || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Barangay</p>
                    <p className="text-base font-medium text-neutral-700">{lgu.BarangayName || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Municipality</p>
                    <p className="text-base font-medium text-neutral-700">{lgu.MunicipalityName || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Province</p>
                    <p className="text-base font-medium text-neutral-700">{lgu.ProvinceName || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Region</p>
                    <p className="text-base font-medium text-neutral-700">{lgu.RegionName || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">ZIP Code</p>
                    <p className="text-base font-medium text-neutral-700">{lgu.ZIPCode || '—'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      Phone Number
                    </p>
                    <p className="text-base font-medium text-neutral-700">{lgu.PhoneNumber || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      Email Address
                    </p>
                    <p className="text-base font-medium text-neutral-700">{lgu.EmailAddress || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 md:col-span-2">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1 flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5" />
                      Website
                    </p>
                    <p className="text-base font-medium text-blue-600 break-all">{lgu.Website || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LGUMaintenance;
