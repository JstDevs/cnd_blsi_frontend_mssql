import React from 'react';
import { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItem,
  fetchItems,
  updateItem,
} from '../../features/settings/itemSlice';
import FormField from '../common/FormField';
import { fetchItemUnits } from '../../features/settings/itemUnitsSlice';
import { fetchTaxCodes } from '../../features/settings/taxCodeSlice';
import { fetchAccounts } from '../../features/settings/chartOfAccountsSlice';
import toast from 'react-hot-toast';

const ItemForm = ({ item, onClose }) => {
  const dispatch = useDispatch();
  // coming from Chart of Accounts
  const { accounts } = useSelector((state) => state.chartOfAccounts);

  const { itemUnits } = useSelector((state) => state.itemUnits);
  const { taxCodes } = useSelector((state) => state.taxCodes);

  useEffect(() => {
    dispatch(fetchItemUnits());
    dispatch(fetchTaxCodes());
    dispatch(fetchAccounts());
  }, [dispatch]);

  const types = [
    { value: 'Purchase', label: 'Purchase' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Inventory', label: 'Inventory' },
  ];

  const validationSchema = Yup.object({
    Code: Yup.string().required('Code is required'),
    Name: Yup.string().required('Name is required'),
    ChargeAccountID: Yup.string().required('Charge Account is required'),
    UnitID: Yup.string().required('Unit is required'),
    TAXCodeID: Yup.string().required('Tax Code is required'),
    PurchaseOrSales: Yup.string().required('Type is required'),
    TaxRate: Yup.number()
      .required('Tax Rate is required')
      .min(0, 'Tax Rate cannot be negative'),
    EWT: Yup.number()
      .required('EWT is required')
      .min(0, 'EWT cannot be negative'),
    Vatable: Yup.boolean().required('Vatable is required'),
  });
  console.log({ item });
  const initialValues = {
    Code: item?.Code || '',
    Name: item?.Name || '',
    ChargeAccountID: item?.ChargeAccountID || '',
    UnitID: item?.UnitID || '',
    TAXCodeID: item?.TAXCodeID || '',
    PurchaseOrSales: item?.PurchaseOrSales || '',
    TaxRate: item?.TaxCode?.Rate || 0,
    EWT: item?.EWT || 0,
    Vatable: item?.Vatable || false,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (item) {
        await dispatch(updateItem({ ...values, ID: item.ID })).unwrap();
        toast.success('Item updated successfully.');
      } else {
        await dispatch(addItem(values)).unwrap();
        toast.success('Item added successfully.');
      }
      dispatch(fetchItems());
    } catch (error) {
      console.error('Failed to save item:', error);
      toast.error('Failed to save item. Please try again.');
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Enter item code"
            />

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
              placeholder="Enter item name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Charge Account"
              name="ChargeAccountID"
              type="select"
              required
              value={values.ChargeAccountID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.ChargeAccountID}
              touched={touched.ChargeAccountID}
              options={accounts.map((account) => ({
                value: account.ID,
                label: account.Name,
              }))}
            />

            <FormField
              label="Type"
              name="PurchaseOrSales"
              type="select"
              required
              value={values.PurchaseOrSales}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.PurchaseOrSales}
              touched={touched.PurchaseOrSales}
              options={types}
            />
            <FormField
              label="Unit"
              name="UnitID"
              type="select"
              required
              value={values.UnitID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.UnitID}
              touched={touched.UnitID}
              options={itemUnits.map((unit) => ({
                value: unit.ID,
                label: unit.Code + ' - ' + unit.Name,
              }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Tax Code"
              name="TAXCodeID"
              type="select"
              required
              value={values.TAXCodeID}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.TAXCodeID}
              touched={touched.TAXCodeID}
              options={taxCodes.map((code) => ({
                value: code.ID,
                label: code.Code,
              }))}
            />

            <FormField
              label="Tax Rate"
              name="TaxRate"
              type="number"
              required
              value={values.TaxRate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.TaxRate}
              touched={touched.TaxRate}
              readOnly
              className="bg-gray-200 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="EWT"
              name="EWT"
              type="number"
              required
              value={values.EWT}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.EWT}
              touched={touched.EWT}
            />
            <div className="flex items-center mt-5">
              <FormField
                label="Vatable"
                name="Vatable"
                type="checkbox"
                checked={values.Vatable}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.Vatable}
                touched={touched.Vatable}
              />
            </div>
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
              {isSubmitting ? 'Saving...' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ItemForm;
