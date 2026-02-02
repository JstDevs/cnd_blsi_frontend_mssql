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
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

const Watermarks = () => {
  const dispatch = useDispatch();
  // ---------------------USE MODULE PERMISSIONS------------------START (PpeSuppliersPage - MODULE ID = 96 )
  const { Edit } = useModulePermissions(58);
  useEffect(() => {fetchWatermarks()}, [dispatch]);

  const API_URL = import.meta.env.VITE_API_URL;
  const fetchWatermarks = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await fetch(`${API_URL}/watermarks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Watermarks info');
      }
      const data = await response.json();
      console.log('Watermarks info received:', data); // Debug log
      setWatermarks(data);
    } catch (error) {
      console.error('Error loading Watermarks info:', error);
      toast.error('Failed to load Watermarks info');
    }
  };
  
  const updateWatermarks = async (values) => {
    try {
      const token = sessionStorage.getItem('token');
      const formData = new FormData();

      // Debug: Log FormData contents
      console.log('FormData entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]));
      }

      const response = await fetch(`${API_URL}/watermarks/${values.ID}`, {
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
          errorData = { message: errorText || 'Failed to update Watermarks' };
        }
        throw new Error(errorData.message || 'Failed to update Watermarks');
      }

      const updated = await response.json();
      console.log('Update response:', updated); // Debug log
      
      setWatermarks(updated);
      return true;
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update Watermarks. Please try again.');
      return false;
    }
  };

  const [watermarks, setWatermarks] = useState({
    ID: '1',
    InformationOne: '',
    InformationTwo: '',
    InformationThree: '',
    InformationFour: '',
    InformationFive: '',
    InformationSix: '',
    InformationSeven: '',
    InformationEight: '',
    InformationNine: '',
    InformationTen: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const formik = useFormik({
    initialValues: watermarks,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting }) => {
      // const success = await updateWatermarks(values);
      // if (success) {
      //   setIsEditing(false);
      //   if (fileInputRef.current) {
      //     fileInputRef.current.value = ''; // Reset file input
      //   }
      //   toast.success('Watermarks updated successfully');
      //   fetchWatermarks();
      // }
      setSubmitting(false);
    },
  });

  const handleCancelEdit = () => {
    formik.resetForm();
    setIsEditing(false);
    fetchWatermarks();
  };  


  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Watermarks
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Set whether the printable document will have a watermark.
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
                Report Watermarks
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
          {isEditing ? (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <FormField
                  label="Information One"
                  name="InformationOne"
                  value={formik.values.InformationOne}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.InformationOne}
                  touched={formik.touched.InformationOne}
                />
                
                <FormField
                  label="Information Two"
                  name="InformationTwo"
                  value={formik.values.InformationTwo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.InformationTwo}
                  touched={formik.touched.InformationTwo}
                />

                <FormField
                  label="Information Three"
                  name="InformationThree"
                  value={formik.values.InformationThree}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.InformationThree}
                  touched={formik.touched.InformationThree}
                />

                <FormField
                  label="Information Four"
                  name="InformationFour"
                  value={formik.values.InformationFour}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.InformationFour}
                  touched={formik.touched.InformationFour}
                />

                <FormField
                  label="Information Five"
                  name="InformationFive"
                  value={formik.values.InformationFive}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.InformationFive}
                  touched={formik.touched.InformationFive}
                />

                <FormField
                  label="Information Six"
                  name="InformationSix"
                  value={formik.values.InformationSix}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.InformationSix}
                  touched={formik.touched.InformationSix}
                />

                <FormField
                  label="Information Seven"
                  name="InformationSeven"
                  value={formik.values.InformationSeven}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.InformationSeven}
                  touched={formik.touched.InformationSeven}
                />

                <FormField
                  label="Information Eight"
                  name="InformationEight"
                  value={formik.values.InformationEight}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.InformationEight}
                  touched={formik.touched.InformationEight}
                />

                <FormField
                  label="Information Nine"
                  name="InformationNine"
                  value={formik.values.InformationNine}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.InformationNine}
                  touched={formik.touched.InformationNine}
                />

                <FormField
                  label="Information Ten"
                  name="InformationTen"
                  value={formik.values.InformationTen}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.InformationTen}
                  touched={formik.touched.InformationTen}
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
              <div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information One</p>
                    <p className="text-base font-semibold text-neutral-900">{watermarks.InformationOne || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Two</p>
                    <p className="text-base font-semibold text-neutral-900">{watermarks.InformationTwo || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Three</p>
                    <p className="text-base font-semibold text-neutral-900">{watermarks.InformationThree || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Four</p>
                    <p className="text-base font-semibold text-neutral-900">{watermarks.InformationFour || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Five</p>
                    <p className="text-base font-semibold text-neutral-900">{watermarks.InformationFive || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Six</p>
                    <p className="text-base font-semibold text-neutral-900">{watermarks.InformationSix || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Seven</p>
                    <p className="text-base font-semibold text-neutral-900">{watermarks.InformationSeven || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Eight</p>
                    <p className="text-base font-semibold text-neutral-900">{watermarks.InformationEight || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Nine</p>
                    <p className="text-base font-semibold text-neutral-900">{watermarks.InformationNine || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Ten</p>
                    <p className="text-base font-semibold text-neutral-900">{watermarks.InformationTen || '—'}</p>
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

export default Watermarks;

