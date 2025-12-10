import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../common/FormField';
import { useEffect, useState } from 'react';

const validationSchema = Yup.object({
  fund: Yup.string().required('Fund is required'),
  code: Yup.string().required('Code is required'),
  name: Yup.string().required('Name is required'),
  desc: Yup.string().required('Description is required'),
  amount: Yup.number()
    .required('Amount is required')
    .min(0, 'Amount must be positive'),
});

const initialValues = {
  code: '',
  name: '',
  fund: '',
  desc: '',
  amount: 0,
};

// const funds = [
//   { value: 1, label: 'Fund 1' },
//   { value: 2, label: 'Fund 2' },
//   { value: 3, label: 'Fund 3' },
// ];

function BudgetSubFundsForm({ initialData, onSubmit, onClose, funds }) {
  const [formData, setFormData] = useState({ ...initialValues });

  const handleSubmit = (values, { setSubmitting }) => {
    onSubmit(values);
    setSubmitting(false);
    console.log('Form submitted with values:', values);
  };

  useEffect(() => {
    if (initialData?.ID) {
      setFormData({
        id: initialData?.ID,
        code: initialData?.Code,
        name: initialData?.Name,
        desc: initialData?.Description,
        amount: initialData?.Amount,
        fund: initialData?.FundsID,
      });
    } else {
      setFormData(initialValues);
    }
  }, [initialData]);

  return (
    <Formik
      enableReinitialize
      onSubmit={handleSubmit}
      initialValues={formData}
      validationSchema={validationSchema}
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
          <div className="grid grid-cols-1 gap-2">
            <FormField
              label="Code"
              name="code"
              type="text"
              placeholder="Enter code"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.code}
              error={errors.code}
              touched={touched.code}
              required
            />
            <FormField
              label="Name"
              name="name"
              type="text"
              placeholder="Enter name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              error={errors.name}
              touched={touched.name}
              required
            />
            <FormField
              label="Amount"
              name="amount"
              type="text"
              placeholder="Enter amount"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.amount}
              error={errors.amount}
              touched={touched.amount}
              required
            />
            <FormField
              label="Fund"
              name="fund"
              type="select"
              placeholder="Select fund"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.fund}
              error={errors.fund}
              touched={touched.fund}
              options={funds}
              required
            />
            <FormField
              name="desc"
              type="textarea"
              label="Description"
              placeholder="Enter description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.desc}
              error={errors.desc}
              touched={touched.desc}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {initialData ? 'Update' : 'Save'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default BudgetSubFundsForm;
