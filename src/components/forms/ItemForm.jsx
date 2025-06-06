import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, updateItem } from '../../features/settings/itemSlice';
import FormField from '../common/FormField';

const ItemForm = ({ item, onClose }) => {
  const dispatch = useDispatch();
  const { chargeAccounts, types, taxCodes } = useSelector((state) => state.items);

  const validationSchema = Yup.object({
    code: Yup.string().required('Code is required'),
    name: Yup.string().required('Name is required'),
    chargeAccount: Yup.string().required('Charge Account is required'),
    type: Yup.string().required('Type is required'),
    taxCode: Yup.string().required('Tax Code is required'),
    taxRate: Yup.number()
      .required('Tax Rate is required')
      .min(0, 'Tax Rate cannot be negative'),
    ewt: Yup.number()
      .required('EWT is required')
      .min(0, 'EWT cannot be negative'),
    vatable: Yup.boolean().required('Vatable is required'),
  });

  const initialValues = {
    code: item?.code || '',
    name: item?.name || '',
    chargeAccount: item?.chargeAccount || '',
    type: item?.type || '',
    taxCode: item?.taxCode || '',
    taxRate: item?.taxRate || 0,
    ewt: item?.ewt || 0,
    vatable: item?.vatable || false,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (item) {
        await dispatch(updateItem({ ...values, id: item.id })).unwrap();
      } else {
        await dispatch(addItem(values)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Enter item code"
            />

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
              placeholder="Enter item name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Charge Account"
              name="chargeAccount"
              type="select"
              required
              value={values.chargeAccount}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.chargeAccount}
              touched={touched.chargeAccount}
              options={chargeAccounts}
            />

            <FormField
              label="Type"
              name="type"
              type="select"
              required
              value={values.type}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.type}
              touched={touched.type}
              options={types}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
              label="Tax Code"
              name="taxCode"
              type="select"
              required
              value={values.taxCode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.taxCode}
              touched={touched.taxCode}
              options={taxCodes}
            />

            <FormField
              label="Tax Rate"
              name="taxRate"
              type="number"
              required
              value={values.taxRate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.taxRate}
              touched={touched.taxRate}
            />
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField
              label="EWT"
              name="ewt"
              type="number"
              required
              value={values.ewt}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.ewt}
              touched={touched.ewt}
            />
             <FormField
              label="Vatable"
              name="vatable"
              type="checkbox"
              checked={values.vatable}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.vatable}
              touched={touched.vatable}
            />
          </div>

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
              {isSubmitting ? 'Saving...' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ItemForm; 