import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPpeCategories } from '../../../features/settings/ppeCategoriesSlice';
import { fetchPpeSuppliers } from '../../../features/settings/ppeSuppliersSlice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../../components/common/FormField';
import {
  addPPE,
  updatePPE,
  addCategory,
  addSupplier,
  fetchPPEs,
} from '../../../features/settings/ppeSlice';
import toast from 'react-hot-toast';

const PPE_SCHEMA = Yup.object().shape({
  CategoryID: Yup.string().required('Category is required'),
  Description: Yup.string().required('Description is required'),
  DepreciationRate: Yup.number()
    .typeError('Must be a number')
    .required('Depreciation Rate is required'),
  DepreciationValue: Yup.number()
    .typeError('Must be a number')
    .required('Depreciation Value is required'),
  NetBookValue: Yup.number()
    .typeError('Must be a number')
    .required('Net Book Value is required'),
  SupplierID: Yup.string().required('Supplier is required'),
  PPENumber: Yup.string().required('PPE Number is required'),
  Unit: Yup.string().required('Unit is required'),
  Barcode: Yup.string().required('Barcode is required'),
  Quantity: Yup.number()
    .typeError('Must be a number')
    .required('Quantity is required'),
  Cost: Yup.number().typeError('Must be a number').required('Cost is required'),
  DateAcquired: Yup.string().required('Date acquired is required'),
  EstimatedUsefulLife: Yup.number()
    .typeError('Must be a number')
    .required('Estimated useful life is required'),
  PONumber: Yup.string().required('PO Number is required'),
  PRNumber: Yup.string().required('PR Number is required'),
  InvoiceNumber: Yup.string().required('Invoice Number is required'),
  AIRNumber: Yup.string().required('AIR Number is required'),
  RISNumber: Yup.string().required('RIS Number is required'),
  Remarks: Yup.string(),
});

function PPEForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { ppeSuppliers } = useSelector((state) => state.ppeSuppliers);
  const { ppeCategories } = useSelector((state) => state.ppeCategories);
  useEffect(() => {
    dispatch(fetchPpeCategories());
    dispatch(fetchPpeSuppliers());
  }, [dispatch]);

  const initialValues = initialData
    ? { ...initialData }
    : {
        CategoryID: '',
        Description: '',
        DepreciationRate: '',
        DepreciationValue: '',
        NetBookValue: '',
        SupplierID: '',
        PPENumber: '',
        Unit: '',
        Barcode: '',
        Quantity: '',
        Cost: '',
        DateAcquired: '',
        EstimatedUsefulLife: 1,
        PONumber: '',
        PRNumber: '',
        InvoiceNumber: '',
        AIRNumber: '',
        RISNumber: '',
        Remarks: '',
      };

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    const action =
      initialData && initialData.ID
        ? updatePPE({ ...values, ID: initialData.ID })
        : addPPE(values);
    dispatch(action)
      .unwrap()
      .then(() => {
        initialData
          ? toast.success('PPE updated successfully')
          : toast.success('PPE Added successfully');
        dispatch(fetchPPEs());
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting PPE:', error);
        toast.error('Failed to submit PPE. Please try again.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PPE_SCHEMA}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
      }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PPE Category with add new */}
            <div>
              <FormField
                className="p-3 focus:outline-none"
                label="PPE Category"
                name="CategoryID"
                type="select"
                required
                value={values.CategoryID}
                onBlur={handleBlur}
                onChange={handleChange}
                error={errors.CategoryID}
                touched={touched.CategoryID}
                options={ppeCategories.map((cat) => ({
                  value: cat.ID,
                  label: cat.Name,
                }))}
              />
            </div>
            {/* Description */}
            <FormField
              className="p-3 focus:outline-none"
              label="Description"
              name="Description"
              type="text"
              required
              value={values.Description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Description}
              touched={touched.Description}
            />
            {/* Depreciation Rate */}
            <FormField
              className="p-3 focus:outline-none"
              label="Depreciation Rate (%)"
              name="DepreciationRate"
              type="number"
              required
              value={values.DepreciationRate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.DepreciationRate}
              touched={touched.DepreciationRate}
            />
            {/* Depreciation Value */}
            <FormField
              className="p-3 focus:outline-none"
              label="Depreciation Value"
              name="DepreciationValue"
              type="number"
              required
              value={values.DepreciationValue}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.DepreciationValue}
              touched={touched.DepreciationValue}
            />
            {/* Net Book Value */}
            <FormField
              className="p-3 focus:outline-none"
              label="Net Book Value"
              name="NetBookValue"
              type="number"
              required
              value={values.NetBookValue}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.NetBookValue}
              touched={touched.NetBookValue}
            />
            {/* Supplier with add new */}
            <div>
              <FormField
                className="p-3 focus:outline-none"
                label="Supplier"
                name="SupplierID"
                type="select"
                required
                value={values.SupplierID}
                onBlur={handleBlur}
                onChange={handleChange}
                error={errors.SupplierID}
                touched={touched.SupplierID}
                options={ppeSuppliers.map((supplier) => ({
                  value: supplier.ID,
                  label: supplier.Name,
                }))}
              />
            </div>
            {/* PPE Number */}
            <FormField
              className="p-3 focus:outline-none"
              label="PPE Number"
              name="PPENumber"
              type="text"
              required
              value={values.PPENumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.PPENumber}
              touched={touched.PPENumber}
            />
            {/* Unit */}
            <FormField
              className="p-3 focus:outline-none"
              label="Unit"
              name="Unit"
              type="text"
              required
              value={values.Unit}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Unit}
              touched={touched.Unit}
            />
            {/* Barcode */}
            <FormField
              className="p-3 focus:outline-none"
              label="Barcode"
              name="Barcode"
              type="text"
              required
              value={values.Barcode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Barcode}
              touched={touched.Barcode}
            />
            {/* Quantity */}
            <FormField
              className="p-3 focus:outline-none"
              label="Quantity"
              name="Quantity"
              type="number"
              required
              value={values.Quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Quantity}
              touched={touched.Quantity}
            />
            {/* Cost */}
            <FormField
              className="p-3 focus:outline-none"
              label="Cost"
              name="Cost"
              type="number"
              required
              value={values.Cost}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Cost}
              touched={touched.Cost}
            />
            {/* Date Acquired */}
            <FormField
              className="p-3 focus:outline-none"
              label="Date Acquired"
              name="DateAcquired"
              type="date"
              required
              value={values.DateAcquired}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.DateAcquired}
              touched={touched.DateAcquired}
            />
            {/* Estimated Useful Life */}
            <FormField
              className="p-3 focus:outline-none"
              label="Estimated Useful Life (years)"
              name="EstimatedUsefulLife"
              type="number"
              required
              value={values.EstimatedUsefulLife}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.EstimatedUsefulLife}
              touched={touched.EstimatedUsefulLife}
            />
            {/* PO Number */}
            <FormField
              className="p-3 focus:outline-none"
              label="PO Number"
              name="PONumber"
              type="text"
              required
              value={values.PONumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.PONumber}
              touched={touched.PONumber}
            />
            {/* PR Number */}
            <FormField
              className="p-3 focus:outline-none"
              label="PR Number"
              name="PRNumber"
              type="text"
              required
              value={values.PRNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.PRNumber}
              touched={touched.PRNumber}
            />
            {/* Invoice Number */}
            <FormField
              className="p-3 focus:outline-none"
              label="Invoice Number"
              name="InvoiceNumber"
              type="text"
              required
              value={values.InvoiceNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.InvoiceNumber}
              touched={touched.InvoiceNumber}
            />
            {/* AIR Number */}
            <FormField
              className="p-3 focus:outline-none"
              label="AIR Number"
              name="AIRNumber"
              type="text"
              required
              value={values.AIRNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.AIRNumber}
              touched={touched.AIRNumber}
            />
            {/* RIS Number */}
            <FormField
              className="p-3 focus:outline-none"
              label="RIS Number"
              name="RISNumber"
              type="text"
              required
              value={values.RISNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.RISNumber}
              touched={touched.RISNumber}
            />
            {/* Remarks */}
            <FormField
              className="p-3 focus:outline-none"
              label="Remarks"
              name="Remarks"
              type="textarea"
              value={values.Remarks}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.Remarks}
              touched={touched.Remarks}
              rows={2}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default PPEForm;
