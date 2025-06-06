import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../../components/common/FormField';
import { addPPE, updatePPE, addCategory, addSupplier } from '../../../features/settings/ppeSlice';

const PPE_SCHEMA = Yup.object().shape({
  category: Yup.string().required('Category is required'),
  description: Yup.string().required('Description is required'),
  depreciationRate: Yup.number().typeError('Must be a number').required('Depreciation Rate is required'),
  depreciationValue: Yup.number().typeError('Must be a number').required('Depreciation Value is required'),
  netBookValue: Yup.number().typeError('Must be a number').required('Net Book Value is required'),
  supplier: Yup.string().required('Supplier is required'),
  ppeNumber: Yup.number().typeError('Must be a number').required('PPE Number is required'),
  unit: Yup.string().required('Unit is required'),
  barcode: Yup.number().typeError('Must be a number').required('Barcode is required'),
  quantity: Yup.number().typeError('Must be a number').required('Quantity is required'),
  cost: Yup.number().typeError('Must be a number').required('Cost is required'),
  dateAcquired: Yup.string().required('Date acquired is required'),
  usefulLife: Yup.number().typeError('Must be a number').required('Estimated useful life is required'),
  poNumber: Yup.number().typeError('Must be a number').required('PO Number is required'),
  prNumber: Yup.number().typeError('Must be a number').required('PR Number is required'),
  invoiceNumber: Yup.number().typeError('Must be a number').required('Invoice Number is required'),
  airNumber: Yup.number().typeError('Must be a number').required('AIR Number is required'),
  risNumber: Yup.number().typeError('Must be a number').required('RIS Number is required'),
  remarks: Yup.string(),
});

function PPEForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const { categories, suppliers } = useSelector(state => state.ppes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showSupplierInput, setShowSupplierInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSupplier, setNewSupplier] = useState('');

  const initialValues = initialData ? { ...initialData } : {
    category: '',
    description: '',
    depreciationRate: '',
    depreciationValue: '',
    netBookValue: '',
    supplier: '',
    ppeNumber: '',
    unit: '',
    barcode: '',
    quantity: '',
    cost: '',
    dateAcquired: '',
    usefulLife: 1,
    poNumber: '',
    prNumber: '',
    invoiceNumber: '',
    airNumber: '',
    risNumber: '',
    remarks: '',
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    const action = initialData && initialData.id
      ? updatePPE({ ...values, id: initialData.id })
      : addPPE(values);
    dispatch(action)
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting PPE:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Handler for adding new category
  const handleAddCategory = (setFieldValue) => {
    if (newCategory.trim()) {
      dispatch(addCategory(newCategory.trim()));
      setFieldValue('category', newCategory.trim());
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  // Handler for adding new supplier
  const handleAddSupplier = (setFieldValue) => {
    if (newSupplier.trim()) {
      dispatch(addSupplier(newSupplier.trim()));
      setFieldValue('supplier', newSupplier.trim());
      setNewSupplier('');
      setShowSupplierInput(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PPE_SCHEMA}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PPE Category with add new */}
            <div>
              <FormField
                className='p-3 focus:outline-none'
                label="PPE Category"
                name="category"
                type="select"
                required
                value={values.category}
                onChange={e => {
                  if (e.target.value === '__add_new__') {
                    setShowCategoryInput(true);
                  } else {
                    setFieldValue('category', e.target.value);
                  }
                }}
                onBlur={handleBlur}
                error={errors.category}
                touched={touched.category}
                options={[...categories, { value: '__add_new__', label: 'Add new category...' }]}
              />
              {showCategoryInput && (
                <div className="flex mt-2 gap-2">
                  <input
                    type="text"
                    className="form-input flex-1"
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAddCategory(setFieldValue)}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowCategoryInput(false);
                      setNewCategory('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            {/* Description */}
            <FormField
              className='p-3 focus:outline-none'
              label="Description"
              name="description"
              type="text"
              required
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description}
              touched={touched.description}
            />
            {/* Depreciation Rate */}
            <FormField
              className='p-3 focus:outline-none'
              label="Depreciation Rate (%)"
              name="depreciationRate"
              type="number"
              required
              value={values.depreciationRate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.depreciationRate}
              touched={touched.depreciationRate}
            />
            {/* Depreciation Value */}
            <FormField
              className='p-3 focus:outline-none'
              label="Depreciation Value"
              name="depreciationValue"
              type="number"
              required
              value={values.depreciationValue}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.depreciationValue}
              touched={touched.depreciationValue}
            />
            {/* Net Book Value */}
            <FormField
              className='p-3 focus:outline-none'
              label="Net Book Value"
              name="netBookValue"
              type="number"
              required
              value={values.netBookValue}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.netBookValue}
              touched={touched.netBookValue}
            />
            {/* Supplier with add new */}
            <div>
              <FormField
                className='p-3 focus:outline-none'
                label="Supplier"
                name="supplier"
                type="select"
                required
                value={values.supplier}
                onChange={e => {
                  if (e.target.value === '__add_new__') {
                    setShowSupplierInput(true);
                  } else {
                    setFieldValue('supplier', e.target.value);
                  }
                }}
                onBlur={handleBlur}
                error={errors.supplier}
                touched={touched.supplier}
                options={[...suppliers, { value: '__add_new__', label: 'Add new supplier...' }]}
              />
              {showSupplierInput && (
                <div className="flex mt-2 gap-2">
                  <input
                    type="text"
                    className="form-input flex-1"
                    placeholder="Enter new supplier"
                    value={newSupplier}
                    onChange={e => setNewSupplier(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAddSupplier(setFieldValue)}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowSupplierInput(false);
                      setNewSupplier('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            {/* PPE Number */}
            <FormField
              className='p-3 focus:outline-none'
              label="PPE Number"
              name="ppeNumber"
              type="number"
              required
              value={values.ppeNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.ppeNumber}
              touched={touched.ppeNumber}
            />
            {/* Unit */}
            <FormField
              className='p-3 focus:outline-none'
              label="Unit"
              name="unit"
              type="text"
              required
              value={values.unit}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.unit}
              touched={touched.unit}
            />
            {/* Barcode */}
            <FormField
              className='p-3 focus:outline-none'
              label="Barcode"
              name="barcode"
              type="number"
              required
              value={values.barcode}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.barcode}
              touched={touched.barcode}
            />
            {/* Quantity */}
            <FormField
              className='p-3 focus:outline-none'
              label="Quantity"
              name="quantity"
              type="number"
              required
              value={values.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.quantity}
              touched={touched.quantity}
            />
            {/* Cost */}
            <FormField
              className='p-3 focus:outline-none'
              label="Cost"
              name="cost"
              type="number"
              required
              value={values.cost}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.cost}
              touched={touched.cost}
            />
            {/* Date Acquired */}
            <FormField
              className='p-3 focus:outline-none'
              label="Date Acquired"
              name="dateAcquired"
              type="date"
              required
              value={values.dateAcquired}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.dateAcquired}
              touched={touched.dateAcquired}
            />
            {/* Estimated Useful Life */}
            <FormField
              className='p-3 focus:outline-none'
              label="Estimated Useful Life (years)"
              name="usefulLife"
              type="number"
              required
              value={values.usefulLife}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.usefulLife}
              touched={touched.usefulLife}
            />
            {/* PO Number */}
            <FormField
              className='p-3 focus:outline-none'
              label="PO Number"
              name="poNumber"
              type="number"
              required
              value={values.poNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.poNumber}
              touched={touched.poNumber}
            />
            {/* PR Number */}
            <FormField
              className='p-3 focus:outline-none'
              label="PR Number"
              name="prNumber"
              type="number"
              required
              value={values.prNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.prNumber}
              touched={touched.prNumber}
            />
            {/* Invoice Number */}
            <FormField
              className='p-3 focus:outline-none'
              label="Invoice Number"
              name="invoiceNumber"
              type="number"
              required
              value={values.invoiceNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.invoiceNumber}
              touched={touched.invoiceNumber}
            />
            {/* AIR Number */}
            <FormField
              className='p-3 focus:outline-none'
              label="AIR Number"
              name="airNumber"
              type="number"
              required
              value={values.airNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.airNumber}
              touched={touched.airNumber}
            />
            {/* RIS Number */}
            <FormField
              className='p-3 focus:outline-none'
              label="RIS Number"
              name="risNumber"
              type="number"
              required
              value={values.risNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.risNumber}
              touched={touched.risNumber}
            />
            {/* Remarks */}
            <FormField
              className='p-3 focus:outline-none'
              label="Remarks"
              name="remarks"
              type="textarea"
              value={values.remarks}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.remarks}
              touched={touched.remarks}
              rows={2}
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Save</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default PPEForm; 