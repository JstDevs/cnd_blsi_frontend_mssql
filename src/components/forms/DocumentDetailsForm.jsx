import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addDocumentDetail, updateDocumentDetail, addDocumentCategory } from '../../features/settings/documentDetailsSlice';
import FormField from '../common/FormField';

const DocumentDetailsForm = ({ document, onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.documentDetails.categories);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    code: Yup.string().required('Code is required'),
    prefix: Yup.string().required('Prefix is required'),
    suffix: Yup.string().required('Suffix is required'),
    startNumber: Yup.number()
      .required('Start number is required')
      .min(1, 'Start number must be at least 1'),
    currentNumber: Yup.number()
      .required('Current number is required')
      .min(1, 'Current number must be at least 1'),
    documentTypeCategory: Yup.string().required('Document type category is required')
  });

  const initialValues = {
    name: document?.name || '',
    code: document?.code || '',
    prefix: document?.prefix || '',
    suffix: document?.suffix || '',
    startNumber: document?.startNumber || 1,
    currentNumber: document?.currentNumber || 1,
    documentTypeCategory: document?.documentTypeCategory || '',
    status: document?.status || 'Active'
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (document) {
        await dispatch(updateDocumentDetail({ ...values, id: document.id })).unwrap();
      } else {
        await dispatch(addDocumentDetail(values)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save document details:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const result = await dispatch(addDocumentCategory(newCategory.trim())).unwrap();
        setNewCategory('');
        setShowCategoryForm(false);
        // Update the form's documentTypeCategory field with the new category
        if (result && result.value) {
          document.formik.setFieldValue('documentTypeCategory', result.value);
        }
      } catch (error) {
        console.error('Failed to add category:', error);
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Name"
              name="name"
              type="text"
              required
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              placeholder="Enter document name"
            />

            <FormField
              label="Code"
              name="code"
              type="text"
              required
              value={values.code}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.code}
              touched={touched.code}
              placeholder="Enter document code"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Prefix"
              name="prefix"
              type="text"
              required
              value={values.prefix}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.prefix}
              touched={touched.prefix}
              placeholder="Enter document prefix"
            />

            <FormField
              label="Suffix"
              name="suffix"
              type="text"
              required
              value={values.suffix}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.suffix}
              touched={touched.suffix}
              placeholder="Enter document suffix"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Start Number"
              name="startNumber"
              type="number"
              required
              value={values.startNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.startNumber}
              touched={touched.startNumber}
              min="1"
            />

            <FormField
              label="Current Number"
              name="currentNumber"
              type="number"
              required
              value={values.currentNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.currentNumber}
              touched={touched.currentNumber}
              min="1"
            />
          </div>

          <div className="space-y-2">
            <FormField
              label="Document Type Category"
              name="documentTypeCategory"
              type="select"
              required
              value={values.documentTypeCategory}
              onChange={(e) => {
                handleChange(e);
                if (e.target.value === 'custom') {
                  setShowCategoryForm(true);
                  setFieldValue('documentTypeCategory', '');
                }
              }}
              onBlur={handleBlur}
              error={errors.documentTypeCategory}
              touched={touched.documentTypeCategory}
              options={[
                ...categories,
                { value: 'custom', label: '+ Add Custom Category' }
              ]}
            />

            {showCategoryForm && (
              <div className="p-4 border border-neutral-200 rounded-md space-y-4">
                <h3 className="font-medium text-sm">Add Custom Category</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryForm(false);
                      setNewCategory('');
                    }}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <FormField
            label="Status"
            name="status"
            type="select"
            required
            value={values.status}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.status}
            touched={touched.status}
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : document ? 'Update' : 'Create'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DocumentDetailsForm; 