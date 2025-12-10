import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  addDocumentDetail,
  fetchDocumentDetails,
  updateDocumentDetail,
} from '../../features/settings/documentDetailsSlice';
import FormField from '../common/FormField';
import toast from 'react-hot-toast';

export const getValidationSchema = (
  existingDocuments = [],
  currentDocument = null
) => {
  return Yup.object({
    Name: Yup.string()
      .required('Name is required')
      .test('unique-name', 'Name already exists', function (value) {
        if (!value) return true;

        const duplicate = existingDocuments.some(
          (doc) =>
            doc.Name.trim().toLowerCase() === value.trim().toLowerCase() &&
            (!currentDocument || doc.ID !== currentDocument.ID)
        );

        return !duplicate;
      }),

    Code: Yup.string()
      .required('Code is required')
      .test('unique-code', 'Code already exists', function (value) {
        if (!value) return true;

        const duplicate = existingDocuments.some(
          (doc) =>
            doc.Code.trim().toLowerCase() === value.trim().toLowerCase() &&
            (!currentDocument || doc.ID !== currentDocument.ID)
        );

        return !duplicate;
      }),
    // The Suffix is indeed mandatory but the prefix is not
    Prefix: Yup.string(),
    Suffix: Yup.string().required('Suffix is required'),

    StartNumber: Yup.number()
      .required('Start number is required')
      .integer('Start number must be an integer')
      .min(1, 'Start number must be at least 1'),

    CurrentNumber: Yup.number()
      .required('Current number is required')
      .integer('Current number must be an integer')
      .min(1, 'Current number must be at least 1'),

    DocumentTypeCategoryID: Yup.string().required(
      'Document type category is required'
    ),
  });
};
const DocumentDetailsForm = ({
  document,
  documentList = [],
  onClose,
  documentTypeCategoryOptions = [],
}) => {
  const dispatch = useDispatch();

  const initialValues = {
    Name: document?.Name || '',
    Code: document?.Code || '',
    Prefix: document?.Prefix || '',
    Suffix: document?.Suffix || '',
    StartNumber: document?.StartNumber || 1,
    CurrentNumber: document?.CurrentNumber || 1,
    DocumentTypeCategoryID: document?.DocumentTypeCategoryID || '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (document) {
        await dispatch(
          updateDocumentDetail({ ...values, ID: document.ID })
        ).unwrap();
        toast.success('Document detail updated successfully');
      } else {
        await dispatch(addDocumentDetail(values)).unwrap();
        toast.success('Document detail added successfully');
      }

      dispatch(fetchDocumentDetails());
    } catch (error) {
      console.error('Failed to save document details:', error);
      toast.error('Failed to save document details. Please try again.');
    } finally {
      setSubmitting(false);
      onClose();
    }
  };
  // const validationSchema = getValidationSchema(document, documentList);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getValidationSchema(documentList, document)}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
      }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Name"
              name="Name"
              type="text"
              required
              value={values.Name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Name}
              touched={touched.Name}
              placeholder="Enter document name"
            />

            <FormField
              label="Code"
              name="Code"
              type="text"
              required
              value={values.Code}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Code}
              touched={touched.Code}
              placeholder="Enter document code"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Prefix"
              name="Prefix"
              type="text"
              value={values.Prefix}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Prefix}
              touched={touched.Prefix}
              placeholder="Enter document prefix"
            />

            <FormField
              label="Suffix"
              name="Suffix"
              type="text"
              required
              value={values.Suffix}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Suffix}
              touched={touched.Suffix}
              placeholder="Enter document suffix"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Start Number"
              name="StartNumber"
              type="number"
              required
              value={values.StartNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.StartNumber}
              touched={touched.StartNumber}
              min="1"
            />

            <FormField
              label="Current Number"
              name="CurrentNumber"
              type="number"
              required
              value={values.CurrentNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.CurrentNumber}
              touched={touched.CurrentNumber}
              min="1"
            />
          </div>

          <div className="space-y-2">
            <FormField
              label="Document Type Category"
              name="DocumentTypeCategoryID"
              type="select"
              required
              value={values.DocumentTypeCategoryID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.DocumentTypeCategoryID}
              touched={touched.DocumentTypeCategoryID}
              options={documentTypeCategoryOptions}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button type="button" onClick={onClose} className="btn btn-outline">
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
