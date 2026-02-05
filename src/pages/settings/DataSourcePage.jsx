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

const DataSourcePage = () => {
  const dispatch = useDispatch();
  // ---------------------USE MODULE PERMISSIONS------------------START (PpeSuppliersPage - MODULE ID = 96 )
  const { Edit } = useModulePermissions(58);
  useEffect(() => { fetchDataSource() }, [dispatch]);

  const API_URL = import.meta.env.VITE_API_URL;
  const fetchDataSource = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const response = await fetch(`${API_URL}/dataSource`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Data Source info');
      }
      const data = await response.json();
      const sanitizedData = {};
      Object.keys(data).forEach(key => {
        sanitizedData[key] = data[key] === null ? '' : data[key];
      });
      console.log('Data Source info received (sanitized):', sanitizedData);
      setDatasource(prev => ({ ...prev, ...sanitizedData }));
    } catch (error) {
      console.error('Error loading Data Source info:', error);
      toast.error('Failed to load Data Source info');
    }
  };

  const updateDataSource = async (values) => {
    try {
      const token = sessionStorage.getItem('token');
      const isNew = !values.ID;
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API_URL}/dataSource` : `${API_URL}/dataSource/${values.ID}`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText); // Debug log
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText || 'Failed to update Data Source' };
        }
        throw new Error(errorData.message || 'Failed to update Data Source');
      }

      const updated = await response.json();
      const sanitizedUpdated = {};
      Object.keys(updated).forEach(key => {
        sanitizedUpdated[key] = updated[key] === null ? '' : updated[key];
      });
      console.log('Update response (sanitized):', sanitizedUpdated);
      setDatasource(sanitizedUpdated);
      return true;
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update Data Source. Please try again.');
      return false;
    }
  };

  const [datasource, setDatasource] = useState({
    ID: null,
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
    initialValues: datasource,
    enableReinitialize: true,

    onSubmit: async (values, { setSubmitting }) => {
      const success = await updateDataSource(values);
      if (success) {
        setIsEditing(false);
        toast.success('Data Sources updated successfully');
        fetchDataSource();
      }
      setSubmitting(false);
    },
  });

  const handleCancelEdit = () => {
    formik.resetForm();
    setIsEditing(false);
    fetchDataSource();
  };


  return (
    <div className="page-container">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              {/* <div className="p-2 bg-primary-100 rounded-lg">
                  <Building className="h-6 w-6 text-primary-600" />
                </div> */}
              <div>
                <h1 className="text-3xl font-bold text-neutral-900">
                  Data Source
                </h1>
                <p className="text-sm text-neutral-600 mt-0.5">
                  Manage data sources used for various printed out reports.
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
                Report Data Sources
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
                    <p className="text-base font-semibold text-neutral-900">{datasource.InformationOne || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Two</p>
                    <p className="text-base font-semibold text-neutral-900">{datasource.InformationTwo || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Three</p>
                    <p className="text-base font-semibold text-neutral-900">{datasource.InformationThree || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Four</p>
                    <p className="text-base font-semibold text-neutral-900">{datasource.InformationFour || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Five</p>
                    <p className="text-base font-semibold text-neutral-900">{datasource.InformationFive || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Six</p>
                    <p className="text-base font-semibold text-neutral-900">{datasource.InformationSix || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Seven</p>
                    <p className="text-base font-semibold text-neutral-900">{datasource.InformationSeven || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Eight</p>
                    <p className="text-base font-semibold text-neutral-900">{datasource.InformationEight || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Nine</p>
                    <p className="text-base font-semibold text-neutral-900">{datasource.InformationNine || '—'}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                    <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Information Ten</p>
                    <p className="text-base font-semibold text-neutral-900">{datasource.InformationTen || '—'}</p>
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

export default DataSourcePage;

