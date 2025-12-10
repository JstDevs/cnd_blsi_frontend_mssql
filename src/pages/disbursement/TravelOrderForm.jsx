import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/common/FormField';
import { createTravelOrder, updateTravelOrder } from '../../features/disbursement/travelOrderSlice';

// Mock data for dropdowns
const departments = [
  { value: 'Office of the Mayor', label: 'Office of the Mayor' },
  { value: 'Accounting Department', label: 'Accounting Department' },
  { value: 'Treasury Department', label: 'Treasury Department' },
  { value: 'IT Department', label: 'IT Department' },
];

const positions = [
  { value: 'Administrative Officer III', label: 'Administrative Officer III' },
  { value: 'Administrative Officer IV', label: 'Administrative Officer IV' },
  { value: 'Department Head I', label: 'Department Head I' },
  { value: 'Department Head II', label: 'Department Head II' },
];

const meansOfTravel = [
  { value: 'Official Vehicle', label: 'Official Vehicle' },
  { value: 'Public Land Transport', label: 'Public Land Transport' },
  { value: 'Air', label: 'Air' },
  { value: 'Sea', label: 'Sea' },
];

// Validation schema
const travelOrderSchema = Yup.object().shape({
  toDate: Yup.date().required('Date is required'),
  employeeName: Yup.string().required('Employee name is required'),
  position: Yup.string().required('Position is required'),
  department: Yup.string().required('Department is required'),
  destination: Yup.string().required('Destination is required'),
  purpose: Yup.string().required('Purpose is required'),
  departureDate: Yup.date().required('Departure date is required'),
  returnDate: Yup.date()
    .required('Return date is required')
    .min(Yup.ref('departureDate'), 'Return date must be after departure date'),
  estimatedExpenses: Yup.number()
    .required('Estimated expenses is required')
    .min(0, 'Amount must be greater than or equal to 0'),
  meansOfTravel: Yup.string().required('Means of travel is required'),
});

function TravelOrderForm({ initialData, onClose }) {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = initialData ? { ...initialData } : {
    toDate: new Date().toISOString().split('T')[0],
    employeeName: '',
    position: '',
    department: '',
    destination: '',
    purpose: '',
    departureDate: '',
    returnDate: '',
    estimatedExpenses: '',
    meansOfTravel: '',
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    
    const action = initialData 
      ? updateTravelOrder({ ...values, id: initialData.id, toNumber: initialData.toNumber })
      : createTravelOrder(values);
    
    dispatch(action)
      .unwrap()
      .then(() => {
        onClose();
      })
      .catch((error) => {
        console.error('Error submitting travel order:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={travelOrderSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, errors, touched, handleChange, handleBlur, isValid }) => (
        <Form className="space-y-4">
          <FormField
            label="Travel Order Date"
            name="toDate"
            type="date"
            required
            value={values.toDate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.toDate}
            touched={touched.toDate}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Employee Name"
              name="employeeName"
              type="text"
              required
              placeholder="Enter employee name"
              value={values.employeeName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.employeeName}
              touched={touched.employeeName}
            />
            
            <FormField
              label="Position"
              name="position"
              type="select"
              required
              value={values.position}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.position}
              touched={touched.position}
              options={positions}
            />
          </div>
          
          <FormField
            label="Department"
            name="department"
            type="select"
            required
            value={values.department}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.department}
            touched={touched.department}
            options={departments}
          />
          
          <FormField
            label="Destination"
            name="destination"
            type="text"
            required
            placeholder="Enter destination"
            value={values.destination}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.destination}
            touched={touched.destination}
          />
          
          <FormField
            label="Purpose"
            name="purpose"
            type="textarea"
            required
            placeholder="Enter purpose of travel"
            value={values.purpose}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.purpose}
            touched={touched.purpose}
            rows={3}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Departure Date"
              name="departureDate"
              type="datetime-local"
              required
              value={values.departureDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.departureDate}
              touched={touched.departureDate}
            />
            
            <FormField
              label="Return Date"
              name="returnDate"
              type="datetime-local"
              required
              value={values.returnDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.returnDate}
              touched={touched.returnDate}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Estimated Expenses"
              name="estimatedExpenses"
              type="number"
              required
              placeholder="0.00"
              value={values.estimatedExpenses}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.estimatedExpenses}
              touched={touched.estimatedExpenses}
              min="0"
              step="0.01"
            />
            
            <FormField
              label="Means of Travel"
              name="meansOfTravel"
              type="select"
              required
              value={values.meansOfTravel}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.meansOfTravel}
              touched={touched.meansOfTravel}
              options={meansOfTravel}
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
              disabled={isSubmitting || !isValid}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default TravelOrderForm;