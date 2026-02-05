import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import {
  Edit as EditIcon,
  X,
  FileText,
  Save,
  Upload,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useModulePermissions } from '@/utils/useModulePremission';

const LogoImagesPage = () => {
  const dispatch = useDispatch();
  const { Edit } = useModulePermissions(58);
  const API_URL = import.meta.env.VITE_API_URL;

  const [logoimages, setLogoImages] = useState({
    ID: null,
    ImageOne: '',
    ImageTwo: '',
    ImageThree: '',
    ImageFour: '',
    ImageFive: '',
    ImageSix: '',
    ImageSeven: '',
    ImageEight: '',
    ImageNine: '',
    ImageTen: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    fetchLogoImages();
  }, [dispatch]);

  const fetchLogoImages = async () => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/logoImages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Logo and Images info');
      }
      const data = await response.json();
      setLogoImages(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error loading Logo and Images info:', error);
      toast.error('Failed to load Logo and Images info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploadingField(fieldName);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/logoImages/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      // data.filePath is the relative path from server
      formik.setFieldValue(fieldName, data.filePath);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingField(null);
    }
  };

  const updateLogoImages = async (values) => {
    try {
      const token = sessionStorage.getItem('token');

      // Clean up URLs before saving (we only want the relative path in the DB)
      const cleanValues = { ...values };
      const fields = ['ImageOne', 'ImageTwo', 'ImageThree', 'ImageFour', 'ImageFive', 'ImageSix', 'ImageSeven', 'ImageEight', 'ImageNine', 'ImageTen'];

      fields.forEach(field => {
        if (cleanValues[field] && cleanValues[field].includes('/uploads/')) {
          cleanValues[field] = cleanValues[field].split('/uploads/')[1];
        }
      });

      const isNew = !values.ID;
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API_URL}/logoImages` : `${API_URL}/logoImages/${values.ID}`;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanValues),
      });

      if (!response.ok) {
        throw new Error('Failed to update Logo and Images');
      }

      return true;
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Failed to update Logo and Images');
      return false;
    }
  };

  const formik = useFormik({
    initialValues: logoimages,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const success = await updateLogoImages(values);
      if (success) {
        setIsEditing(false);
        toast.success('Settings saved successfully');
        fetchLogoImages();
      }
      setSubmitting(false);
    },
  });

  const handleCancelEdit = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  const renderImageSlot = (fieldName, label) => {
    const value = isEditing ? formik.values[fieldName] : logoimages[fieldName];
    const isUploading = uploadingField === fieldName;

    // Resolve display URL
    let displayUrl = value;
    if (value && !value.startsWith('http')) {
      displayUrl = `${import.meta.env.VITE_API_URL.replace('/api', '')}/uploads/${value}`;
    }
    const isFailed = failedImages[fieldName];

    return (
      <div key={fieldName} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="px-4 py-2 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">{label}</span>
          {isEditing && (
            <label className="cursor-pointer group">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, fieldName)}
                disabled={isUploading}
              />
              <div className="flex items-center gap-1.5 text-primary-600 group-hover:text-primary-700 transition-colors">
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                <span className="text-xs font-semibold">Replace</span>
              </div>
            </label>
          )}
        </div>

        <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[200px] bg-neutral-50/30">
          {value && !isFailed ? (
            <div className="relative group w-full h-full flex items-center justify-center">
              <img
                src={displayUrl}
                alt={label}
                className="max-h-[150px] object-contain rounded-lg shadow-sm transition-transform group-hover:scale-105"
                onError={() => {
                  setFailedImages(prev => ({ ...prev, [fieldName]: true }));
                }}
              />
            </div>
          ) : value && isFailed ? (
            <div className="flex flex-col items-center text-neutral-400">
              <ImageIcon className="h-12 w-12 mb-2 stroke-[1.5px] opacity-50" />
              <span className="text-xs font-medium">Error loading image</span>
              <p className="text-[10px] mt-1 opacity-70">Check server connection</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-neutral-400">
              <ImageIcon className="h-12 w-12 mb-2 stroke-[1.5px]" />
              <span className="text-sm">No image set</span>
            </div>
          )}
        </div>

        {isEditing && value && (
          <div className="p-2 bg-white border-t border-neutral-100 flex justify-center">
            <button
              type="button"
              onClick={() => formik.setFieldValue(fieldName, '')}
              className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              Remove Image
            </button>
          </div>
        )}
      </div>
    );
  };

  const imageFields = [
    { name: 'ImageOne', label: 'Image One' },
    { name: 'ImageTwo', label: 'Image Two' },
    { name: 'ImageThree', label: 'Image Three' },
    { name: 'ImageFour', label: 'Image Four' },
    { name: 'ImageFive', label: 'Image Five' },
    { name: 'ImageSix', label: 'Image Six' },
    { name: 'ImageSeven', label: 'Image Seven' },
    { name: 'ImageEight', label: 'Image Eight' },
    { name: 'ImageNine', label: 'Image Nine' },
    { name: 'ImageTen', label: 'Image Ten' },
  ];

  if (isLoading && !isEditing) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
          <p className="text-neutral-500 font-medium text-lg">Loading visual assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary-50 rounded-xl">
                <ImageIcon className="h-7 w-7 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                  Images and Logos
                </h1>
                <p className="text-neutral-500 font-medium">
                  Manage branding logos and interface backgrounds used throughout the system
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {Edit && !isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-200 transition-all active:scale-95"
              >
                <EditIcon className="h-5 w-5" />
                Customize Assets
              </button>
            ) : isEditing && (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-neutral-300 text-neutral-700 rounded-xl font-bold hover:bg-neutral-50 transition-all"
                >
                  <X className="h-5 w-5" />
                  Discard Changes
                </button>
                <button
                  onClick={() => formik.handleSubmit()}
                  disabled={formik.isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  {formik.isSubmitting ? 'Syncing...' : 'Save Settings'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {imageFields.map(field => renderImageSlot(field.name, field.label))}
      </div>

      {isEditing && (
        <div className="mt-8 p-4 bg-primary-50 border border-primary-100 rounded-xl flex items-start gap-4">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Upload className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h4 className="font-bold text-primary-900">Uploading Instructions</h4>
            <p className="text-sm text-primary-700 mt-0.5">
              Click on <strong>Replace</strong> at the top right of each slot to upload a new asset.
              The changes will only be permanent after you click <strong>Save Settings</strong> above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoImagesPage;
